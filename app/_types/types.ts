import { Prisma, object, object_link, object_on_option, object_on_section, object_phone, object_photo, object_schedule, option, section, spec } from "@prisma/client";

export type SpecWithOptions = Prisma.specGetPayload<{include: {options: true}}>;

export interface UISpec extends Omit<spec, "id"> {
  id?: number;
  options?: UIOption[];
  [key: string]: any;
}

export interface UIOption extends Omit<option, "id" | "spec_id"> {
  id?: number;
  spec_id?: number;
  localId: string;
}

export interface ISection {
  id?: number;
  name_singular: string;
  name_plural: string;
  object_type: string;
  specs?: UISpec[];
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