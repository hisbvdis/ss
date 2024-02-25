import { prisma } from "@/prisma/client.prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, {params}:{params: {id:string}}) {
  const dbData = await prisma.city.findUnique({
    where: {
      id: Number(params.id),
    },
  });
  return Response.json(dbData);
}