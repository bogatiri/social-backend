/* eslint-disable no-console */
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PostDto } from './post.dto'

@Injectable()
export class PostService {
	constructor(private prisma: PrismaService) {}

	async getByUserId(userId: string) {
		return this.prisma.posts.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				creator: true,
				pageOwner: true,
				likes: true,
				comments: {
					orderBy: {
						createdAt: 'asc'
					},
					include: {
						likes: true
					}
				}
			}
		})
	}

	async create(dto: PostDto, id: string, userId: string) {
		const { groupId, ...dato } = dto

		const data: any = {
			...dato,
			creator: {
				connect: {
					id: userId
				}
			}
		}

		if (groupId) {
			data.group = {
				connect: {
					id: groupId
				}
			}
		} else {
			data.pageOwner = {
				connect: {
					id
				}
			}
		}

		return this.prisma.posts.create({
			data
		})
	}

	async update(dto: PostDto, id: string, userId: string) {
		return await this.prisma.posts.update({
			where: {
				id,
				userId
			},
			data: {
				...dto
			}
		})
	}

	async delete(postId: string, userId: string) {
		const postCreator = await this.prisma.posts.findUnique({
			where: {
				id: postId
			},
			include: {
				pageOwner: true,
				group: true
			}
		})

		if (
			!(postCreator.userId === userId || postCreator.pageOwner.id === userId || postCreator.userId === postCreator.group.userId)
		) {
			return {
				success: false,
				message: `You can't delete this post`
			}
		}

		if (postCreator.userId === userId || postCreator.pageOwner.id === userId || postCreator.userId === postCreator.group.userId) {
			const deletedPost = await this.prisma.posts.delete({
				where: {
					userId,
					id: postId
				}
			})
			return {
				success: true,
				message: 'Post deleted successfully',
				data: deletedPost
			}
		}
	}
}
