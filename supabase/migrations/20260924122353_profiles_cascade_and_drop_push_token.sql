-- docs/M4-copy-answers.md, decisions 3 and 4 (Pavle, 24.09.2026).

-- 3. A profile follows its auth user. The key existed without a delete rule, so deleting a user
-- in the Supabase dashboard was refused rather than taking the data. With the cascade, removing
-- the user removes the profile, and the four data tables already cascade from profiles.
-- delete_my_account() is unchanged: it deletes the profile, then the user.
alter table public.profiles drop constraint profiles_id_fkey;
alter table public.profiles
  add constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade;

-- 4. push_token was never collected: every notification is local and scheduled on the phone.
-- No row ever held one.
alter table public.profiles drop column push_token;
