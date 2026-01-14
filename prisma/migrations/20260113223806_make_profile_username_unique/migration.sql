-- Step 1: First, populate username field for all existing profiles
UPDATE "Profile"
SET "username" = "User"."githubUsername"
FROM "User"
WHERE "Profile"."userId" = "User"."id" AND "Profile"."username" IS NULL;

-- Step 2: Make username NOT NULL
ALTER TABLE "Profile" ALTER COLUMN "username" SET NOT NULL;

-- Step 3: Drop the old unique constraint on userId (if it exists)
ALTER TABLE "Profile" DROP CONSTRAINT IF EXISTS "Profile_userId_key";

-- Step 4: Make userId nullable
ALTER TABLE "Profile" ALTER COLUMN "userId" DROP NOT NULL;

-- Step 5: Create unique index on username
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- Step 6: Create index on username for faster queries
CREATE INDEX "Profile_username_idx" ON "Profile"("username");
