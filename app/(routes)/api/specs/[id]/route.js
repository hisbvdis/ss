import { prisma } from "@/prisma/client.prisma";

export async function GET(_, {params}) {
  const dbData = await prisma.spec.findUnique({
    where: {
      id: Number(params.id)
    },
    include: {
      options: {orderBy: {id: "asc"}}
    },
  });
  const processed = {
    ...dbData,
    options: dbData.options.map((opt) => ({...opt,localId: crypto.randomUUID()})),
  }
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