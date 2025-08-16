CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reporter uuid NOT NULL DEFAULT auth.uid(),
  reason text,
  created_at timestamp with time zone DEFAULT now()
);

-- Trigger to call edge function when new report inserted
CREATE OR REPLACE FUNCTION notify_report()
RETURNS trigger AS $$
BEGIN
  PERFORM
    net.http_post(
      url:='https://<project-ref>.functions.supabase.co/report-notify',
      headers:='{"Content-Type":"application/json"}',
      body:=json_build_object('record', row_to_json(NEW))::text
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_report_created ON reports;
CREATE TRIGGER on_report_created
  AFTER INSERT ON reports
  FOR EACH ROW EXECUTE FUNCTION notify_report();
