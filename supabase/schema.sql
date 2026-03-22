-- Run this entire file in your Supabase SQL Editor

-- Stock table
create table if not exists stock (
  id serial primary key,
  school text not null,
  gender text not null,
  material text not null,
  size text not null,
  quantity integer not null default 0,
  created_at timestamptz default now()
);

-- Bills table
create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  invoice_no text not null,
  customer_name text not null,
  customer_class text,
  school text,
  phone text,
  billed_by text,
  subtotal numeric(10,2) not null default 0,
  gst numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  payment_mode text not null default 'Cash',
  date date not null default current_date,
  created_at timestamptz default now()
);

-- Bill items table (line items per bill)
create table if not exists bill_items (
  id serial primary key,
  bill_id uuid references bills(id) on delete cascade,
  material text not null,
  quantity integer not null,
  rate numeric(10,2) not null,
  amount numeric(10,2) not null
);

-- Employees table
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Attendance table
create table if not exists attendance (
  id serial primary key,
  employee_name text not null,
  status text check (status in ('present', 'absent')) not null,
  date date not null default current_date,
  created_at timestamptz default now()
);

-- Enable Row Level Security (open for now — lock down after adding auth)
alter table stock enable row level security;
alter table bills enable row level security;
alter table bill_items enable row level security;
alter table employees enable row level security;
alter table attendance enable row level security;

-- Allow all operations for now (update these policies once you add real auth)
create policy "Allow all on stock" on stock for all using (true) with check (true);
create policy "Allow all on bills" on bills for all using (true) with check (true);
create policy "Allow all on bill_items" on bill_items for all using (true) with check (true);
create policy "Allow all on employees" on employees for all using (true) with check (true);
create policy "Allow all on attendance" on attendance for all using (true) with check (true);

-- Seed some employees
insert into employees (name) values
  ('Rajesh Kumar'),
  ('Priya Sharma'),
  ('Amit Patel'),
  ('Sunita Gupta')
on conflict do nothing;

-- Returns table
create table if not exists returns (
  id serial primary key,
  school text not null,
  student_name text not null,
  student_class text,
  returned_material text not null,
  exchanged_material text not null,
  date date not null default current_date,
  created_at timestamptz default now()
);

alter table returns enable row level security;
create policy "Allow all on returns" on returns for all using (true) with check (true);
