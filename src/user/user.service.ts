/* eslint-disable no-console */
import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import * as fs from 'fs'
import * as path from 'path'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'

import { RequestStatus } from '@prisma/client'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
	private readonly uploadPath = 'static/uploads/avatars'

	constructor(private prisma: PrismaService) {
		const fullUploadPath = path.resolve(this.uploadPath)
		if (!fs.existsSync(fullUploadPath)) {
			fs.mkdirSync(fullUploadPath, { recursive: true })
		}
	}

	async getAvatar(image: string) {
		const basePath = path.join(__dirname, '..', '..')
		const fullPath = path.join(basePath, image)
		const avatarBuffer = await fs.promises.readFile(fullPath)

		const avatarBase64 = avatarBuffer.toString('base64')

		const avatarDataURL = `data:image/jpeg;base64,${avatarBase64}`
		return avatarDataURL
	}

	async findById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				friendRequests: {
					include: {
						sender: true
					}
				},
				senderFriendRequest: {
					include: {
						recipient: true
					}
				},
				friendships: {
					include: {
						friend: true
					}
				}
			}
		})
	}

	async findByName(name: string) {
		return this.prisma.user.findMany({
			where: {
				name: name
			}
		})
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				friendships: {
					include: {
						friend: true
					}
				},
				friendRequests: {
					include: {
						sender: true
					}
				},
				senderFriendRequest: {
					include: {
						recipient: true
					}
				},
			}
		})
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async getProfile(id: string) {
		const profile = await this.getById(id)

		try {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...rest } = profile

			return {
				...rest
			}
		} catch (err) {
			console.error('Ошибка при чтении файла аватара:', err)
		}
	}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: '',
			password: await hash(dto.password)
		}

		return this.prisma.user.create({
			data: user
		})
	}

	async update(id: string, dto: UserDto) {
		let data = dto

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		}

		return this.prisma.user.update({
			where: {
				id
			},
			data
		})
	}

	async sendRequestToFriends(id: string, idRecipient: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				friendRequests: true,
				friendships: true
			}
		})

		const friendExist = user.friendships.some(
			friend => friend.id === idRecipient
		)

		if (friendExist) {
			throw new Error(`User already on friends`)
		}
		if (!friendExist) {
			return this.prisma.$transaction([
				this.prisma.friendRequest.create({
					data: {
						recipient: {
							connect: {
								id: idRecipient
							}
						},
						sender: {
							connect: {
								id
							}
						},
						status: 'pending' as RequestStatus
					}
				})
			])
		}
	}

	async acceptFriendRequest(
		id: string,
		idSender: string,
		requestId: string
	) {
		return this.prisma.$transaction([
			this.prisma.friendRequest.update({
				where: {
					id: requestId
				},
				data: {
					status: 'accepted' as RequestStatus
				}
			}),
			this.prisma.friendship.create({
				data: {
					user: {
						connect: {
							id
						}
					},
					friend: {
						connect: {
							id: idSender
						}
					}
				}
			}),
			this.prisma.friendship.create({
				data: {
					user: {
						connect: {
							id: idSender
						}
					},
					friend: {
						connect: {
							id
						}
					}
				}
			}),
			this.prisma.friendRequest.delete({
				where: {
					id: requestId
				}
			})
		]);
	}

	async rejectFriendRequest(id: string) {
		return this.prisma.friendRequest.delete({
			where: {
				id
			}
		})
	}

}
