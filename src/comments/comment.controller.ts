/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { CommentDto } from './comment.dto'
import { CommentService } from './comment.service'
@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post()
	@Auth()
	async create(
		@Body() data: any,
		@CurrentUser('id') userId: string,
	) {
		const {postId, ...dto} = data
		return this.commentService.create(userId, dto, postId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(
		@Body() dto: CommentDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.commentService.update(dto, id, userId)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.commentService.delete(id, userId)
	}
}
