import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id';
import { Email } from '../../domain/value-objects/email';
import { UpdateUserDto } from '../dtos/update-user.dto';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateUserDto,
  ) {}
}

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { id, dto } = command;
    const userId = new UserId(id);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (dto.email) {
      const emailExists = await this.userRepository.findByEmail(
        new Email(dto.email),
      );
      if (emailExists && !emailExists.getId().equals(userId)) {
        throw new Error('User with this email already exists');
      }
      user.updateEmail(dto.email);
    }

    if (dto.name) {
      user.updateName(dto.name);
    }

    return await this.userRepository.save(user);
  }
}