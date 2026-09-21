-- quiz_submissions holds real email addresses. Its two policies were on role `public`, which
-- includes every holder of the publishable key: that key ships inside the app bundle and in the
-- website's client, so anyone could insert rows and update every row in the table.
--
-- Nothing legitimate used them. The website writes only from server route handlers
-- (/api/quiz and /api/waitlist) through getSupabaseAdmin(), and the service role bypasses RLS.
-- The browser never talks to Supabase at all, in either the site or the app.
--
-- RLS stays enabled, so with no policies the table is default-deny for everyone but the server.
drop policy "Allow server inserts" on public.quiz_submissions;

drop policy "Allow server updates" on public.quiz_submissions;
