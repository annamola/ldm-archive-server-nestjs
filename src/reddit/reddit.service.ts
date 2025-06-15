import { Injectable } from '@nestjs/common';
import { CreateRedditDto } from './dto/create-reddit.dto';
import { UpdateRedditDto } from './dto/update-reddit.dto';

@Injectable()
export class RedditService {
  create(createRedditDto: CreateRedditDto) {
    return 'This action adds a new reddit';
  }

  findAll() {
    return `This action returns all reddit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reddit`;
  }

  update(id: number, updateRedditDto: UpdateRedditDto) {
    return `This action updates a #${id} reddit`;
  }

  remove(id: number) {
    return `This action removes a #${id} reddit`;
  }
}
