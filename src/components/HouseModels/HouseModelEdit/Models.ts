import { RouteComponentProps } from 'react-router-dom';
import { ApiResponseError } from '../../../api/models';
import { Asset, HouseModel, ModelType } from '../../../models';

export interface HouseModelEditState {
  editMode: boolean;
  item: HouseModel;
  modelTypes: ModelType[];
  assets: Asset[];
  error?: ApiResponseError;
}

export interface HouseModelPathParams {
  id: string;
}

export type HouseModelEditProps = RouteComponentProps<HouseModelPathParams>;
