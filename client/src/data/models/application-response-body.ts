import { ApplicationResponseAction } from '../types/application-response-action.ts';

export interface ApplicationResponseBody {
  guildId: string,
  applicationId: string,
  action: ApplicationResponseAction
}