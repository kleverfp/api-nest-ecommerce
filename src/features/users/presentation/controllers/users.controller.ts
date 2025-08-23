import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { CreateUserCommand } from '../../application/use-cases/create-user.use-case';
import { GetUserQuery } from '../../application/use-cases/get-user.use-case';
import { GetAllUsersQuery } from '../../application/use-cases/get-all-users.use-case';
import { UpdateUserCommand } from '../../application/use-cases/update-user.use-case';
import { DeleteUserCommand } from '../../application/use-cases/delete-user.use-case';
import { User } from '../../domain/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.commandBus.execute(
      new CreateUserCommand(createUserDto),
    );
    return this.toResponse(user);
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.queryBus.execute(new GetAllUsersQuery());
    return users.map((user: User) => this.toResponse(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.queryBus.execute(new GetUserQuery(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toResponse(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.commandBus.execute(
      new UpdateUserCommand(id, updateUserDto),
    );
    return this.toResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }

  private toResponse(user: User): UserResponseDto {
    const plain = user.toPlain();
    return {
      id: plain.id,
      name: plain.name,
      email: plain.email,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}