-- CreateEnum
CREATE TYPE "PortRole" AS ENUM ('ORIGIN', 'DESTINATION');

-- CreateEnum
CREATE TYPE "PortStatus" AS ENUM ('active', 'passive');

-- CreateTable
CREATE TABLE "ports" (
    "id" SERIAL NOT NULL,
    "unlocode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "port_role" "PortRole" NOT NULL,
    "status" "PortStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ports_unlocode_key" ON "ports"("unlocode");

-- CreateIndex
CREATE INDEX "ports_country_idx" ON "ports"("country");

-- CreateIndex
CREATE INDEX "ports_status_idx" ON "ports"("status");

-- CreateIndex
CREATE INDEX "ports_port_role_idx" ON "ports"("port_role");
