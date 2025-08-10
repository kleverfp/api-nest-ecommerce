import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../aplication/dtos/create-user.dto';
import { UserResponseDto } from '../aplication/dtos/user-response.dto';
import { CreateUserCommand } from '../aplication/commands/create-user/create-user.command';
import { User } from '../domain/entities/user.entity';
import { GetUserQuery } from '../aplication/queries/get-user/get-user.query';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const command = new CreateUserCommand(
      createUserDto.name,
      createUserDto.email,
    );
    const user: User = await this.commandBus.execute(command);
    return new UserResponseDto(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponseDto | null> {
    const query = new GetUserQuery(id);
    const user: User = await this.queryBus.execute(query);
    return user ? new UserResponseDto(user) : null;
  }
}
