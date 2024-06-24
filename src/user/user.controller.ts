/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import {
	Controller,
	Get,
	Param,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserService } from './user.service'
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
}
