/*
  Warnings:

  - Added the required column `vehicleNo` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "farmerId" TEXT NOT NULL,
    "harvestId" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "mandiId" TEXT NOT NULL,
    "arrivalDate" DATETIME NOT NULL,
    "slotTime" TEXT NOT NULL,
    "vehicleNo" TEXT NOT NULL DEFAULT 'NOT-SET',
    "quantityQuintals" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_mandiId_fkey" FOREIGN KEY ("mandiId") REFERENCES "Mandi" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("arrivalDate", "createdAt", "cropId", "farmerId", "harvestId", "id", "mandiId", "quantityQuintals", "slotTime", "vehicleNo") SELECT "arrivalDate", "createdAt", "cropId", "farmerId", "harvestId", "id", "mandiId", "quantityQuintals", "slotTime", 'NOT-SET' FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE UNIQUE INDEX "Booking_harvestId_key" ON "Booking"("harvestId");
CREATE INDEX "Booking_mandiId_arrivalDate_idx" ON "Booking"("mandiId", "arrivalDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
