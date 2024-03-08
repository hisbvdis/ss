import { object, object_link, object_on_option, object_on_section, object_phone, object_photo, object_schedule, option, section } from "@prisma/client";

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
  [key: string]: any;
}

export interface IObject extends object {
  phones?: (object_phone & {localId: string})[]
  links?: (object_link & {localId: string})[]
  sections?: (object_on_section & {section: section})[];
  options?: (object_on_option & {option: option})[];
  schedule?: object_schedule[];
  photos?: (object_photo & {localId: string})[];
  children?: IObject[];
  parent?: IObject;
  [key: string]:any;
}