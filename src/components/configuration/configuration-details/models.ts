import { RouteComponentProps } from "react-router-dom";

export interface ConfigurationDetailsPathParams {
  id: string;
}

export type ConfigurationDetailsProps =
  RouteComponentProps<ConfigurationDetailsPathParams>;
