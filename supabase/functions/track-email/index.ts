import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// 1x1 transparent GIF pixel
const TRACKING_PIXEL = new Uint8Array([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00,
  0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff,
  0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00,
  0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
  0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44,
  0x01, 0x00, 0x3b
]);

serve(async (req) => {
  const url = new URL(req.url);
  const emailId = url.searchParams.get("id");
  const action = url.searchParams.get("action") || "open";

  // Always return the pixel image first (don't block on DB operations)
  const pixelResponse = new Response(TRACKING_PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });

  // Log the tracking event asynchronously
  if (emailId) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const updateField = action === "click" ? "clicked_at" : "opened_at";
      
      // Only update if not already set (first open/click)
      const { data: existingLog } = await supabase
        .from("email_logs")
        .select("opened_at, clicked_at")
        .eq("id", emailId)
        .maybeSingle();

      const shouldUpdate = existingLog && (
        (action === "click" && !existingLog.clicked_at) ||
        (action === "open" && !existingLog.opened_at)
      );

      if (shouldUpdate) {
        await supabase
          .from("email_logs")
          .update({ [updateField]: new Date().toISOString() })
          .eq("id", emailId);
        
        console.log(`Email ${action} tracked for ID: ${emailId}`);
      }
    } catch (error) {
      console.error("Error tracking email:", error);
    }
  }

  return pixelResponse;
});
