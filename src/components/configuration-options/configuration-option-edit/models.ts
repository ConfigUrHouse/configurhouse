import { RouteComponentProps } from "react-router-dom";
import { ApiResponseError } from "../../../api/models";
import { ConfigurationOption, HouseModel, Mesh } from "../../../models";

export interface ConfigurationOptionEditState {
  editMode: boolean;
  item: ConfigurationOption;
  houseModels: HouseModel[];
  meshes: Mesh[];
  error?: ApiResponseError;
}

export interface ConfigurationOptionPathParams {
  id: string;
}

export type ConfigurationOptionEditProps =
  RouteComponentProps<ConfigurationOptionPathParams>;
