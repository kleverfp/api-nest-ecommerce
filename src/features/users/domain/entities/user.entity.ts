import { AggregateRoot } from '@nestjs/cqrs';
import { UserId } from '../value-objects/user-id';
import { UserName } from '../value-objects/user-name';
import { Email } from '../value-objects/email';
import { UserCreatedEvent } from '../events/user-created.event';

export interface UserProps {
  id: UserId;
  name: UserName;
  email: Email;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot {
  private props: UserProps;

  constructor(props: UserProps) {
    super();
    this.props = props;
  }

  static create(name: string, email: Email): User {
    const id = new UserId(crypto.randomUUID());
    const userName = new UserName(name);
    const userEmail = email;
    const now = new Date();

    const user = new User({
      id,
      name: userName,
      email: userEmail,
      createdAt: now,
      updatedAt: now,
    });

    user.apply(
      new UserCreatedEvent(
        id.getValue(),
        userName.getValue(),
        userEmail.getValue(),
        now,
      ),
    );

    return user;
  }

  getId(): UserId {
    return this.props.id;
  }

  getName(): UserName {
    return this.props.name;
  }

  getEmail(): Email {
    return this.props.email;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  updateName(name: string): void {
    this.props.name = new UserName(name);
    this.props.updatedAt = new Date();
  }

  updateEmail(email: string): void {
    this.props.email = new Email(email);
    this.props.updatedAt = new Date();
  }

  toPlain() {
    return {
      id: this.props.id.getValue(),
      name: this.props.name.getValue(),
      email: this.props.email.getValue(),
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
