import { RouteComponentProps } from "react-router-dom";
import { ApiResponseError } from "../../../api/models";

interface IConsommationProps extends RouteComponentProps<{ id?: string }> {
  optionValues?: number[];
  houseModelId?: number;
}
export type ConsommationProps = IConsommationProps;

export interface ConsommationState {
  conso: any;
  data?: any;
  error?: ApiResponseError;
}
