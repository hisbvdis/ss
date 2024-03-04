import { prisma } from "@/prisma/client.prisma";
import { NextRequest } from "next/server";
import { ISpec } from "@/app/_types/types";

export async function GET(req:NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const dbData = await prisma.spec.findMany({
    where: {
      object_type: searchParams.get("objectType") ?? undefined,
    },
  });
  return Response.json(dbData);
}

export async function POST(req:NextRequest) {
  const { state, init }:{state:ISpec, init:ISpec} = await req.json();
  const fields = {
    name_service: state.name_service || null,
    name_filter: state.name_filter || null,
    object_type: state.object_type || null,
    control_type: state.control_type || null,
  }
  const optionsAdded = state.options?.filter((stateOption) => !init.options?.some((initOption) => initOption.id === stateOption.id));
  const optionsChanged = state.options?.filter((stateOption) => init.options?.some((initOption) => stateOption.id === initOption.id && stateOption.name !== initOption.name || stateOption.order !== initOption.order));
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
  return Response.json(response);
}