import { prisma } from "@/prisma/client.prisma";
import { objectReadProcessing } from "../processing";

export async function GET(_, {params}) {
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
      parent: true,
      children: {include: {photos: true, phones: true, links: true}},
    },
  });
  const processed = objectReadProcessing(dbData);
  return Response.json(processed);
}

export async function DELETE(_, {params}) {
  await prisma.object.delete({
    where: {
      id: Number(params.id),
    },
  });
  return Response.json("Ok");
}