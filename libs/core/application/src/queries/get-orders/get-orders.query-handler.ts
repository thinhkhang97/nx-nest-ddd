import { QueryHandler } from '@nestjs/cqrs';

import { GetOrdersQuery } from './get-orders.query';

@QueryHandler(GetOrdersQuery)
export class GetOrdersQueryHandler {
  constructor() {
    // Initialize
  }

  protected async handle(query: GetOrdersQuery): Promise<unknown> {
    return;
  }
}
