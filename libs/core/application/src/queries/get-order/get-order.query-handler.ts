import { QueryHandler } from '@nestjs/cqrs';

import { GetOrderQuery } from './get-order.query';

@QueryHandler(GetOrderQuery)
export class GetOrderQueryHandler {
  constructor() {
    // Initialize
  }

  protected async handle(query: GetOrderQuery): Promise<unknown> {
    return;
  }
}
