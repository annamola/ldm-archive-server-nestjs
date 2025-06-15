export interface RedditApiResponse {
  data: {
    children: { data: RedditPost }[];
  };
}

export interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  body: string;
  content: string | null;
  created_utc: number;
  ups: number;
  downs: number;
}

export interface RedditComment {
  id: string;
  subreddit: string;
  author: string;
  created_utc: number;
  body: string;
  body_html: string;
  parent_id: string;
  ups: number;
  down: number;
  replies: RedditCommentReply;
}
export interface RedditChildComment {
  data: RedditComment;
  kind: string;
}

export interface RedditCommentReply {
  data: {
    children: RedditChildComment[];
  };
}

export interface RedditSearchResult {
  id: string;
  title: string;
  subreddit: string;
  body: string;
}
