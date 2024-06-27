/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { PostDto } from './post.dto'
import { PostService } from './post.service'
@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Get(':id')
	@Auth()
	async findById(@Param('id') id: string) {
		return this.postService.getByUserId(id)
	}

	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post()
	@Auth()
	async create(
		@Body() data: any,
		@CurrentUser('id') userId: string,
	) {
		const {pageOwnerId, ...dto} = data
		return this.postService.create(dto, pageOwnerId, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(
		@Body() dto: PostDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.postService.update(dto, id, userId)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.postService.delete(id, userId)
	}
}
