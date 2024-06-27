/* eslint-disable no-console */
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CommentDto } from './comment.dto'

@Injectable()
export class CommentService {
	constructor(private prisma: PrismaService) {}

	async create(userId: string, dto: CommentDto, id: string) {
		return this.prisma.comments.create({
			data: {
				...dto,
				creator: {
					connect: {
						id: userId
					}
				},
				post: {
					connect: {
						id
					}
				}
			}
		})
	}

	async update(dto: CommentDto, id: string, userId: string) {
		return await this.prisma.comments.update({
			where: {
				id,
				userId
			},
			data: {
				...dto
			}
		})
	}


	async delete(commentId: string, userId: string) {
		const deletingComment = await this.prisma.comments.findUnique({
			where: {
				id: commentId
			},
			include: {
				post: {
					include: {
						pageOwner: true,
						group: true
					}
				}
			}
		})

		if (
			!(deletingComment.userId === userId || deletingComment.post.pageOwner.id === userId || deletingComment.userId === deletingComment.post.group.userId)
		) {
			return {
				success: false,
				message: `You can't delete this comment`
			}
		}

		if (deletingComment.userId === userId || deletingComment.post.pageOwner.id === userId || deletingComment.userId === deletingComment.post.group.userId) {
			const deletedComment = await this.prisma.comments.delete({
				where: {
					id: commentId
				}
			})
			return {
				success: true,
				message: 'Comment deleted successfully',
				data: deletedComment
			}
		}
	}
}
