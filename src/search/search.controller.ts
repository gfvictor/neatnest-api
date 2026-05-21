import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { SearchService } from "./search.service";
import { JwtAuthGuard } from "@neatnest/auth/guard/jwt-auth.guard";
import { UserRequest } from "@neatnest/common/interfaces/user-request";

@Controller("search")
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Req() req: UserRequest,
    @Query("q") query: string,
    @Query('scope') scope?: 'household' | 'workplace',
  ) {
    return this.searchService.globalSearch(req.user, query, scope);
  }
}
