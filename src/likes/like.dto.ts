import {
	IsOptional,
	IsString,
} from 'class-validator'



export class LikeDto  {
	@IsOptional()
	@IsString()
	postId?: string

	@IsOptional()
	@IsString()
	commentId?: string
}
