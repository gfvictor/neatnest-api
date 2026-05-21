import { Module } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { ObjectModule } from "@neatnest/object/object.module";
import { ContainerModule } from "@neatnest/container/container.module";
import { RoomModule } from "@neatnest/room/room.module";
import { SectionModule } from "@neatnest/section/section.module";

@Module({
  imports: [ObjectModule, ContainerModule, RoomModule, SectionModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
