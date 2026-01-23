import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const KIWIFY_CHECKOUT_URL = "https://pay.kiwify.com.br/vrYjxFv";
const FROM_EMAIL = "suporte@nutribebe.elitecompras.shop";
const EMAIL_SUBJECT = "Libere seu acesso ao NutriBebê Pro 🍼";

const recoveryEmailTemplate = (name: string, trackingPixelUrl: string, ctaUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NutriBebê Pro - Libere seu Acesso</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0fdf4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
        🍼 NutriBebê Pro
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
        Alimentação inteligente para o seu bebê
      </p>
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
      
      <p style="color: #6b7280; font-size: 13px; text-align: center; margin: 20px 0 0 0;">
        Qualquer dúvida, responda este email que ajudamos você! 💚
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;">© 2025 NutriBebê Pro - Todos os direitos reservados</p>
      <p style="margin: 5px 0 0 0;">Você recebeu este email porque se cadastrou no NutriBebê Pro</p>
    </div>
  </div>
  
  <!-- Tracking Pixel -->
  <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />
</body>
</html>
`;

interface SendResult {
  email: string;
  success: boolean;
  error?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for Resend API key
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate admin authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify user is admin using the token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: userData.user.id });
    
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all non-premium users who haven't received a recovery email yet
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, user_id, nome")
      .eq("is_premium", false);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch profiles" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, skipped: 0, failed: 0, message: "No non-premium users found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get existing email logs to avoid duplicates
    const { data: existingLogs } = await supabase
      .from("email_logs")
      .select("user_id")
      .eq("email_type", "recovery");

    const alreadySentUserIds = new Set((existingLogs || []).map(log => log.user_id));

    const results: SendResult[] = [];
    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const profile of profiles) {
      // Skip if already sent
      if (alreadySentUserIds.has(profile.user_id)) {
        skipped++;
        continue;
      }

      // Get user email from auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.user_id);

      if (authError || !authUser?.user?.email) {
        console.error(`Could not get email for user ${profile.user_id}:`, authError);
        failed++;
        results.push({ email: "unknown", success: false, error: "Could not fetch email" });
        continue;
      }

      const email = authUser.user.email;
      const name = profile.nome || "";

      // Create email log entry first
      const { data: emailLog, error: logError } = await supabase
        .from("email_logs")
        .insert({
          user_id: profile.user_id,
          email_to: email,
          email_type: "recovery",
          subject: EMAIL_SUBJECT,
          status: "pending",
        })
        .select("id")
        .single();

      if (logError || !emailLog) {
        console.error(`Could not create email log for ${email}:`, logError);
        failed++;
        results.push({ email, success: false, error: "Could not create log" });
        continue;
      }

      // Build tracking URL
      const trackingPixelUrl = `${SUPABASE_URL}/functions/v1/track-email?id=${emailLog.id}&action=open`;

      // Send email via Resend
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `NutriBebê Pro <${FROM_EMAIL}>`,
            to: [email],
            subject: EMAIL_SUBJECT,
            html: recoveryEmailTemplate(name, trackingPixelUrl, KIWIFY_CHECKOUT_URL),
          }),
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
          console.error(`Resend error for ${email}:`, resendData);
          await supabase.from("email_logs").update({ status: "failed" }).eq("id", emailLog.id);
          failed++;
          results.push({ email, success: false, error: resendData.message || "Send failed" });
          continue;
        }

        // Update log with success
        await supabase.from("email_logs").update({ 
          status: "sent",
          resend_id: resendData.id 
        }).eq("id", emailLog.id);

        sent++;
        results.push({ email, success: true });
        console.log(`Recovery email sent to ${email}`);

      } catch (sendError) {
        console.error(`Error sending to ${email}:`, sendError);
        await supabase.from("email_logs").update({ status: "failed" }).eq("id", emailLog.id);
        failed++;
        results.push({ email, success: false, error: String(sendError) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent,
        skipped,
        failed,
        total: profiles.length,
        details: results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Bulk email error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
