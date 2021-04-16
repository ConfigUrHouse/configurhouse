export interface Configuration {
  id: number;
  name: string;
  id_User: number;
  id_HouseModel: number;
  user?: User;
  houseModel?: HouseModel;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  active: number;
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
