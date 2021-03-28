import { Configuration, HouseModel } from "../../../models";
import { PaginatedResponse } from "../../../utils/pagination";

export interface UserConfigurationsFormValues {
  name: string;
  houseModelId: number;
}

export interface UserConfigurationsState {
  houseModels: HouseModel[];
  formValues: UserConfigurationsFormValues;
  paginatedItems: PaginatedResponse<Configuration>;
}
