import { prisma } from "@/prisma/client.prisma";
import { objectReadProcessing } from "../processing";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest, {params}:{params: {id: string}}) {
  const dbData = await prisma.object.findUnique({
    where: {
      id: Number(params.id)
    },
    include: {
      city: true,
      sections: {include: {section: {include: {specs: {include: {spec: {include: {options: true}}}}}}}},
      options: {include: {option: true}},
      schedule: true,
      photos: {orderBy: {order: "asc"}},
      statusInstead: true,
      phones: {orderBy: {order: "asc"}},
      links: {orderBy: {order: "asc"}},
      parent: {include: {city: true, phones: true, links: true, schedule: true, statusInstead: true}},
      children: {include: {photos: true, phones: true, links: true, schedule: true}},
    },
  });
  const processed = objectReadProcessing(dbData);
  return Response.json(processed);
}

export async function DELETE(request: NextRequest, {params}:{params: {id:string}}) {
  await prisma.object.delete({
    where: {
      id: Number(params.id),
    },
  });
  return Response.json("Ok");
}