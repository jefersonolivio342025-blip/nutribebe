import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  template: "welcome" | "reminder" | "premium" | "custom";
  data?: {
    name?: string;
    customHtml?: string;
    customText?: string;
  };
}

const templates = {
  welcome: (name: string) => ({
    subject: "Bem-vindo ao NutriBebê! 🍼",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8faf8;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🍼 NutriBebê</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Alimentação saudável para o seu bebê</p>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #166534; margin: 0 0 20px 0;">Olá${name ? `, ${name}` : ''}! 👋</h2>
              <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                Seja muito bem-vindo(a) ao NutriBebê! Estamos muito felizes em ter você conosco nessa jornada de alimentação saudável para o seu bebê.
              </p>
              <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                Com o NutriBebê, você terá acesso a:
              </p>
              <ul style="color: #374151; line-height: 1.8; padding-left: 20px; margin: 0 0 20px 0;">
                <li>Cardápios semanais personalizados</li>
                <li>Receitas nutritivas e deliciosas</li>
                <li>Guia completo de introdução alimentar</li>
                <li>Lista de compras automática</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://nutribebe.lovable.app" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  Acessar o App
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                Dúvidas? Responda este e-mail que teremos prazer em ajudar! 💚
              </p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
              © 2024 NutriBebê. Todos os direitos reservados.
            </p>
          </div>
        </body>
      </html>
    `,
  }),

  reminder: (name: string) => ({
    subject: "Não esqueça de planejar as refeições! 📅",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8faf8;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">📅 Lembrete Semanal</h1>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #92400e; margin: 0 0 20px 0;">Olá${name ? `, ${name}` : ''}!</h2>
              <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                Uma nova semana está começando! Que tal planejar as refeições do seu bebê?
              </p>
              <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                Gere um novo cardápio personalizado e deixe tudo organizado para os próximos dias. 🥗
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://nutribebe.lovable.app" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  Gerar Cardápio
                </a>
              </div>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
              © 2024 NutriBebê. Todos os direitos reservados.
            </p>
          </div>
        </body>
      </html>
    `,
  }),

  premium: (name: string) => ({
    subject: "Parabéns! Você agora é Premium! ⭐",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #fdf4ff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">⭐ Bem-vindo ao Premium!</h1>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #7c3aed; margin: 0 0 20px 0;">Parabéns${name ? `, ${name}` : ''}! 🎉</h2>
              <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                Você agora tem acesso completo a todas as funcionalidades premium do NutriBebê!
              </p>
              <p style="color: #374151; line-height: 1.6; margin: 0 0 10px 0;">
                <strong>O que você desbloqueou:</strong>
              </p>
              <ul style="color: #374151; line-height: 1.8; padding-left: 20px; margin: 0 0 20px 0;">
                <li>✅ Cardápios ilimitados</li>
                <li>✅ Acesso a todas as receitas</li>
                <li>✅ Suporte prioritário</li>
                <li>✅ Novidades em primeira mão</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://nutribebe.lovable.app" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  Explorar Premium
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                Obrigado por confiar no NutriBebê! 💜
              </p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
              © 2024 NutriBebê. Todos os direitos reservados.
            </p>
          </div>
        </body>
      </html>
    `,
  }),

  custom: (_name: string, customHtml?: string) => ({
    subject: "Mensagem do NutriBebê",
    html: customHtml || "<p>Conteúdo não fornecido</p>",
  }),
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { to, subject, template, data }: EmailRequest = await req.json();

    if (!to || !template) {
      throw new Error("Missing required fields: to, template");
    }

    const name = data?.name || "";
    let emailContent;

    if (template === "custom" && data?.customHtml) {
      emailContent = templates.custom(name, data.customHtml);
    } else if (template in templates) {
      emailContent = templates[template](name);
    } else {
      throw new Error(`Unknown template: ${template}`);
    }

    // Use Resend API directly via fetch
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NutriBebê <onboarding@resend.dev>",
        to: [to],
        subject: subject || emailContent.subject,
        html: emailContent.html,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", responseData);
      throw new Error(responseData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
