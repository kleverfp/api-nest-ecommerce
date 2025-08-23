import { ConflictException, Injectable } from '@nestjs/common';
import { EventBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email';
import { CreateUserDto } from '../dtos/create-user.dto';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { name, email: emailString } = command.dto;

    const email = new Email(emailString);

    const emailExists = await this.userRepository.findByEmail(email);
    if (emailExists) {
      throw new ConflictException('User with this email already exists');
    }

    const user = User.create(name, email);
    const savedUser = await this.userRepository.save(user);

    this.eventBus.publishAll(savedUser.getUncommittedEvents());

    return savedUser;
  }
}
