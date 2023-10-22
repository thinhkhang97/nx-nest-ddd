export * from './get-order/get-order.query';
export * from './get-orders/get-orders.query';
import { GetOrderQueryHandler } from './get-order/get-order.query-handler';
import { GetOrdersQueryHandler } from './get-orders/get-orders.query-handler';
export const queries = [GetOrderQueryHandler, GetOrdersQueryHandler];
