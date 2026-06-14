/*
  Warnings:

  - You are about to drop the column `address` on the `employee_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employee_profiles" DROP COLUMN "address",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "addressProofDocument" TEXT,
ADD COLUMN     "alternatePhone" TEXT,
ADD COLUMN     "bankAccountName" TEXT,
ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "bankBranch" TEXT,
ADD COLUMN     "bankIfscCode" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "educationProofDocument" TEXT,
ADD COLUMN     "emergencyContactRelation" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "graduationYear" INTEGER,
ADD COLUMN     "highestQualification" TEXT,
ADD COLUMN     "idProofDocument" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "nationalIdNumber" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "passportNumber" TEXT,
ADD COLUMN     "personalEmail" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "previousemployer" TEXT,
ADD COLUMN     "resumeDocument" TEXT,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "taxIdNumber" TEXT,
ADD COLUMN     "totalExperienceYears" DOUBLE PRECISION,
ADD COLUMN     "university" TEXT;
