import { prisma } from "@/prisma/client.prisma";
import { sectionReadProcessing } from "../processing";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest, {params}:{params: {id: string}}) {
  const dbData = await prisma.section.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      specs: {include: {spec: {include: {options: true}}}},
    }
  });
  const processed = sectionReadProcessing(dbData);
  return Response.json(processed);
}

export async function DELETE(request:NextRequest, {params}:{params: {id:string}}) {
  await prisma.section.delete({
    where: {
      id: Number(params.id),
    },
  });
  return Response.json("Ok");
}