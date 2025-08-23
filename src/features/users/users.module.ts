import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Presentation
import { UsersController } from './presentation/controllers/users.controller';

// Application
import { CreateUserHandler } from './application/use-cases/create-user.use-case';
import { GetUserHandler } from './application/use-cases/get-user.use-case';
import { GetAllUsersHandler } from './application/use-cases/get-all-users.use-case';
import { UpdateUserHandler } from './application/use-cases/update-user.use-case';
import { DeleteUserHandler } from './application/use-cases/delete-user.use-case';
import { UserCreatedEventHandler } from './application/event-handlers/user-created.handler';

// Infrastructure
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { PrismaService } from './infrastructure/persistence/prisma.service';
import { UserRepository } from './domain/repositories/user.repository';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];

const QueryHandlers = [GetUserHandler, GetAllUsersHandler];

const EventHandlers = [UserCreatedEventHandler];

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [],
})
export class UsersModule {}
