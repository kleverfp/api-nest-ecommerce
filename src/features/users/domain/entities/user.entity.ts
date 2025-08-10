import { BaseEntity } from 'src/shared/domain/base.entity';
import { Email } from '../../../../shared/domain/value-objects/email.vo';
import { UserCreatedEvent } from '../events/user.created.event';

export class User extends BaseEntity {
  private _name: string;
  private _email: Email;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    name: string,
    email: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    this._name = name;
    this._email = new Email(email);
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();

    if (!createdAt) {
      this.addDomainEvent(new UserCreatedEvent(this.id, name, email));
    }
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  updateEmail(email: string): void {
    this._email = new Email(email);
    this._updatedAt = new Date();
  }
}
