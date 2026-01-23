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

// Email templates for Day 2 (24h) and Day 3 (48h)
const emailTemplates = {
  followup_day2: {
    subject: "Um presente para o seu bebê (e para sua tranquilidade) 🎁",
    template: (name: string, trackingPixelUrl: string, ctaUrl: string) => `
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
        <h1 style="color: white; margin: 0; font-size: 32px;">🎁 Um Presente Especial</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">NutriBebê Pro</p>
      </div>
      
      <!-- Content -->
      <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #166534; margin: 0 0 20px 0; font-size: 24px;">
          Olá${name ? `, ${name}` : ''}! 👋
        </h2>
        
        <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
          Sei que a <strong>introdução alimentar</strong> pode gerar muitas dúvidas e até um pouco de medo.
        </p>
        
        <p style="color: #374151; line-height: 1.7; margin: 0 0 25px 0; font-size: 16px;">
          Por isso, no <strong>NutriBebê Pro</strong>, além dos cardápios, incluímos o <span style="color: #16a34a; font-weight: bold;">Guia Visual de Cortes Seguros</span> para evitar engasgos.
        </p>
        
        <p style="color: #374151; line-height: 1.7; margin: 0 0 25px 0; font-size: 16px;">
          Quero muito que você faça parte da nossa comunidade. Garanta seu acesso por apenas <span style="color: #16a34a; font-weight: bold; font-size: 18px;">R$ 29,90</span> hoje.
        </p>
        
        <!-- Benefits Box -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 20px; margin: 0 0 30px 0; border-left: 4px solid #22c55e;">
          <p style="color: #166534; font-weight: 600; margin: 0 0 12px 0; font-size: 15px;">✨ O que você vai receber:</p>
          <ul style="color: #374151; line-height: 1.8; padding-left: 20px; margin: 0; font-size: 14px;">
            <li>📋 Cardápios semanais personalizados</li>
            <li>✂️ <strong>Guia Visual de Cortes Seguros</strong></li>
            <li>🍎 Receitas nutritivas adaptadas à idade</li>
            <li>👩‍⚕️ Suporte especializado</li>
          </ul>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
            LIBERAR MEU ASSISTENTE AGORA
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
`,
  },
  followup_day3: {
    subject: "Última chamada: Seu acesso ao NutriBebê Pro vai expirar ⏳",
    template: (name: string, trackingPixelUrl: string, ctaUrl: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #fef3c7;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <!-- Header - Urgency Theme -->
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">⏳ Última Chamada!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Oferta expira em breve</p>
      </div>
      
      <!-- Content -->
      <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #92400e; margin: 0 0 20px 0; font-size: 24px;">
          Olá${name ? `, ${name}` : ''}! 👋
        </h2>
        
        <p style="color: #374151; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
          Esta é a <strong>última oportunidade</strong> de garantir o <strong>NutriBebê Pro</strong> pelo valor promocional de <span style="color: #d97706; font-weight: bold; font-size: 20px;">R$ 29,90</span>.
        </p>
        
        <p style="color: #374151; line-height: 1.7; margin: 0 0 25px 0; font-size: 16px;">
          <strong>Amanhã o preço voltará ao normal.</strong> Não perca a chance de ter um assistente na palma da sua mão para todas as refeições do seu filho.
        </p>
        
        <!-- Urgency Box -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 0 0 30px 0; border-left: 4px solid #f59e0b;">
          <p style="color: #92400e; font-weight: 600; margin: 0 0 12px 0; font-size: 15px;">⚡ Por que não esperar mais?</p>
          <ul style="color: #374151; line-height: 1.8; padding-left: 20px; margin: 0; font-size: 14px;">
            <li>🔒 Valor promocional de <strong>R$ 29,90</strong> acaba hoje</li>
            <li>🎯 Acesso vitalício - pague uma vez, use para sempre</li>
            <li>📱 Comece a usar imediatamente</li>
            <li>✅ Garantia total de satisfação</li>
          </ul>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
            LIBERAR MEU ACESSO AGORA
          </a>
        </div>
        
        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 25px 0 0 0;">
          ⚠️ Oferta válida apenas até hoje à meia-noite
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
`,
  },
};

interface SendResult {
  email: string;
  success: boolean;
  error?: string;
  email_type: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Email service not configured");
    }

    console.log("Starting follow-up email automation...");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const now = new Date();
    const results: SendResult[] = [];

    // Get all non-premium profiles with their creation dates
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, user_id, nome, created_at, is_premium")
      .eq("is_premium", false);

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    console.log(`Found ${profiles?.length || 0} non-premium profiles to check`);

    // Get existing email logs to avoid duplicates
    const { data: existingLogs, error: logsError } = await supabase
      .from("email_logs")
      .select("user_id, email_type")
      .in("email_type", ["followup_day2", "followup_day3"]);

    if (logsError) {
      console.error("Error fetching existing logs:", logsError);
    }

    // Create a set of already sent emails
    const sentEmails = new Set(
      (existingLogs || []).map((log) => `${log.user_id}-${log.email_type}`)
    );

    for (const profile of profiles || []) {
      // Check if user became premium (double-check)
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("user_id", profile.user_id)
        .single();

      if (currentProfile?.is_premium) {
        console.log(`User ${profile.user_id} is now premium, skipping`);
        continue;
      }

      const createdAt = new Date(profile.created_at);
      const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      // Get user email
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
        profile.user_id
      );

      if (userError || !userData?.user?.email) {
        console.error(`Could not fetch email for user ${profile.user_id}`);
        continue;
      }

      const email = userData.user.email;
      const name = profile.nome || "";

      // Check Day 2 (24-48h after signup)
      if (
        hoursSinceCreation >= 24 &&
        hoursSinceCreation < 72 &&
        !sentEmails.has(`${profile.user_id}-followup_day2`)
      ) {
        const result = await sendFollowupEmail(
          supabase,
          profile.user_id,
          email,
          name,
          "followup_day2"
        );
        results.push(result);
        if (result.success) {
          sentEmails.add(`${profile.user_id}-followup_day2`);
        }
      }

      // Check Day 3 (48-72h after signup)
      if (
        hoursSinceCreation >= 48 &&
        hoursSinceCreation < 96 &&
        !sentEmails.has(`${profile.user_id}-followup_day3`)
      ) {
        const result = await sendFollowupEmail(
          supabase,
          profile.user_id,
          email,
          name,
          "followup_day3"
        );
        results.push(result);
        if (result.success) {
          sentEmails.add(`${profile.user_id}-followup_day3`);
        }
      }
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`Follow-up automation complete: ${sent} sent, ${failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        sent,
        failed,
        total: results.length,
        details: results,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error in follow-up email automation:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

// deno-lint-ignore no-explicit-any
async function sendFollowupEmail(
  supabase: any,
  userId: string,
  email: string,
  name: string,
  emailType: "followup_day2" | "followup_day3"
): Promise<SendResult> {
  try {
    const template = emailTemplates[emailType];

    // Create email log first
    const { data: emailLog, error: logError } = await supabase
      .from("email_logs")
      .insert({
        user_id: userId,
        email_to: email,
        email_type: emailType,
        subject: template.subject,
        status: "pending",
      })
      .select("id")
      .single();

    if (logError || !emailLog) {
      throw new Error(`Failed to create email log: ${logError?.message}`);
    }

    const emailLogId = emailLog.id;
    const trackingPixelUrl = `${SUPABASE_URL}/functions/v1/track-email?id=${emailLogId}&action=open`;

    // Send email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `NutriBebê Pro <${FROM_EMAIL}>`,
        to: [email],
        subject: template.subject,
        html: template.template(name, trackingPixelUrl, KIWIFY_CHECKOUT_URL),
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      await supabase
        .from("email_logs")
        .update({ status: "failed" })
        .eq("id", emailLogId);

      throw new Error(responseData.message || "Failed to send email");
    }

    // Update log with success
    await supabase
      .from("email_logs")
      .update({
        status: "sent",
        resend_id: responseData.id,
      })
      .eq("id", emailLogId);

    console.log(`${emailType} email sent to ${email}`);
    return { email, success: true, email_type: emailType };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to send ${emailType} to ${email}:`, errorMessage);
    return { email, success: false, error: errorMessage, email_type: emailType };
  }
}

serve(handler);
