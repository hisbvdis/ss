export interface ISpec {
  id?: number;
  name_service: string;
  name_filter: string;
  object_type: string;
  control_type: string;
  options?: IOption[];
  [key: string]: any;
}

export interface IOption {
  id?: number;
  name: string;
  order: number;
  spec_id?: number | null;
  localId: string;
}

export interface ISection {
  id?: number;
  name_singular: string;
  name_plural: string;
  object_type: string;
  specs?: ISpec[];
}