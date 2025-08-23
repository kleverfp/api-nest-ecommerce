import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id';
import { UserName } from '../../domain/value-objects/user-name';
import { Email } from '../../domain/value-objects/email';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const data = user.toPlain();

    const savedUser = await this.prisma.user.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        email: data.email,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        name: data.name,
        email: data.email,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(savedUser);
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id.getValue() },
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.toDomain(user));
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.getValue() },
    });
  }

  private toDomain(user: any): User {
    return new User({
      id: new UserId(user.id),
      name: new UserName(user.name),
      email: new Email(user.email),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}