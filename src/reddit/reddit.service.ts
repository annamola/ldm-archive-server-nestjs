import { Injectable } from '@nestjs/common';
import { envs } from '../config/envs';
import {
  RedditPostApiResponse,
  RedditCommentsApiResponse,
  RedditComment,
  RedditCommentReply,
} from './entities/reddit.entity';
import { RedditPostDto } from './dto/reddit-post.dto';
import { RedditCommentDto } from './dto/reddit-comment.dto';
import * as NodeCache from 'node-cache';
import { createCredentials } from 'src/config/util';

const cache = new NodeCache({ stdTTL: 3600 });

@Injectable()
export class RedditService {
  async getToken() {
    const clientId = envs.REDDIT_CLIENT_ID;
    const clientSecret = envs.REDDIT_CLIENT_SECRET;

    const tokenEndpoint = `${envs.REDDIT_API_BASE_URL}/api/v1/access_token`;
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': envs.USER_AGENT,
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }),
      });

      const data = await response.json();
      return data.access_token as string;
    } catch (error) {
      console.error('Failed to fetch Reddit access token:', error);
      throw new Error('Could not retrieve Reddit access token');
    }
  }

  async getLatestPosts(username) {
    const baseUrl = `${envs.REDDIT_API_BASE_URL}/user/${username}/submitted.json?limit=100&raw_json=1`;

    const cacheKey = `reddit-posts-${username}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const token = await this.getToken();
      const response = await fetch(baseUrl, {
        headers: {
          'User-Agent': envs.USER_AGENT,
          Authorization: createCredentials(token),
        },
      });

      const postData: RedditPostApiResponse = await response.json();
      const latestPosts = postData.data.children.map(
        (post) => new RedditPostDto(post.data),
      );

      cache.set(cacheKey, latestPosts);
      return latestPosts;
    } catch (error) {
      console.error('Failed to fetch latest posts:', error);
      throw new Error(`Could not retrieve the latest posts for ${username}`);
    }
  }

  async getComments(postId) {
    const baseUrl = `${envs.REDDIT_API_BASE_URL}/comments/${postId}.json?raw_json=1`;

    const cacheKey = `reddit-comments-${postId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const token = await this.getToken();
      const response = await fetch(baseUrl, {
        headers: {
          'User-Agent': envs.USER_AGENT,
          Authorization: createCredentials(token),
        },
      });
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok || !contentType.includes('application/json')) {
        const text = await response.text();
        const match = text.match(/<title>(.*?)<\/title>/i);
        const title = match ? match[1] : 'Unknown error page';
        throw new Error(`Reddit API error (${response.status}): ${title}`);
      }

      const commentsData: RedditCommentsApiResponse<RedditComment> =
        await response.json();
      const comments = commentsData[1].data.children.map(
        (comment: RedditCommentReply) => new RedditCommentDto(comment.data),
      );
      cache.set(cacheKey, comments);
      return comments as RedditComment[];
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw new Error(`Could not retrieve comments for post:${postId}`);
    }
  }
}
