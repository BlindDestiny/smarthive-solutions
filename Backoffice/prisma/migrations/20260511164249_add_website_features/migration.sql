-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "hasEvents" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSocial" BOOLEAN NOT NULL DEFAULT true;
