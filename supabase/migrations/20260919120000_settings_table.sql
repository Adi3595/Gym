CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_name TEXT DEFAULT 'SMFitness Gym & Supplements',
    contact_email TEXT DEFAULT 'admin@smfitness.com',
    physical_address TEXT DEFAULT '123 Elite Fitness Blvd, Mumbai, MH 400001',
    require_mfa BOOLEAN DEFAULT false,
    low_stock_alerts BOOLEAN DEFAULT true,
    expiring_alerts BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert a default row so we always have exactly one row
INSERT INTO settings (facility_name) VALUES ('SMFitness Gym & Supplements');
