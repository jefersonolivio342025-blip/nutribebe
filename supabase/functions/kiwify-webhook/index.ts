import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PIXEL_ID = "3077997939046690";
const FB_ACCESS_TOKEN = Deno.env.get("FB_ACCESS_TOKEN");

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: KiwifyPayload = await req.json();
    console.log("Kiwify webhook received:", JSON.stringify(payload, null, 2));

    // Only track completed purchases
    if (payload.order_status === "paid" || payload.order_status === "completed") {
      const fbResult = await sendFacebookConversionEvent(payload);
      console.log("Facebook tracking result:", fbResult);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Purchase event tracked",
          facebook: fbResult 
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
