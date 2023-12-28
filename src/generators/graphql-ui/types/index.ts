import { ObjectGeneratorSchema } from '../../../interfaces';

export interface GraphqlUiComponentGeneratorSchema
  extends ObjectGeneratorSchema {
  name: string;
  subDomain: string;
}
