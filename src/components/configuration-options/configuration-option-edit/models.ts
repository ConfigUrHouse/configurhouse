import { RouteComponentProps } from "react-router-dom";
import { ApiResponseError } from "../../../api/models";
import { ConfigurationOption, HouseModel, Mesh } from "../../../models";

export interface ConfigurationOptionEditState {
  id: number;
  editMode: boolean;
  item: ConfigurationOption;
  houseModel?: any;
  houseModels: HouseModel[];
  meshes: Mesh[];
  error?: ApiResponseError;
}

export interface ConfigurationOptionPathParams {
  id: string;
}

export type ConfigurationOptionEditProps = RouteComponentProps<ConfigurationOptionPathParams>;
