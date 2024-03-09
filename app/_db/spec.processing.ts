import { ISpec } from "@/app/_types/types";
import { option, spec } from "@prisma/client";

export const specReadProcessing = (dbData:spec & {options?: option[]}):ISpec => {
  const processed = {
    ...dbData,
    options: dbData.options?.map((opt) => ({...opt,localId: crypto.randomUUID()})),
  }
  return processed;
}