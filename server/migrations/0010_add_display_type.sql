-- Title: Add Display Type Setting
-- Description: Adds display_type column to devices table for distinguishing between black/white, grayscale, and color e-ink displays

-- Add display_type column
ALTER TABLE devices
ADD COLUMN IF NOT EXISTS display_type VARCHAR(20) DEFAULT 'bw';

-- Migrate existing data: if grayscale > 2, set display_type to 'grayscale'
UPDATE devices SET display_type = 'grayscale' WHERE grayscale IS NOT NULL AND grayscale > 2;

-- Add comment
COMMENT ON COLUMN devices.display_type IS 'Display type: bw (1-bit black/white), grayscale (2/4/16 levels), or color (7-color e-ink)';
