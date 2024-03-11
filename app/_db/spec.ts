"use server"
import prisma from "@/prisma/client.prisma";
import { revalidateTag, unstable_cache } from "next/cache";
// -----------------------------------------------------------------------------
import { SpecWithOptions, UISpec } from "../_types/types";
import { specReadProcessing } from "./spec.processing";


export const getSpecsByFilters = unstable_cache(
  async (filters:{objectType?: string}={}): Promise<UISpec[]> => {
    const objectType = filters?.objectType ?? undefined;
    const dbData = await prisma.spec.findMany({
      where: {
        object_type: objectType,
      },
    });
    return dbData;
  },
  [],
  { tags: ["specs"] }
);

export const getSpecById = unstable_cache(
  async (id:number) => {
    const dbData: SpecWithOptions | null = await prisma.spec.findUnique({
      where: {
        id: id
      },
      include: {
        options: {orderBy: {order: "asc"}}
      },
    });
    if (!dbData) return null;
    const processed = specReadProcessing(dbData);
    return processed;
  },
  [],
  { tags: ["specs"] }
)

export const upsertSpec = unstable_cache(
  async (state:UISpec, init:UISpec) => {
    const fields = {
      name_service: state.name_service,
      name_filter: state.name_filter,
      object_type: state.object_type,
      control_type: state.control_type,
    }
    const optionsAdded = state.options?.filter((stateOption) => !init.options?.some((initOption) => initOption.id === stateOption.id));
    const optionsChanged = state.options?.filter((stateOption) => init.options?.some((initOption) => stateOption.localId === initOption.localId && (stateOption.name !== initOption.name || stateOption.order !== initOption.order)));
    const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => stateOption.id === initOption.id));
    const response = await prisma.spec.upsert({
      where: {
        id: state.id ?? -1
      },
      create: {
        ...fields,
        options: {
          create: optionsAdded?.length ? optionsAdded.map((opt) => ({...opt, localId: undefined})) : undefined,
        },
      },
      update: {
        ...fields,
        options: {
          create: optionsAdded?.length ? optionsAdded.map((opt) => ({...opt, localId: undefined})) : undefined,
          update: optionsChanged?.length ? optionsChanged?.map((option) => ({where: {id: option.id}, data: {...option, id: undefined, localId: undefined, spec_id: undefined}})) : undefined,
          deleteMany: optionsDeleted?.length ? optionsDeleted?.map(({id}) => ({id: id})) : undefined,
        },
      }
    });
    revalidateTag("specs");
    return response;
  },
  [],
  { tags: ["specs"] }
)

export const deleteSpecById = unstable_cache(
  async (id: number): Promise<void> => {
    await prisma.spec.delete({
      where: {
        id: id
      }
    });
    revalidateTag("specs");
  },
  [],
  { tags: ["specs"] }
)

export async function getEmptySpec(): Promise<UISpec> {
  return {
    id: undefined,
    name_service: "",
    name_filter: "",
    object_type: "org",
    control_type: "checkbox",
  }
}