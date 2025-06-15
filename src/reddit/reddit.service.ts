import { Injectable } from '@nestjs/common';
import { envs } from '../config/envs';
import { RedditApiResponse } from 'src/shared/Reddit.type';
import * as NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });

@Injectable()
export class RedditService {
  async getToken() {
    const clientId = envs.REDDIT_CLIENT_ID;
    const clientSecret = envs.REDDIT_CLIENT_SECRET;

    const tokenEndpoint = 'https://www.reddit.com/api/v1/access_token';
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();
      return data.access_token as string;
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Access Token Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  async getLatestPosts(username, token) {
    const cacheKey = `reddit-posts-${username}`;

    // Try to get from cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const credentials = Buffer.from(`bearer ${token}`).toString('base64');
      const baseUrl = `https://www.reddit.com/user/${username}/submitted.json?limit=100&raw_json=1`;
      const response = await fetch(baseUrl, {
        headers: {
          'User-Agent': envs.USER_AGENT,
          Authorization: credentials,
        },
      });
      const postData: RedditApiResponse = await response.json();
      const latestPosts = postData.data.children.map((post) => post.data);

      cache.set(cacheKey, latestPosts);

      return latestPosts;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching user posts.');
    }
  }
}
