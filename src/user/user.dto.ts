import { FamilyStatus } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'


export class UserDto  {
	@IsEmail()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	name?: string

	@IsString()
	@IsOptional()
	about?: string

	@IsString()
	@IsOptional()
	lastName?: string

	@IsEnum(FamilyStatus)
	@IsOptional()
	@Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value
)
	familyStatus?: FamilyStatus

	@IsOptional()
	@IsString()
	homeTown?: string

	@IsOptional()
	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@IsString()
	password?: string

}
