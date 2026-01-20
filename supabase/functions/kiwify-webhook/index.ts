import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PIXEL_ID = "3077997939046690";
const FB_ACCESS_TOKEN = Deno.env.get("FB_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface KiwifyPayload {
  order_id: string;
  order_status: string;
  product_id: string;
  product_name: string;
  Customer: {
    email: string;
    full_name: string;
    mobile: string;
  };
  Commissions: {
    charge_amount: number;
    currency: string;
  };
  created_at: string;
}

async function sendFacebookConversionEvent(payload: KiwifyPayload) {
  if (!FB_ACCESS_TOKEN) {
    console.error("FB_ACCESS_TOKEN not configured");
    return { success: false, error: "FB_ACCESS_TOKEN not configured" };
  }

  const eventTime = Math.floor(new Date(payload.created_at).getTime() / 1000);
  const email = payload.Customer?.email?.toLowerCase().trim() || "";
  const phone = payload.Customer?.mobile?.replace(/\D/g, "") || "";

  // Hash user data for privacy (Facebook requires SHA256)
  const encoder = new TextEncoder();
  const emailHash = await crypto.subtle.digest("SHA-256", encoder.encode(email));
  const phoneHash = await crypto.subtle.digest("SHA-256", encoder.encode(phone));
  
  const hashToHex = (buffer: ArrayBuffer) => 
    Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");

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

async function updateUserPremiumStatus(payload: KiwifyPayload) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const email = payload.Customer?.email?.toLowerCase().trim();

  if (!email) {
    console.error("No email found in Kiwify payload");
    return { success: false, error: "No email in payload" };
  }

  try {
    // Find user by email in auth.users
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error listing users:", userError);
      return { success: false, error: userError.message };
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email);

    if (user) {
      // Update existing user's profile to premium
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          is_premium: true,
          nome: payload.Customer?.full_name || undefined,
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return { success: false, error: updateError.message };
      }

      console.log(`User ${email} upgraded to premium`);
      return { success: true, message: `User ${email} upgraded to premium`, userId: user.id };
    } else {
      // User not registered yet - store pending premium in a separate tracking
      console.log(`User ${email} not found - will need to claim premium after registration`);
      
      // We could create a pending_premium table, but for now just log it
      // The admin can manually upgrade them via the admin panel
      return { 
        success: true, 
        message: `User ${email} not registered yet - pending premium activation`,
        pending: true 
      };
    }
  } catch (error) {
    console.error("Error updating premium status:", error);
    return { success: false, error: String(error) };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: KiwifyPayload = await req.json();
    console.log("Kiwify webhook received:", JSON.stringify(payload, null, 2));

    // Only process completed purchases
    if (payload.order_status === "paid" || payload.order_status === "completed") {
      // Track Facebook conversion
      const fbResult = await sendFacebookConversionEvent(payload);
      console.log("Facebook tracking result:", fbResult);

      // Update user premium status
      const premiumResult = await updateUserPremiumStatus(payload);
      console.log("Premium update result:", premiumResult);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Purchase processed",
          facebook: fbResult,
          premium: premiumResult
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Order status ${payload.order_status} - not a purchase event` 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
