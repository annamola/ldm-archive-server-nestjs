import { Injectable } from '@nestjs/common';
import { envs } from '../config/envs';

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
}
