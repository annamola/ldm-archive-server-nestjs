import { RedditCommentReply } from '../entities/reddit.entity';

export class RedditCommentDto {
  id: string;
  parentId: string;
  subreddit: string;
  author: string;
  createdUtc: number;
  body: string;
  bodyHtml: string;
  ups: number;
  downs: number;
  replies: RedditCommentReply;

  constructor(data: any) {
    this.id = data.id;
    this.parentId = data.parent_id;
    this.subreddit = data.subreddit;
    this.author = data.author;
    this.createdUtc = data.created_utc;
    this.body = data.body;
    this.bodyHtml = data.body_html;
    this.ups = data.ups;
    this.downs = data.downs;

    this.replies = data.replies;

    if (
      data.replies &&
      data.replies.data &&
      Array.isArray(data.replies.data.children)
    ) {
      const replies = data.replies.data.children
        .filter((child: any) => child.kind === 't1' || child.kind === 'Listing') // t1 = comment
        .map((child: any) => {
          return new RedditCommentDto(child.data);
        });
      this.replies = {
        kind: 'Listing',
        data: {
          children: replies,
        },
      };
    }
  }
}
