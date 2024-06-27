/* eslint-disable no-console */
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { LikeDto } from './like.dto'

@Injectable()
export class LikeService {
	constructor(private prisma: PrismaService) {}

	async create(userId: string, dto: LikeDto) {
		const data: any = {
			user: {
				connect: {
					id: userId
				}
			}
		}

		if (dto.commentId) {
			data.comment = {
				connect: {
					id: dto.commentId
				}
			}
		} else {
			data.post = {
				connect: {
					id: dto.postId
				}
			}
		}

		return this.prisma.likes.create({
			data
		})
	}

	async delete(likeId: string, userId: string) {
		return this.prisma.likes.delete({
			where: {
				id: likeId,
				userId
			}
		})
	}
}
