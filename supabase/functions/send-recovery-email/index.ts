import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const KIWIFY_CHECKOUT_URL = "https://pay.kiwify.com.br/vrYjxFv";
const FROM_EMAIL = "suporte@nutribebe.elitecompras.shop";
const EMAIL_SUBJECT = "Libere seu acesso ao NutriBebê Pro 🍼";

interface ProfilePayload {
  type: "INSERT";
  table: string;
  record: {
    id: string;
    user_id: string;
    nome: string | null;
    is_premium: boolean;
  };
  schema: string;
}

// Template with tracking pixel placeholder
const recoveryEmailTemplate = (name: string, trackingPixelUrl: string, ctaUrl: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8faf8;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">🍼 NutriBebê Pro</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Alimentação inteligente para o seu bebê</p>
      </div>
      
      <!-- Content -->
      <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #166534; margin: 0 0 20px 0; font-size: 24px;">
          Olá${name ? `, ${name}` : ''}! 👋
        </h2>
        
        <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
          Vi que você começou seu cadastro no <strong>NutriBebê Pro</strong>.
        </p>
        
        <p style="color: #374151; line-height: 1.7; margin: 0 0 25px 0; font-size: 16px;">
          Para ter acesso ilimitado aos cardápios, guias de cortes seguros e suporte especializado por apenas <span style="color: #16a34a; font-weight: bold; font-size: 18px;">R$ 29,90</span>, clique no botão abaixo e finalize sua assinatura.
        </p>
        
        <!-- Benefits Box -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 20px; margin: 0 0 30px 0; border-left: 4px solid #22c55e;">
          <p style="color: #166534; font-weight: 600; margin: 0 0 12px 0; font-size: 15px;">✨ O que você vai desbloquear:</p>
          <ul style="color: #374151; line-height: 1.8; padding-left: 20px; margin: 0; font-size: 14px;">
            <li>🤖 Cardápios semanais ilimitados</li>
            <li>✂️ Guias de cortes seguros por fase</li>
            <li>🍎 Receitas nutritivas adaptadas à idade</li>
            <li>👩‍⚕️ Suporte especializado</li>
          </ul>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
            ASSINAR POR R$ 29,90
          </a>
        </div>
        
        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 25px 0 0 0;">
          Acesso vitalício • Pagamento único • Sem mensalidades
        </p>
        
        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
          Dúvidas? Responda este e-mail que teremos prazer em ajudar! 💚
        </p>
      </div>
      
      <!-- Footer -->
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
        © 2024 NutriBebê Pro. Todos os direitos reservados.<br>
        <a href="https://nutribebe.lovable.app" style="color: #22c55e; text-decoration: none;">nutribebe.lovable.app</a>
      </p>
    </div>
    <!-- Tracking Pixel -->
    <img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;border:0;" />
  </body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const payload: ProfilePayload = await req.json();
    console.log("Received payload:", JSON.stringify({
      type: payload.type,
      table: payload.table,
      user_id: payload.record?.user_id,
      is_premium: payload.record?.is_premium,
    }));

    // Only process INSERT events for non-premium users
    if (payload.type !== "INSERT") {
      return new Response(
        JSON.stringify({ success: true, message: "Not an INSERT event, skipping" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (payload.record?.is_premium === true) {
      return new Response(
        JSON.stringify({ success: true, message: "User is already premium, skipping" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get user email from auth.users table
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
      payload.record.user_id
    );

    if (userError || !userData?.user?.email) {
      console.error("Error fetching user email:", userError);
      return new Response(
        JSON.stringify({ success: false, error: "Could not fetch user email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const email = userData.user.email;
    const name = payload.record.nome || "";

    // First, create the email log to get the ID for tracking
    const { data: emailLog, error: logError } = await supabase
      .from("email_logs")
      .insert({
        user_id: payload.record.user_id,
        email_to: email,
        email_type: "recovery",
        subject: EMAIL_SUBJECT,
        status: "pending",
      })
      .select("id")
      .single();

    if (logError || !emailLog) {
      console.error("Error creating email log:", logError);
      throw new Error("Failed to create email log");
    }

    const emailLogId = emailLog.id;
    
    // Build tracking URLs
    const trackingPixelUrl = `${SUPABASE_URL}/functions/v1/track-email?id=${emailLogId}&action=open`;
    const ctaClickUrl = `${SUPABASE_URL}/functions/v1/track-email?id=${emailLogId}&action=click`;
    
    // For click tracking, we'll redirect to Kiwify after tracking
    // We'll use a simple approach: track open, but clicks go directly to Kiwify
    // (Full click tracking would require a redirect endpoint)

    // Send recovery email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `NutriBebê Pro <${FROM_EMAIL}>`,
        to: [email],
        subject: EMAIL_SUBJECT,
        html: recoveryEmailTemplate(name, trackingPixelUrl, KIWIFY_CHECKOUT_URL),
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", responseData);
      
      // Update log as failed
      await supabase
        .from("email_logs")
        .update({ status: "failed" })
        .eq("id", emailLogId);
      
      throw new Error(responseData.message || "Failed to send email");
    }

    // Update log with success and resend_id
    await supabase
      .from("email_logs")
      .update({ 
        status: "sent",
        resend_id: responseData.id,
      })
      .eq("id", emailLogId);

    console.log("Recovery email sent successfully to:", email, "with tracking ID:", emailLogId);

    return new Response(
      JSON.stringify({ success: true, message: "Recovery email sent", data: responseData }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error in send-recovery-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
