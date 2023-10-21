import { QueryHandler } from '@nestjs/cqrs';

import { GetUserQuery } from './get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler {
  constructor() {
    // Initialize
  }

  protected async handle(query: GetUserQuery): Promise<unknown> {
    return;
  }
}
