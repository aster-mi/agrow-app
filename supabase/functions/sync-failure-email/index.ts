import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { operation, error } = await req.json();
  const adminEmail = Deno.env.get('ADMIN_EMAIL');
  if (!adminEmail) {
    return new Response('Missing ADMIN_EMAIL', { status: 500 });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  await supabase.functions.invoke('send-email', {
    body: {
      to: adminEmail,
      subject: 'Sync Failed',
      content: `Operation ${operation?.id} failed: ${error}`
    }
  });

  return new Response('ok');
});
