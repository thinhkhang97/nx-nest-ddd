import { ApplicationComponentGeneratorSchema } from '../types';

export interface ApplicationEventGeneratorSchema
  extends ApplicationComponentGeneratorSchema {
  name: string;
  eventName: string;
}
