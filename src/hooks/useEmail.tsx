import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type EmailTemplate = "welcome" | "reminder" | "premium" | "custom";

interface SendEmailParams {
  to: string;
  template: EmailTemplate;
  subject?: string;
  data?: {
    name?: string;
    customHtml?: string;
  };
}

export const useEmail = () => {
  const { toast } = useToast();

  const sendEmail = async ({ to, template, subject, data }: SendEmailParams) => {
    try {
      const { data: response, error } = await supabase.functions.invoke("send-email", {
        body: { to, template, subject, data },
      });

      if (error) {
        console.error("Error sending email:", error);
        toast({
          variant: "destructive",
          title: "Erro ao enviar email",
          description: error.message,
        });
        return { success: false, error };
      }

      console.log("Email sent successfully:", response);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error sending email:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: errorMessage,
      });
      return { success: false, error };
    }
  };

  const sendWelcomeEmail = async (to: string, name?: string) => {
    return sendEmail({
      to,
      template: "welcome",
      data: { name },
    });
  };

  const sendReminderEmail = async (to: string, name?: string) => {
    return sendEmail({
      to,
      template: "reminder",
      data: { name },
    });
  };

  const sendPremiumEmail = async (to: string, name?: string) => {
    return sendEmail({
      to,
      template: "premium",
      data: { name },
    });
  };

  const sendCustomEmail = async (to: string, subject: string, html: string) => {
    return sendEmail({
      to,
      template: "custom",
      subject,
      data: { customHtml: html },
    });
  };

  return {
    sendEmail,
    sendWelcomeEmail,
    sendReminderEmail,
    sendPremiumEmail,
    sendCustomEmail,
  };
};
