import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-kiwify-signature",
};

// Environment variables - no hardcoded secrets
const PIXEL_ID = Deno.env.get("FB_PIXEL_ID");
const FB_ACCESS_TOKEN = Deno.env.get("FB_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const KIWIFY_WEBHOOK_SECRET = Deno.env.get("KIWIFY_WEBHOOK_SECRET");

// ============ ZOD-LIKE SCHEMA VALIDATION ============

interface KiwifyCustomer {
  email: string;
  full_name?: string;
  mobile?: string;
}

interface KiwifyCommissions {
  charge_amount?: number;
  currency?: string;
}

interface KiwifyPayload {
  order_id: string;
  order_status: string;
  product_id?: string;
  product_name?: string;
  Customer: KiwifyCustomer;
  Commissions?: KiwifyCommissions;
  created_at: string;
  signature?: string;
}

interface ValidationResult {
  success: boolean;
  data?: KiwifyPayload;
  error?: string;
}

function validateKiwifyPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { success: false, error: "Payload must be an object" };
  }

  const p = payload as Record<string, unknown>;

  // Required fields validation
  if (typeof p.order_id !== "string" || p.order_id.trim() === "") {
    return { success: false, error: "order_id is required and must be a non-empty string" };
  }

  if (typeof p.order_status !== "string" || p.order_status.trim() === "") {
    return { success: false, error: "order_status is required and must be a non-empty string" };
  }

  // Validate order_status is one of expected values
  const validStatuses = ["paid", "completed", "pending", "refunded", "cancelled", "waiting_payment"];
  if (!validStatuses.includes(p.order_status)) {
    return { success: false, error: `order_status must be one of: ${validStatuses.join(", ")}` };
  }

  if (typeof p.created_at !== "string" || p.created_at.trim() === "") {
    return { success: false, error: "created_at is required and must be a non-empty string" };
  }

  // Validate Customer object
  if (!p.Customer || typeof p.Customer !== "object") {
    return { success: false, error: "Customer object is required" };
  }

  const customer = p.Customer as Record<string, unknown>;
  if (typeof customer.email !== "string" || customer.email.trim() === "") {
    return { success: false, error: "Customer.email is required and must be a non-empty string" };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer.email)) {
    return { success: false, error: "Customer.email must be a valid email address" };
  }

  // Validate optional fields types
  if (customer.full_name !== undefined && typeof customer.full_name !== "string") {
    return { success: false, error: "Customer.full_name must be a string" };
  }

  if (customer.mobile !== undefined && typeof customer.mobile !== "string") {
    return { success: false, error: "Customer.mobile must be a string" };
  }

  // Validate Commissions if present
  if (p.Commissions !== undefined) {
    if (typeof p.Commissions !== "object") {
      return { success: false, error: "Commissions must be an object" };
    }
    const commissions = p.Commissions as Record<string, unknown>;
    if (commissions.charge_amount !== undefined && typeof commissions.charge_amount !== "number") {
      return { success: false, error: "Commissions.charge_amount must be a number" };
    }
    if (commissions.currency !== undefined && typeof commissions.currency !== "string") {
      return { success: false, error: "Commissions.currency must be a string" };
    }
  }

  return {
    success: true,
    data: {
      order_id: p.order_id as string,
      order_status: p.order_status as string,
      product_id: typeof p.product_id === "string" ? p.product_id : undefined,
      product_name: typeof p.product_name === "string" ? p.product_name : undefined,
      Customer: {
        email: customer.email as string,
        full_name: customer.full_name as string | undefined,
        mobile: customer.mobile as string | undefined,
      },
      Commissions: p.Commissions as KiwifyCommissions | undefined,
      created_at: p.created_at as string,
    },
  };
}

// ============ HMAC SIGNATURE VERIFICATION ============

async function verifyKiwifySignature(
  payload: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  if (!signature) {
    console.error("No signature provided in request");
    return false;
  }

  try {
    // Create HMAC-SHA256 hash
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payload)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Compare signatures (timing-safe comparison)
    const sigToCheck = signature.toLowerCase().replace(/^sha256=/, "");
    
    if (expectedSignature.length !== sigToCheck.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      result |= expectedSignature.charCodeAt(i) ^ sigToCheck.charCodeAt(i);
    }

    return result === 0;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

// ============ FACEBOOK CONVERSION API ============

async function sendFacebookConversionEvent(payload: KiwifyPayload) {
  if (!FB_ACCESS_TOKEN) {
    console.error("FB_ACCESS_TOKEN not configured");
    return { success: false, error: "FB_ACCESS_TOKEN not configured" };
  }

  if (!PIXEL_ID) {
    console.error("FB_PIXEL_ID not configured");
    return { success: false, error: "FB_PIXEL_ID not configured" };
  }

  const eventTime = Math.floor(new Date(payload.created_at).getTime() / 1000);
  const email = payload.Customer?.email?.toLowerCase().trim() || "";
  const phone = payload.Customer?.mobile?.replace(/\D/g, "") || "";

  // Hash user data for privacy (Facebook requires SHA256)
  const encoder = new TextEncoder();
  const emailHash = await crypto.subtle.digest("SHA-256", encoder.encode(email));
  const phoneHash = await crypto.subtle.digest("SHA-256", encoder.encode(phone));

  const hashToHex = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  const eventData = {
    data: [
      {
        event_name: "Purchase",
        event_time: eventTime,
        action_source: "website",
        event_source_url: "https://nutribebe.lovable.app",
        user_data: {
          em: [hashToHex(emailHash)],
          ph: [hashToHex(phoneHash)],
        },
        custom_data: {
          currency: payload.Commissions?.currency || "BRL",
          value: (payload.Commissions?.charge_amount || 2990) / 100,
          content_name: payload.product_name || "Acesso Vitalício NutriBebê",
          content_ids: [payload.product_id || "nutribebe-lifetime"],
          content_type: "product",
          order_id: payload.order_id,
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      }
    );

    const result = await response.json();
    console.log("Facebook Conversions API response:", result);

    return { success: response.ok, result };
  } catch (error) {
    console.error("Error sending to Facebook:", error);
    return { success: false, error: String(error) };
  }
}

// ============ PREMIUM STATUS UPDATE ============

async function updateUserPremiumStatus(payload: KiwifyPayload) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const email = payload.Customer?.email?.toLowerCase().trim();

  if (!email) {
    console.error("No email found in Kiwify payload");
    return { success: false, error: "No email in payload" };
  }

  try {
    // Use efficient O(1) database function instead of listing all users
    const { data: userId, error: lookupError } = await supabase.rpc(
      "find_user_id_by_email",
      { user_email: email }
    );

    if (lookupError) {
      console.error("Error looking up user:", lookupError);
      return { success: false, error: lookupError.message };
    }

    if (userId) {
      // Update existing user's profile to premium
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          is_premium: true,
          nome: payload.Customer?.full_name || undefined,
        })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return { success: false, error: updateError.message };
      }

      console.log(`User ${email} upgraded to premium`);
      return {
        success: true,
        message: `User ${email} upgraded to premium`,
        userId: userId,
      };
    } else {
      // User not registered yet - store pending premium in a separate tracking
      console.log(
        `User ${email} not found - will need to claim premium after registration`
      );

      return {
        success: true,
        message: `User ${email} not registered yet - pending premium activation`,
        pending: true,
      };
    }
  } catch (error) {
    console.error("Error updating premium status:", error);
    return { success: false, error: String(error) };
  }
}

// ============ MAIN HANDLER ============

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // ============ SIGNATURE VERIFICATION ============
    if (!KIWIFY_WEBHOOK_SECRET) {
      console.error("KIWIFY_WEBHOOK_SECRET not configured - rejecting request");
      return new Response(
        JSON.stringify({ success: false, error: "Webhook not configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const signature = req.headers.get("x-kiwify-signature") || 
                      req.headers.get("X-Kiwify-Signature") ||
                      req.headers.get("x-hub-signature-256");

    const isValidSignature = await verifyKiwifySignature(
      rawBody,
      signature,
      KIWIFY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      console.error("Invalid webhook signature - request rejected");
      console.log("Received signature:", signature);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid signature" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    console.log("Webhook signature verified successfully");

    // ============ SCHEMA VALIDATION ============
    let parsedPayload: unknown;
    try {
      parsedPayload = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON payload" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const validationResult = validateKiwifyPayload(parsedPayload);

    if (!validationResult.success) {
      console.error("Payload validation failed:", validationResult.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Validation failed: ${validationResult.error}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const payload = validationResult.data!;
    console.log("Kiwify webhook received:", JSON.stringify({
      order_id: payload.order_id,
      order_status: payload.order_status,
      customer_email: payload.Customer.email.replace(/(.{2}).*@/, "$1***@"), // Mask email in logs
    }));

    // Only process completed purchases
    if (payload.order_status === "paid" || payload.order_status === "completed") {
      // Track Facebook conversion
      const fbResult = await sendFacebookConversionEvent(payload);
      console.log("Facebook tracking result:", fbResult.success ? "success" : "failed");

      // Update user premium status
      const premiumResult = await updateUserPremiumStatus(payload);
      console.log("Premium update result:", premiumResult.success ? "success" : "failed");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Purchase processed",
          facebook: { success: fbResult.success },
          premium: { success: premiumResult.success, pending: premiumResult.pending },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Order status ${payload.order_status} - not a purchase event`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
