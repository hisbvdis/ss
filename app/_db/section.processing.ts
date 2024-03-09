import { ISection } from "@/app/_types/types";
import { section, section_on_spec, spec } from "@prisma/client";

export const sectionReadProcessing = (dbData: section & {specs: section_on_spec & {spec: spec}[]}): ISection => {
  const processed = {
    ...dbData,
    specs: dbData.specs?.map(({spec}) => spec),
  }
  return processed;
}
