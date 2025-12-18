/*
  # Create QR History Table

  1. New Tables
    - `qr_history`
      - `id` (uuid, primary key, auto-generated)
      - `text` (text, not null) - the input text/URL that was converted to QR
      - `created_at` (timestamp, auto-generated) - when the QR was generated

  2. Security
    - Enable RLS on `qr_history` table
    - Add policy allowing anyone to insert (no auth required)
    - Add policy allowing anyone to read (no auth required)

  3. Indexes
    - Index on `created_at` for efficient sorting and filtering
*/

CREATE TABLE IF NOT EXISTS qr_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE qr_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
  ON qr_history FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert"
  ON qr_history FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_qr_history_created_at
  ON qr_history(created_at DESC);
