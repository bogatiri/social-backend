import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'

import { UserModule } from './user/user.module'
import { PostModule } from './posts/post.module'
import { LikeModule } from './likes/like.module'
import { CommentModule } from './comments/comment.module'
import { ChatModule } from './chats/chat.module'
import { MessageModule } from './message/message.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		PostModule,
		LikeModule,
		CommentModule,
		ChatModule,
		MessageModule
	]
})
export class AppModule {}
