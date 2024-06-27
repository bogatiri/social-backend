import { PostStatus } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
	IsEnum,
	IsOptional,
	IsString,
} from 'class-validator'



export class PostDto  {
	@IsString()
	text: string

	@IsEnum(PostStatus)
	@IsOptional()
	@Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value
)
	status?: PostStatus

	@IsOptional()
	@IsString()
	groupId?: string
}
