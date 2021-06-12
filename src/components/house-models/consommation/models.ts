import { RouteComponentProps } from 'react-router-dom';
import { ApiResponseError } from '../../../api/models';

export type ConsommationProps = RouteComponentProps<{ id?: string }>;

export interface ConsommationState {
  error?: ApiResponseError;
  conso: any;
  data?: any;
}
