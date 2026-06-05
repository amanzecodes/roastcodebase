-- CreateEnum
CREATE TYPE "roast_status" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "finding_severity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "github_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "avatar_url" TEXT,
    "access_token" TEXT NOT NULL,
    "roast_count_today" INTEGER NOT NULL DEFAULT 0,
    "roast_count_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roasts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "repo_owner" TEXT NOT NULL,
    "repo_name" TEXT NOT NULL,
    "repo_url" TEXT NOT NULL,
    "repo_description" TEXT,
    "default_branch" TEXT,
    "file_count" INTEGER,
    "total_bytes" INTEGER,
    "status" "roast_status" NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "error_message" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "share_slug" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roast_files" (
    "id" TEXT NOT NULL,
    "roast_id" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "language" TEXT,
    "size_bytes" INTEGER,
    "was_scanned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roast_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_findings" (
    "id" TEXT NOT NULL,
    "roast_id" TEXT NOT NULL,
    "severity" "finding_severity" NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file_path" TEXT,
    "line_number" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_findings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_github_id_key" ON "users"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "roasts_share_slug_key" ON "roasts"("share_slug");

-- CreateIndex
CREATE INDEX "roasts_user_id_idx" ON "roasts"("user_id");

-- CreateIndex
CREATE INDEX "roasts_status_idx" ON "roasts"("status");

-- CreateIndex
CREATE INDEX "roasts_share_slug_idx" ON "roasts"("share_slug");

-- CreateIndex
CREATE INDEX "roast_files_roast_id_idx" ON "roast_files"("roast_id");

-- CreateIndex
CREATE INDEX "security_findings_roast_id_idx" ON "security_findings"("roast_id");

-- CreateIndex
CREATE INDEX "security_findings_severity_idx" ON "security_findings"("severity");

-- AddForeignKey
ALTER TABLE "roasts" ADD CONSTRAINT "roasts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roast_files" ADD CONSTRAINT "roast_files_roast_id_fkey" FOREIGN KEY ("roast_id") REFERENCES "roasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_findings" ADD CONSTRAINT "security_findings_roast_id_fkey" FOREIGN KEY ("roast_id") REFERENCES "roasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
