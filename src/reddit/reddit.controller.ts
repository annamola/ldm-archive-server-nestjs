import { Controller, Get, Post, Body } from '@nestjs/common';
import { RedditService } from './reddit.service';
import { LatestPosts } from './dto/latest-posts.dto';

@Controller('reddit')
export class RedditController {
  constructor(private readonly redditService: RedditService) {}

  @Get('/token')
  getToken() {
    return this.redditService.getToken();
  }

  @Post('/posts/latest')
  getLatestPosts(@Body() latestPosts: LatestPosts) {
    return this.redditService.getLatestPosts(
      latestPosts.username,
      latestPosts.token,
    );
  }
}
