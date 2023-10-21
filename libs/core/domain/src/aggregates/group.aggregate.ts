export interface GroupProps {}

export class Group extends AggregateRoot<GroupProps> {
  public validate(): void {
    return;
  }

  public static create(props: GroupProps): Group {
    const id = '';
    return new Group({ id, props });
  }
}
