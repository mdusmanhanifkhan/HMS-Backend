-- =========================
-- COMPANY TABLE
-- =========================
CREATE TABLE IF NOT EXISTS "Company" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50),
  contactPerson VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  drugRegistrationNo VARCHAR(50),
  manufacturingLicenseNo VARCHAR(50),
  ntnNumber VARCHAR(50),
  gstNumber VARCHAR(50),
  isActive BOOLEAN DEFAULT true,
  remarks VARCHAR(500),
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

-- =========================
-- DISTRIBUTOR TABLE
-- =========================
CREATE TABLE IF NOT EXISTS "Distributor" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  contactPerson VARCHAR(100),
  phone VARCHAR(20),
  mobile VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(100),
  status BOOLEAN DEFAULT true,

  -- Address Info
  addressLine1 VARCHAR(200),
  addressLine2 VARCHAR(200),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Pakistan',
  postalCode VARCHAR(20),

  -- Business / Legal Info
  ntnNumber VARCHAR(50),
  gstNumber VARCHAR(50),
  drugLicenseNo VARCHAR(50),
  registrationNo VARCHAR(50),

  -- Financial Info
  openingBalance DOUBLE PRECISION DEFAULT 0,
  balanceType VARCHAR(10),
  creditLimit DOUBLE PRECISION,
  paymentTerms VARCHAR(50),
  bankName VARCHAR(100),
  bankAccountNo VARCHAR(50),
  iban VARCHAR(50),

  remarks VARCHAR(500),

  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

-- =========================
-- JOIN TABLE (Many-to-Many)
-- =========================
CREATE TABLE IF NOT EXISTS "_DistributorCompanies" (
  "A" INTEGER NOT NULL,
  "B" INTEGER NOT NULL,

  PRIMARY KEY ("A", "B"),

  CONSTRAINT "_DistributorCompanies_A_fkey"
    FOREIGN KEY ("A") REFERENCES "Distributor"(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT "_DistributorCompanies_B_fkey"
    FOREIGN KEY ("B") REFERENCES "Company"(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "_DistributorCompanies_A_index" ON "_DistributorCompanies"("A");
CREATE INDEX IF NOT EXISTS "_DistributorCompanies_B_index" ON "_DistributorCompanies"("B");
