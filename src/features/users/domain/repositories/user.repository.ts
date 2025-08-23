import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id';
import { Email } from '../value-objects/email';

export abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract findById(id: UserId): Promise<User | null>;
  abstract findByEmail(email: Email): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract delete(id: UserId): Promise<void>;
}
