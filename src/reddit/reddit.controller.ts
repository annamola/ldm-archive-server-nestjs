import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RedditService } from './reddit.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('reddit')
export class RedditController {
  constructor(private readonly redditService: RedditService) {}

  @Get('/token')
  getToken() {
    return this.redditService.getToken();
  }

  @Get('/posts/:username')
  getLatestPosts(@Param('username') username: string) {
    return this.redditService.getLatestPosts(username);
  }
  @Get('/comments/:postId')
  getPostComments(@Param('postId') postId: string) {
    return this.redditService.getComments(postId);
  }
}
