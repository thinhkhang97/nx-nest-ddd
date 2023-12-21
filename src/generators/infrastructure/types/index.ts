import { ObjectGeneratorSchema } from '../../../interfaces';

export interface InfrastructureComponentGeneratorSchema
  extends ObjectGeneratorSchema {
  name: string;
  subDomain: string;
}
