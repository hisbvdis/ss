import { SpecWithOptions, UISpec } from "@/app/_types/types";

export const specReadProcessing = (dbData:SpecWithOptions) => {
  const processed:UISpec = {
    ...dbData,
    options: dbData?.options?.map((opt) => ({...opt, localId: crypto.randomUUID()})),
  }
  return processed;
}