import { DomainEvent } from './domain.event';

export abstract class BaseEntity {
  protected _id: string;
  private _domainEvents: DomainEvent[] = [];

  constructor(id?: string) {
    this._id = id || this.generateId();
  }

  get id(): string {
    return this._id;
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
