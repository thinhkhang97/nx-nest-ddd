import { ObjectGeneratorSchema } from '../../../interfaces';

export interface DomainAggregateGeneratorSchema extends ObjectGeneratorSchema {
  name: string;
  sourceRoot: string;
}
