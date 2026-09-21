CREATE POLICY "Allow server updates" ON quiz_submissions
  FOR UPDATE USING (true) WITH CHECK (true);
