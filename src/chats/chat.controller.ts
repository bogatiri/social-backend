/* eslint-disable no-console */
import {
	Body,
	Controller,
	Delete,
	// Delete,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ChatService } from './chat.service'

@Controller('chats')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post('get-or-create')
	@Auth()
	async getorCreateChat(@CurrentUser('id') userId: string, @Body() body: any) {
		const { recipientId } = body
		return this.chatService.getOrCreateChat(userId, recipientId)
	}

	@Get(':id')
	@Auth()
	async findById(@Param('id') id: string) {
		return this.chatService.findById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get()
	@Auth()
	async getAllChats(@CurrentUser('id') userId: string) {
		return this.chatService.getAllChats(userId)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string) {
		return this.chatService.delete(id)
	}
}
