insert into question_packs (id, owner_user_id, title, description, visibility)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Starter Pack', 'Seed prompts for MVP local testing', 'unlisted')
on conflict (id) do nothing;

insert into question_pack_items (pack_id, prompt_text, sort_order)
values
  ('00000000-0000-0000-0000-000000000001', 'Worst thing to hear from your rideshare driver?', 1),
  ('00000000-0000-0000-0000-000000000001', 'Invent a terrible smart fridge feature.', 2),
  ('00000000-0000-0000-0000-000000000001', 'Pitch a suspiciously cheap airline.', 3),
  ('00000000-0000-0000-0000-000000000001', 'What should never be shouted at a wedding?', 4),
  ('00000000-0000-0000-0000-000000000001', 'Name a luxury item nobody needs.', 5);
