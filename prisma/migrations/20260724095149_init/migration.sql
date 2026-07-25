-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopDomain" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "merchantName" TEXT,
    "email" TEXT,
    "shopifyPlan" TEXT,
    "logo" TEXT,
    "country" TEXT,
    "currency" TEXT,
    "timeZone" TEXT,
    "installationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" DATETIME
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plan" TEXT NOT NULL DEFAULT 'Free',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "renewalDate" DATETIME,
    "merchantId" TEXT NOT NULL,
    CONSTRAINT "Subscription_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeEmail" TEXT,
    "appBlockEnabled" BOOLEAN NOT NULL DEFAULT false,
    "merchantId" TEXT NOT NULL,
    CONSTRAINT "Settings_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "position" TEXT NOT NULL DEFAULT 'top',
    "message" TEXT NOT NULL,
    "buttonText" TEXT,
    "customUrl" TEXT,
    "bgColor" TEXT NOT NULL DEFAULT '#6D5EF7',
    "textColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "btnColor" TEXT NOT NULL DEFAULT '#111827',
    "fontFamily" TEXT,
    "roundedCorners" TEXT,
    "shadows" TEXT,
    "gradientBg" TEXT,
    "glowEffect" BOOLEAN NOT NULL DEFAULT false,
    "animation" TEXT,
    "countdown" DATETIME,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "merchantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Announcement_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "ctr" REAL NOT NULL DEFAULT 0.0,
    "announcementId" TEXT NOT NULL,
    CONSTRAINT "Analytics_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BillingHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "merchantId" TEXT NOT NULL,
    CONSTRAINT "BillingHistory_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_shopDomain_key" ON "Merchant"("shopDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_merchantId_key" ON "Subscription"("merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_merchantId_key" ON "Settings"("merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_announcementId_key" ON "Analytics"("announcementId");
