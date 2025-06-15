import { PartialType } from '@nestjs/mapped-types';
import { CreateRedditDto } from './create-reddit.dto';

export class UpdateRedditDto extends PartialType(CreateRedditDto) {}
