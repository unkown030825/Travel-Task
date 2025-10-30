/*
  # BookIt Application Schema

  1. New Tables
    - `experiences`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `price` (numeric)
      - `location` (text)
      - `created_at` (timestamptz)
    
    - `slots`
      - `id` (uuid, primary key)
      - `experience_id` (uuid, foreign key)
      - `date` (date)
      - `time` (text)
      - `available_count` (integer)
      - `total_count` (integer)
      - `created_at` (timestamptz)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `experience_id` (uuid, foreign key)
      - `slot_id` (uuid, foreign key)
      - `user_name` (text)
      - `user_email` (text)
      - `quantity` (integer)
      - `subtotal` (numeric)
      - `taxes` (numeric)
      - `total_price` (numeric)
      - `promo_code` (text, nullable)
      - `discount_amount` (numeric, default 0)
      - `reference_id` (text)
      - `status` (text, default 'confirmed')
      - `created_at` (timestamptz)
    
    - `promo_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `type` (text) - 'percent' or 'flat'
      - `value` (numeric)
      - `active` (boolean, default true)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to experiences and slots
    - Add policies for creating bookings
    - Add policies for reading promo codes
*/

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  price numeric NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create slots table
CREATE TABLE IF NOT EXISTS slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  date date NOT NULL,
  time text NOT NULL,
  available_count integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  slot_id uuid NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  subtotal numeric NOT NULL,
  taxes numeric NOT NULL,
  total_price numeric NOT NULL,
  promo_code text,
  discount_amount numeric DEFAULT 0,
  reference_id text NOT NULL,
  status text DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL,
  value numeric NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Experiences policies (public read)
CREATE POLICY "Anyone can view experiences"
  ON experiences FOR SELECT
  TO anon, authenticated
  USING (true);

-- Slots policies (public read)
CREATE POLICY "Anyone can view slots"
  ON slots FOR SELECT
  TO anon, authenticated
  USING (true);

-- Bookings policies
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Promo codes policies (public read)
CREATE POLICY "Anyone can view promo codes"
  ON promo_codes FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_slots_experience_id ON slots(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);

-- Insert sample promo codes
INSERT INTO promo_codes (code, type, value) VALUES
  ('SAVE10', 'percent', 10),
  ('FLAT100', 'flat', 100)
ON CONFLICT (code) DO NOTHING;