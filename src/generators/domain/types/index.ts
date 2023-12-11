import { ObjectGeneratorSchema } from '../../../interfaces';

export interface DomainComponentGeneratorSchema extends ObjectGeneratorSchema {
  name: string;
  subDomain: string;
}
