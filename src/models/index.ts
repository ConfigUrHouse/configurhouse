export interface Value {
  id: number;
  name: string;
  price: number;
  is_default: number;
  id_OptionConf: number;
  id_Asset: number;
  asset?: Asset;
  optionConf?: ConfigurationOption;
}

export interface ConfigurationValue {
  id_Value: number;
  id_Configuration: number;
  value?: Value;
  configuration?: Configuration;
}

export interface Configuration {
  id: number;
  name: string;
  id_User: number;
  id_HouseModel: number;
  user?: User;
  houseModel?: HouseModel;
  configurationValues?: ConfigurationValue[];
}

export interface ConfigurationOption {
  id: number;
  name: string;
  id_HouseModel: number;
  id_Mesh: number;
  houseModel?: HouseModel;
  mesh?: Mesh;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  active: number;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserRole {
  id: number;
  id_User: number;
}

export interface HouseModel {
  id: number;
  name: string;
  id_ModelType: number;
  id_Asset: number;
  modelType?: ModelType;
  asset?: Asset;
}

export interface ModelType {
  id: number;
  name: string;
  description: string;
}

export interface AssetType {
  id: number;
  name: string;
  description: string;
}

export interface Asset {
  id: number;
  value: string;
  id_AssetType: number;
}

export interface Mesh {
  id: number;
  name: string;
  id_Asset: number;
  asset?: Asset;
}
