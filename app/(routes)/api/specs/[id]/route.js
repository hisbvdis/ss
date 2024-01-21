import { prisma } from "@/prisma/client.prisma";
import { specsReadProcessing } from "../processing";

export async function GET(_, {params}) {
  const dbData = await prisma.spec.findUnique({
    where: {
      id: Number(params.id)
    },
    include: {
      options: {orderBy: {id: "asc"}}
    },
  });
  const processed = specsReadProcessing(dbData);
  return Response.json(processed);
}

export async function DELETE(_, {params}) {
  const result = await prisma.spec.delete({
    where: {
      id: Number(params.id)
    }
  });
  return Response.json(result);
}