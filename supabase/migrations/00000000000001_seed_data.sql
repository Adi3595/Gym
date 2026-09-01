-- ==========================================
-- AURA GYM ERP - SAMPLE SEED DATA
-- ==========================================

-- 1. Insert Membership Plans
INSERT INTO membership_plans (id, name, duration_days, price, features) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Monthly Flex', 30, 2500.00, '["Full Gym Access", "Locker Room", "1 Free PT Session"]'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'Quarterly Pro', 90, 6500.00, '["Full Gym Access", "Diet Plan", "Group Classes"]'::jsonb),
  ('33333333-3333-3333-3333-333333333333', 'Annual Elite', 365, 20000.00, '["VIP Access", "Free Supplements", "Dedicated Locker"]'::jsonb);

-- 2. Insert Members
INSERT INTO members (id, first_name, last_name, email, phone, gender, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Aditya', 'Sharma', 'adi@example.com', '9876543210', 'Male', 'Active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Priya', 'Patel', 'priya@example.com', '9876543211', 'Female', 'Active'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Rahul', 'Verma', 'rahul@example.com', '9876543212', 'Male', 'Expired');

-- 3. Insert Subscriptions
INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, amount_paid, payment_status) VALUES
  -- Active sub (Aditya)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '355 days', 20000.00, 'Completed'),
  -- Active sub ending soon (Priya)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE + INTERVAL '1 days', 2500.00, 'Completed'),
  -- Expired exactly 10 days ago (Rahul - for testing email bot)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', 2500.00, 'Completed');

-- 4. Insert Product Categories & Brands
INSERT INTO product_categories (id, name, description) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Supplements', 'Protein, Creatine, Pre-workouts'),
  ('c2222222-2222-2222-2222-222222222222', 'Apparel', 'T-shirts, Shakers, Gym Bags');

INSERT INTO brands (id, name) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Optimum Nutrition'),
  ('b2222222-2222-2222-2222-222222222222', 'MuscleTech');

-- 5. Insert Products
INSERT INTO products (id, name, category_id, brand_id, sku, purchase_price, selling_price, mrp, current_stock) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'ON Gold Standard Whey 2kg', 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'WHEY-ON-2KG', 4500.00, 5500.00, 6000.00, 25),
  ('d2222222-2222-2222-2222-222222222222', 'MuscleTech Creatine 400g', 'c1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 'CREA-MT-400G', 800.00, 1200.00, 1500.00, 40),
  ('d3333333-3333-3333-3333-333333333333', 'Aura Gym Premium Shaker', 'c2222222-2222-2222-2222-222222222222', NULL, 'SHAKER-01', 150.00, 350.00, 450.00, 100);

-- 6. Insert POS Sales (To generate dashboard MRR/Revenue data)
INSERT INTO sales (id, member_id, total_amount, final_amount, payment_method) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5500.00, 5500.00, 'UPI'),
  ('e2222222-2222-2222-2222-222222222222', NULL, 1550.00, 1550.00, 'Cash'); -- Walk-in customer

INSERT INTO sale_items (sale_id, product_id, quantity, price, total) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 1, 5500.00, 5500.00),
  ('e2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 1, 1200.00, 1200.00),
  ('e2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', 1, 350.00, 350.00);

-- 7. Insert Attendance (To show "Active Now" on dashboard)
INSERT INTO attendance (member_id, check_in_time) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '45 minutes'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW() - INTERVAL '15 minutes');
