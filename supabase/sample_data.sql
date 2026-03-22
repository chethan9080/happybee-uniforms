-- Sample data for school uniform shop
-- Run this in your Supabase SQL Editor

-- Bills (20 records across last 7 days, mixed schools and payment modes)
INSERT INTO bills (id, invoice_no, customer_name, customer_class, school, phone, subtotal, gst_enabled, gst, total, payment_mode, date) VALUES

-- Day -0 (today)
('b0000001-0000-0000-0000-000000000001', 'INV-100001', 'Aarav Mehta',    '5A', 'St. Mary''s School',      '9876543210', 1000.00, false,  0.00,   1000.00, 'Cash',   CURRENT_DATE),
('b0000001-0000-0000-0000-000000000002', 'INV-100002', 'Priya Sharma',   '3B', 'Delhi Public School',     '9876543211', 1350.00, true,  243.00,  1593.00, 'Online', CURRENT_DATE),
('b0000001-0000-0000-0000-000000000003', 'INV-100003', 'Rohan Singh',    '7C', 'Kendriya Vidyalaya',      '9876543212', 2000.00, false,  0.00,   2000.00, 'Cash',   CURRENT_DATE),

-- Day -1
('b0000001-0000-0000-0000-000000000004', 'INV-100004', 'Ananya Joshi',   '4A', 'Ryan International',      '9876543213', 1800.00, true,  324.00,  2124.00, 'Online', CURRENT_DATE - INTERVAL '1 day'),
('b0000001-0000-0000-0000-000000000005', 'INV-100005', 'Kabir Das',      '6B', 'St. Mary''s School',      '9876543214',  630.00, false,  0.00,    630.00, 'Cash',   CURRENT_DATE - INTERVAL '1 day'),
('b0000001-0000-0000-0000-000000000006', 'INV-100006', 'Sneha Patel',    '2C', 'Delhi Public School',     '9876543215', 1250.00, true,  225.00,  1475.00, 'Online', CURRENT_DATE - INTERVAL '1 day'),

-- Day -2
('b0000001-0000-0000-0000-000000000007', 'INV-100007', 'Arjun Nair',     '8A', 'Kendriya Vidyalaya',      '9876543216', 2400.00, false,  0.00,   2400.00, 'Cash',   CURRENT_DATE - INTERVAL '2 days'),
('b0000001-0000-0000-0000-000000000008', 'INV-100008', 'Divya Reddy',    '1B', 'Ryan International',      '9876543217',  530.00, true,   95.40,   625.40, 'Online', CURRENT_DATE - INTERVAL '2 days'),
('b0000001-0000-0000-0000-000000000009', 'INV-100009', 'Vikram Gupta',   '9C', 'St. Mary''s School',      '9876543218', 1700.00, false,  0.00,   1700.00, 'Cash',   CURRENT_DATE - INTERVAL '2 days'),

-- Day -3
('b0000001-0000-0000-0000-000000000010', 'INV-100010', 'Meera Iyer',     '5B', 'Delhi Public School',     '9876543219', 1600.00, true,  288.00,  1888.00, 'Cash',   CURRENT_DATE - INTERVAL '3 days'),
('b0000001-0000-0000-0000-000000000011', 'INV-100011', 'Rahul Verma',    '3A', 'Kendriya Vidyalaya',      '9876543220',  900.00, false,  0.00,    900.00, 'Online', CURRENT_DATE - INTERVAL '3 days'),
('b0000001-0000-0000-0000-000000000012', 'INV-100012', 'Pooja Mishra',   '6C', 'Ryan International',      '9876543221', 2750.00, true,  495.00,  3245.00, 'Cash',   CURRENT_DATE - INTERVAL '3 days'),

-- Day -4
('b0000001-0000-0000-0000-000000000013', 'INV-100013', 'Siddharth Rao',  '4B', 'St. Mary''s School',      '9876543222', 1050.00, false,  0.00,   1050.00, 'Online', CURRENT_DATE - INTERVAL '4 days'),
('b0000001-0000-0000-0000-000000000014', 'INV-100014', 'Nisha Kapoor',   '7A', 'Delhi Public School',     '9876543223', 1950.00, true,  351.00,  2301.00, 'Cash',   CURRENT_DATE - INTERVAL '4 days'),
('b0000001-0000-0000-0000-000000000015', 'INV-100015', 'Aditya Kumar',   '2A', 'Kendriya Vidyalaya',      '9876543224',  700.00, false,  0.00,    700.00, 'Online', CURRENT_DATE - INTERVAL '4 days'),

-- Day -5
('b0000001-0000-0000-0000-000000000016', 'INV-100016', 'Riya Bansal',    '8B', 'Ryan International',      '9876543225', 3200.00, true,  576.00,  3776.00, 'Cash',   CURRENT_DATE - INTERVAL '5 days'),
('b0000001-0000-0000-0000-000000000017', 'INV-100017', 'Manish Tiwari',  '5C', 'St. Mary''s School',      '9876543226', 1100.00, false,  0.00,   1100.00, 'Online', CURRENT_DATE - INTERVAL '5 days'),

-- Day -6
('b0000001-0000-0000-0000-000000000018', 'INV-100018', 'Kavya Nambiar',  '3C', 'Delhi Public School',     '9876543227', 1450.00, true,  261.00,  1711.00, 'Cash',   CURRENT_DATE - INTERVAL '6 days'),
('b0000001-0000-0000-0000-000000000019', 'INV-100019', 'Harsh Agarwal',  '6A', 'Kendriya Vidyalaya',      '9876543228', 2200.00, false,  0.00,   2200.00, 'Online', CURRENT_DATE - INTERVAL '6 days'),
('b0000001-0000-0000-0000-000000000020', 'INV-100020', 'Tanvi Desai',    '9A', 'Ryan International',      '9876543229', 1300.00, true,  234.00,  1534.00, 'Cash',   CURRENT_DATE - INTERVAL '6 days');


-- Bill Items (2-4 items per bill, rates: Shirt=450, Pant=550, Sweater=800, Tie=150, Belt=120, Socks=80, Blazer=1200)

INSERT INTO bill_items (bill_id, material, quantity, rate, amount) VALUES
-- Bill 1: subtotal=1000 (Shirt×1=450, Pant×1=550)
('b0000001-0000-0000-0000-000000000001', 'Shirt',   1, 450.00,  450.00),
('b0000001-0000-0000-0000-000000000001', 'Pant',    1, 550.00,  550.00),

-- Bill 2: subtotal=1350 (Shirt×1=450, Sweater×1=800, Tie×1=150) → gst=243, total=1593
('b0000001-0000-0000-0000-000000000002', 'Shirt',   1, 450.00,  450.00),
('b0000001-0000-0000-0000-000000000002', 'Sweater', 1, 800.00,  800.00),
('b0000001-0000-0000-0000-000000000002', 'Tie',     1, 150.00,  150.00) ,

-- Bill 3: subtotal=2000 (Blazer×1=1200, Shirt×1=450, Belt×1=120, Socks×2=160... wait: 1200+450+120+80+80=1930... use Pant×1=550+Blazer×1=1200+Belt×1=120+Socks×1=80+Tie×1=150=2100... use Shirt×2=900+Pant×2=1100=2000)
('b0000001-0000-0000-0000-000000000003', 'Shirt',   2, 450.00,  900.00),
('b0000001-0000-0000-0000-000000000003', 'Pant',    2, 550.00, 1100.00),

-- Bill 4: subtotal=1800 (Blazer×1=1200, Tie×2=300, Belt×1=120, Socks×2=160... 1200+300+120+160=1780... use Blazer×1=1200+Shirt×1=450+Belt×1=120+Socks×1=80=1850... use Blazer×1=1200+Pant×1=550+Socks×1=80-30... use Shirt×2=900+Pant×1=550+Tie×1=150+Belt×1=120+Socks×1=80=1800)
('b0000001-0000-0000-0000-000000000004', 'Shirt',   2, 450.00,  900.00),
('b0000001-0000-0000-0000-000000000004', 'Pant',    1, 550.00,  550.00),
('b0000001-0000-0000-0000-000000000004', 'Tie',     1, 150.00,  150.00),
('b0000001-0000-0000-0000-000000000004', 'Belt',    1, 120.00,  120.00),
('b0000001-0000-0000-0000-000000000004', 'Socks',   1,  80.00,   80.00),

-- Bill 5: subtotal=630 (Tie×1=150, Belt×1=120, Socks×2=160, Shirt×0... Tie×2=300+Belt×1=120+Socks×1=80+Shirt×0... Pant×1=550+Socks×1=80=630)
('b0000001-0000-0000-0000-000000000005', 'Pant',    1, 550.00,  550.00),
('b0000001-0000-0000-0000-000000000005', 'Socks',   1,  80.00,   80.00),

-- Bill 6: subtotal=1250 (Shirt×1=450, Sweater×1=800=1250) → gst=225, total=1475
('b0000001-0000-0000-0000-000000000006', 'Shirt',   1, 450.00,  450.00),
('b0000001-0000-0000-0000-000000000006', 'Sweater', 1, 800.00,  800.00),

-- Bill 7: subtotal=2400 (Blazer×2=2400)
('b0000001-0000-0000-0000-000000000007', 'Blazer',  2, 1200.00, 2400.00),

-- Bill 8: subtotal=530 (Tie×1=150, Belt×1=120, Socks×2=160, Shirt×0... Tie×2=300+Belt×1=120+Socks×1=80+Tie×0... Shirt×1=450+Socks×1=80=530) → gst=95.40, total=625.40
('b0000001-0000-0000-0000-000000000008', 'Shirt',   1, 450.00,  450.00),
('b0000001-0000-0000-0000-000000000008', 'Socks',   1,  80.00,   80.00),

-- Bill 9: subtotal=1700 (Shirt×1=450, Pant×1=550, Sweater×1=800... 450+550+800=1800... Shirt×1=450+Pant×1=550+Tie×1=150+Belt×1=120+Socks×1=80+Socks×1=80... use Shirt×1=450+Pant×1=550+Belt×1=120+Socks×1=80+Tie×1=150+Socks×1=80=1430... use Blazer×1=1200+Shirt×1=450+Socks×1=80-30... use Pant×2=1100+Shirt×1=450+Belt×1=120+Socks×1=80-50... use Blazer×1=1200+Tie×1=150+Belt×1=120+Socks×1=80+Socks×1=80+Socks×1=70... use Shirt×2=900+Pant×1=550+Belt×1=120+Socks×1=80+Tie×1=150-100... use Shirt×1=450+Pant×2=1100+Belt×1=120+Socks×1=80-50... Shirt×1=450+Pant×2=1100+Tie×1=150=1700)
('b0000001-0000-0000-0000-000000000009', 'Shirt',   1, 450.00,  450.00),
('b0000001-0000-0000-0000-000000000009', 'Pant',    2, 550.00, 1100.00),
('b0000001-0000-0000-0000-000000000009', 'Tie',     1, 150.00,  150.00),

-- Bill 10: subtotal=1600 (Shirt×2=900+Pant×1=550+Belt×1=120+Socks×1=80-50... Shirt×1=450+Pant×1=550+Sweater×1=800-200... Blazer×1=1200+Tie×1=150+Belt×1=120+Socks×1=80+Socks×1=50... Shirt×2=900+Pant×1=550+Tie×1=150=1600) → gst=288, total=1888
('b0000001-0000-0000-0000-000000000010', 'Shirt',   2, 450.00,  900.00),
('b0000001-0000-0000-0000-000000000010', 'Pant',    1, 550.00,  550.00),
('b0000001-0000-0000-0000-000000000010', 'Tie',     1, 150.00,  150.00),

-- Bill 11: subtotal=900 (Shirt×2=900)
('b0000001-0000-0000-0000-000000000011', 'Shirt',   2, 450.00,  900.00),

-- Bill 12: subtotal=2750 (Blazer×2=2400+Tie×1=150+Belt×1=120+Socks×1=80=2750) → gst=495, total=3245
('b0000001-0000-0000-0000-000000000012', 'Blazer',  2, 1200.00, 2400.00),
('b0000001-0000-0000-0000-000000000012', 'Tie',     1,  150.00,  150.00),
('b0000001-0000-0000-0000-000000000012', 'Belt',    1,  120.00,  120.00),
('b0000001-0000-0000-0000-000000000012', 'Socks',   1,   80.00,   80.00),

-- Bill 13: subtotal=1050 (Shirt×1=450+Pant×1=550+Socks×1=80-30... Shirt×1=450+Belt×1=120+Sweater×0... Pant×1=550+Shirt×1=450+Socks×1=80-30... Tie×1=150+Pant×1=550+Shirt×1=450-100... Shirt×1=450+Pant×1=550+Socks×1=50... use Shirt×1=450+Pant×1=550+Belt×1=50... use Shirt×2=900+Belt×1=120+Socks×1=30... use Shirt×1=450+Sweater×1=800-200... use Pant×1=550+Sweater×1=800-300... use Tie×1=150+Pant×1=550+Shirt×1=450-100... use Shirt×1=450+Pant×1=550+Belt×1=50... Shirt×1=450+Pant×1=550+Tie×1=50... Blazer×0... use Belt×1=120+Socks×1=80+Shirt×1=450+Pant×1=550-150... use Shirt×1=450+Pant×1=550+Socks×1=50... Shirt×2=900+Belt×1=120+Socks×1=30... Shirt×1=450+Pant×1=550+Belt×1=50... use Tie×7=1050)
('b0000001-0000-0000-0000-000000000013', 'Tie',     7, 150.00, 1050.00),

-- Bill 14: subtotal=1950 (Blazer×1=1200+Shirt×1=450+Tie×1=150+Belt×1=120+Socks×1=80-50... Blazer×1=1200+Pant×1=550+Belt×1=120+Socks×1=80=1950) → gst=351, total=2301
('b0000001-0000-0000-0000-000000000014', 'Blazer',  1, 1200.00, 1200.00),
('b0000001-0000-0000-0000-000000000014', 'Pant',    1,  550.00,  550.00),
('b0000001-0000-0000-0000-000000000014', 'Belt',    1,  120.00,  120.00),
('b0000001-0000-0000-0000-000000000014', 'Socks',   1,   80.00,   80.00),

-- Bill 15: subtotal=700 (Shirt×1=450+Belt×1=120+Socks×1=80+Tie×0... Shirt×1=450+Tie×1=150+Belt×1=100... Shirt×1=450+Tie×1=150+Socks×1=80+Belt×0... Shirt×1=450+Tie×1=150+Socks×1=80+Belt×1=20... use Pant×1=550+Belt×1=120+Socks×1=30... use Shirt×1=450+Belt×1=120+Socks×1=80+Tie×0... Shirt×1=450+Tie×1=150+Socks×1=80+Belt×1=20... use Tie×1=150+Pant×1=550=700)
('b0000001-0000-0000-0000-000000000015', 'Tie',     1, 150.00,  150.00),
('b0000001-0000-0000-0000-000000000015', 'Pant',    1, 550.00,  550.00),

-- Bill 16: subtotal=3200 (Blazer×2=2400+Shirt×1=450+Pant×1=550-200... Blazer×2=2400+Sweater×1=800=3200) → gst=576, total=3776
('b0000001-0000-0000-0000-000000000016', 'Blazer',  2, 1200.00, 2400.00),
('b0000001-0000-0000-0000-000000000016', 'Sweater', 1,  800.00,  800.00),

-- Bill 17: subtotal=1100 (Shirt×1=450+Pant×1=550+Belt×1=100... Shirt×1=450+Pant×1=550+Socks×1=80+Belt×1=20... use Shirt×1=450+Pant×1=550+Socks×1=80+Belt×1=20... use Sweater×1=800+Tie×1=150+Belt×1=120+Socks×1=30... use Sweater×1=800+Tie×2=300=1100)
('b0000001-0000-0000-0000-000000000017', 'Sweater', 1, 800.00,  800.00),
('b0000001-0000-0000-0000-000000000017', 'Tie',     2, 150.00,  300.00),

-- Bill 18: subtotal=1450 (Shirt×1=450+Sweater×1=800+Belt×1=120+Socks×1=80=1450) → gst=261, total=1711
('b0000001-0000-0000-0000-000000000018', 'Shirt',   1, 450.00,  450.00),
('b0000001-0000-0000-0000-000000000018', 'Sweater', 1, 800.00,  800.00),
('b0000001-0000-0000-0000-000000000018', 'Belt',    1, 120.00,  120.00),
('b0000001-0000-0000-0000-000000000018', 'Socks',   1,  80.00,   80.00),

-- Bill 19: subtotal=2200 (Blazer×1=1200+Shirt×2=900+Belt×1=100... Blazer×1=1200+Pant×1=550+Shirt×1=450=2200)
('b0000001-0000-0000-0000-000000000019', 'Blazer',  1, 1200.00, 1200.00),
('b0000001-0000-0000-0000-000000000019', 'Pant',    1,  550.00,  550.00),
('b0000001-0000-0000-0000-000000000019', 'Shirt',   1,  450.00,  450.00),

-- Bill 20: subtotal=1300 (Shirt×1=450+Pant×1=550+Tie×1=150+Belt×1=120+Socks×1=30... Shirt×1=450+Pant×1=550+Tie×2=300=1300) → gst=234, total=1534
('b0000001-0000-0000-0000-000000000020', 'Shirt',   1, 450.00,  450.00),
('b0000001-0000-0000-0000-000000000020', 'Pant',    1, 550.00,  550.00),
('b0000001-0000-0000-0000-000000000020', 'Tie',     2, 150.00,  300.00);
