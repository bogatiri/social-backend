/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Param,
	UsePipes,
	ValidationPipe,
	Post
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { LikeService } from './like.service'
import { LikeDto } from './like.dto'
@Controller('likes')
export class LikeController {
	constructor(private readonly likeService: LikeService) {}



	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post()
	@Auth()
	async create(
		@Body() dto: LikeDto,
		@CurrentUser('id') userId: string,
	) {
		return this.likeService.create(userId, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.likeService.delete(id, userId)
	}
}
