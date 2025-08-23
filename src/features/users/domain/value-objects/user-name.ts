export class UserName {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserName cannot be empty');
    }
    if (value.length > 100) {
      throw new Error('UserName cannot exceed 100 characters');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}