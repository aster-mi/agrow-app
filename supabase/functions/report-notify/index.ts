import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface Payload {
  record: {
    post_id: string;
    reason: string;
  };
}

serve(async (req: Request) => {
  const { record } = (await req.json()) as Payload;
  const adminEmail = Deno.env.get('ADMIN_EMAIL');
  const apiKey = Deno.env.get('RESEND_API_KEY');

  const body = `Post ${record.post_id} was reported.\nReason: ${record.reason}`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'noreply@agrow.local',
      to: adminEmail,
      subject: 'New report received',
      text: body,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
