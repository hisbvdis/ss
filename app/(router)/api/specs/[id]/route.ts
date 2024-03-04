import { prisma } from "@/prisma/client.prisma";
import { specsReadProcessing } from "../processing";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, {params}:{params: {id: string}}) {
  const dbData = await prisma.spec.findUnique({
    where: {
      id: Number(params.id)
    },
    include: {
      options: {orderBy: {order: "asc"}}
    },
  });
  const processed = specsReadProcessing(dbData);
  return Response.json(processed);
}

export async function DELETE(request: NextRequest, {params}:{params: {id: string}}) {
  await prisma.spec.delete({
    where: {
      id: Number(params.id)
    }
  });
  return Response.json("Ok");
}