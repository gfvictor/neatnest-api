import { Injectable } from "@nestjs/common";
import { User, Prisma } from "@prisma/client";
import { ObjectService } from "@neatnest/object/object.service";
import { ContainerService } from "@neatnest/container/container.service";
import { RoomService } from "@neatnest/room/room.service";
import { SectionService } from "@neatnest/section/section.service";

@Injectable()
export class SearchService {
  constructor(
    private readonly objectService: ObjectService,
    private readonly containerService: ContainerService,
    private readonly roomService: RoomService,
    private readonly sectionService: SectionService,
  ) {}

  async globalSearch(
    user: User,
    query?: string,
    scope?: "household" | "workplace",
  ) {
    if (!query || query.trim().length === 0) {
      return { objects: [], containers: [], rooms: [], sections: [] };
    }

    const searchTerm = query.trim();
    const isNumeric = !isNaN(Number(searchTerm));
    const searchNumber = isNumeric ? Number(searchTerm) : undefined;

    const accessConditions: Prisma.ContainerWhereInput[] = [];

    const shouldSearchHousehold = user.householdId && (!scope || scope === 'household');
    if (shouldSearchHousehold && user.householdId) {
      accessConditions.push({ room: { householdId: user.householdId } });
    }

    const shouldSearchWorkplace = user.workplaceId && (!scope || scope === 'workplace');
    if (shouldSearchWorkplace && user.workplaceId) {
      accessConditions.push({ section: { workplaceId: user.workplaceId } });
    }

    if (accessConditions.length === 0) {
      return { objects: [], containers: [], rooms: [], sections: [] };
    }

    const [objects, containers, rooms, sections] = await Promise.all([
      this.objectService.searchForGlobal(searchTerm, accessConditions),
      this.containerService.searchForGlobal(
        searchTerm,
        isNumeric,
        searchNumber,
        accessConditions
      ),

      shouldSearchHousehold
        ? this.roomService.searchForGlobal(searchTerm, user.householdId!)
        : Promise.resolve([]),

      shouldSearchWorkplace
        ? this.sectionService.searchForGlobal(searchTerm, user.workplaceId!)
        : Promise.resolve([]),
    ]);

    return {
      objects,
      containers,
      rooms,
      sections,
    };
  }
}
