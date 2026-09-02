-- AlterTable
ALTER TABLE "WhoopDailyEnergy" ADD COLUMN "recoveryScore" DOUBLE PRECISION;
ALTER TABLE "WhoopDailyEnergy" ADD COLUMN "hrvMs" DOUBLE PRECISION;
ALTER TABLE "WhoopDailyEnergy" ADD COLUMN "restingHeartRate" DOUBLE PRECISION;
ALTER TABLE "WhoopDailyEnergy" ADD COLUMN "sleepPerformancePct" DOUBLE PRECISION;
ALTER TABLE "WhoopDailyEnergy" ADD COLUMN "sleepMinutes" DOUBLE PRECISION;
ALTER TABLE "WhoopDailyEnergy" ADD COLUMN "workoutCount" INTEGER;
ALTER TABLE "WhoopDailyEnergy" ADD COLUMN "workoutSummary" TEXT;
