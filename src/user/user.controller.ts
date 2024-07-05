/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserService } from './user.service'
import { UserDto } from './user.dto'
@Controller('user/profile')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	@Auth()
	async findById(
		@Param('id') id: string
	) {
		return this.userService.findById( id )
	}

	@Get()
	@Auth()
	async profile(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id)
	}

	@Put('/name')
	@Auth()
	async findByName(@Body() body: any) {
		return this.userService.findByName(body.name)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	@Auth()
	async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
		return this.userService.update(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/sendRequest')
	@Auth()
	async sendRequestToFriends(@CurrentUser('id') id: string, @Body() body: any) {
		const {idRecipient} = body
		return this.userService.sendRequestToFriends(id, idRecipient)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/acceptRequest')
	@Auth()
	async acceptFriendRequest(@CurrentUser('id') id: string, @Body() body: any) {
		const {idSender, requestId} = body
		return this.userService.acceptFriendRequest(id, idSender, requestId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete('deleteRequest/:id')
	@Auth()
	async rejectFriendRequest(@Param('id') id: string) {
		return this.userService.rejectFriendRequest(id)
	}

}
