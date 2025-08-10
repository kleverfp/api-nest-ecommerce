import { User } from '../../domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email.value;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
