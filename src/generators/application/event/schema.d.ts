import { ObjectGeneratorSchema } from '../../../interfaces';

export interface ApplicationEventGeneratorSchema extends ObjectGeneratorSchema {
  name: string;
  eventName: string;
}
