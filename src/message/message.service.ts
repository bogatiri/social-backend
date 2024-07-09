import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class MessageService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		return this.prisma.messages.findMany({
			where: {
				userId
			},
			include: {
				creator: true
			},
			orderBy: {
				createdAt:'asc'
			}
		})
	}

	async create(text: string,  chatId: string, userId: string,) {
		
		return this.prisma.messages.create({
			data: {
				chat: {
					connect: {
						id: chatId
					}
				},
				creator: {
					connect: {
						id: userId
					}
				},
				text
			},
			include: {
				creator: true
			}
		})
	}

	async update(textUpdatedMessage: string, id: string, userId: string) {
		return this.prisma.messages.update({
			where: {
				userId,
				id
			},
			data: {
				text: textUpdatedMessage
			},
			include: {
				creator: true
			}
		})
	}

	async delete(id: string, userId: string) {
		// Найти сначала сообщение, чтобы убедиться, что оно принадлежит пользователю
		const message = await this.prisma.messages.findFirst({
			where: {
				id,
				userId: userId,
			},
		});
	
		// Если сообщение не найдено или не принадлежит пользователю, выбросить исключение
		if (!message) {
			throw new Error('Message not found or you do not have permissions to delete this message.');
		}
	
		// Если сообщение принадлежит пользователю, тогда удаляем его
		return this.prisma.messages.delete({
			where: {
				id,
			},
		});
	}
}
