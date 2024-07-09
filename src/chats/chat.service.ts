import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'



@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async getAllChats(userId: string) {
		try {
		const chats =  await this.prisma.chats.findMany({
			where: {
				users: {
					some: {
						id: userId
					}
				}
			},
			include: {
				users: true,
				messages: {
					include: {
						creator: true
					}
				}
			},
			orderBy: {
				updatedAt: 'asc'
			}
		})
		const chatIds = chats.map(chat => chat.id);
    const messages: {[chatId: string]: any[]} = {};
    chats.forEach(chat => {
      messages[chat.id] = chat.messages;
    });

    return { chatIds, messages, chats };
  } catch (error) {
    throw error;
  }


	}

	async getOrCreateChat(userId: string, recipientId: string) {
		let chat = await this.prisma.chats.findFirst({
			where: {
				isGroup: false,
				AND: [
					{ users: { some: { id: userId } } },
					{ users: { some: { id: recipientId } } }
				]
			},
			include: {
				users: true
			}
		})

		// Если чат не найден, создаем новый
		if (!chat) {
			chat = await this.prisma.chats.create({
				data: {
					isGroup: false,
					creator: {
						connect: {
							id: userId
						}
					},
					users: {
						connect: [{ id: userId }, { id: recipientId }]
					}
				},
				include: {
					users: true
				}
			})
		}

		return chat
	}

	async findById(id: string) {
		return this.prisma.chats.findFirst({
			where: {
				id
			},
			include: {
				messages: {
					include: {
						creator: true
					}
				}
			}
		})
	}

	// async update(dto: Partial<ChatDto>, chatId: string) {
	// 	return this.prisma.chats.update({
	// 		where: {
	// 			id: chatId
	// 		},

	// 	})
	// }

	async delete(chatId: string) {
		return this.prisma.chats.delete({
			where: {
				id: chatId
			}
		})
	}
}
