import { prisma } from "@/prisma/client.prisma";
import { sectionReadProcessing } from "../processing";

export async function GET(_, {params}) {
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

export async function DELETE(_, {params}) {
  await prisma.section.delete({
    where: {
      id: Number(params.id),
    },
  });
  return Response.json("Ok");
}