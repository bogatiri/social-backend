import {
	IsOptional,
	IsString,
} from 'class-validator'



export class CommentDto  {
	@IsOptional()
	@IsString()
	text: string
}
