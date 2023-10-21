export interface UserCreateProps {}

export interface UserProps {}

export class User {
  public validate(): void {
    return;
  }

  public static create(props: UserCreateProps): User {
    return new User();
  }
}
