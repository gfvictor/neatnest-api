-- DropForeignKey
ALTER TABLE "public"."Container" DROP CONSTRAINT "Container_roomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Container" DROP CONSTRAINT "Container_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Object" DROP CONSTRAINT "Object_containerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_householdId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Section" DROP CONSTRAINT "Section_workplaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_householdId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_workplaceId_fkey";

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "public"."Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "public"."Workplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "public"."Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Section" ADD CONSTRAINT "Section_workplaceId_fkey" FOREIGN KEY ("workplaceId") REFERENCES "public"."Workplace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Container" ADD CONSTRAINT "Container_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Container" ADD CONSTRAINT "Container_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Object" ADD CONSTRAINT "Object_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "public"."Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;
