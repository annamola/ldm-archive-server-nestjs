export class RedditPostDto {
  id: string;
  url: string;
  subreddit: string;
  title: string;
  body: string;
  mediaContent: string | null;
  createdUtc: number;
  ups: number;
  downs: number;

  constructor(data: any) {
    this.id = data.id;
    this.url = data.url;
    this.subreddit = data.subreddit;
    this.title = data.title;
    this.body = data.selftext_html;
    this.mediaContent = data.url_overridden_by_dest;
    this.createdUtc = data.created_utc;
    this.ups = data.ups;
    this.downs = data.downs;
  }
}
