export interface PostCreateProps {}

export interface PostProps {}

export class Post {
  public validate(): void {
    return;
  }

  public static create(props: PostCreateProps): Post {
    return new Post();
  }
}
