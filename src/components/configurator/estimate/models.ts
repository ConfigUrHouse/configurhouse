import { ApiResponseError } from '../../../api/models';

export interface EstimateProps {
  confId: number;
}

export interface EstimateState {
  data: any;
  error: ApiResponseError | null;
  modalIsOpen: boolean;
}
