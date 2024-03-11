"use server"
import prisma from "@/prisma/client.prisma";
import { section } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache"
import { ISection } from "../_types/types";
import { sectionReadProcessing } from "./section.processing";


export const getSectionsByFilters = unstable_cache(
  async (filters:IFilters={}): Promise<section[]> => {
    const objectType = filters.objectType ?? undefined;
    const dbData = await prisma.section.findMany({
      where: {
        object_type: objectType,
      },
      include: {specs: {include: {spec: {include: {options: true}}}}},
    });
    return dbData;
  },
  [],
  { tags: ["sections"] }
)

interface IFilters {
  objectType?: string;
}

export const getSectionById = unstable_cache(
  async (id:number): Promise<ISection> => {
    const dbData = await prisma.section.findUnique({
      where: {
        id: id,
      },
      include: {
        specs: {include: {spec: {include: {options: true}}}},
      }
    });
    const processed = sectionReadProcessing(dbData);
    return processed;
  },
  [],
  { tags: ["sections"] }
)

export const upsertSection = unstable_cache(
  async (state:ISection, init:ISection) => {
    const fields = {
      name_plural: state.name_plural || null,
      name_singular: state.name_singular || null,
      object_type: state.object_type || null,
    }
    const specsAdded = state.specs?.filter((stateSpec) => !init.specs?.some((initSpec) => stateSpec.id === initSpec.id));
    const specsDeleted = init.specs?.filter((initSpec) => !state.specs?.some((stateSpec) => initSpec.id === stateSpec.id));
    const response = await prisma.section.upsert({
      where: {
        id: state.id ?? -1
      },
      create: {
        ...fields,
        specs: {
          create: specsAdded?.length ? specsAdded.map(({id}) => ({spec_id: id})) : undefined,
        }
      },
      update: {
        ...fields,
        specs: {
          create: specsAdded?.length ? specsAdded.map(({id}) => ({spec_id: id})) : undefined,
          deleteMany: specsDeleted?.length ? specsDeleted.map(({id}) => ({spec_id: id})) : undefined,
        },
      }
    });
    revalidateTag("sections");
    return response;
  },
  [],
  { tags: ["sections"] }
)

export const deleteSectionById = unstable_cache(
  async (id:number): Promise<void> => {
    await prisma.section.delete({
      where: {
        id: id,
      },
    });
    revalidateTag("sections");
  },
  [],
  { tags: ["sections"] }
)

export async function getEmptySection(): Promise<ISection> {
  return {
    object_type: "org",
    name_singular: "",
    name_plural: "",
  }
}