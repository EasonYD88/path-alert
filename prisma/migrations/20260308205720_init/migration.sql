-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL DEFAULT 'twitter',
    "originalText" TEXT NOT NULL,
    "alertType" TEXT NOT NULL DEFAULT 'other',
    "severity" TEXT NOT NULL DEFAULT 'info',
    "affectedLines" TEXT NOT NULL DEFAULT '[]',
    "affectedStations" TEXT NOT NULL DEFAULT '[]',
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notified" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint" TEXT NOT NULL,
    "keys" TEXT NOT NULL,
    "lines" TEXT NOT NULL DEFAULT '[]',
    "stations" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Alert_publishedAt_idx" ON "Alert"("publishedAt");

-- CreateIndex
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");

-- CreateIndex
CREATE INDEX "Alert_notified_idx" ON "Alert"("notified");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_endpoint_key" ON "Subscription"("endpoint");
