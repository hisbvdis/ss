import { prisma } from "@/app/(routes)/api/dbClient";
import { objectReadProcessing } from "../processing";

export async function GET(_, {params}) {
  const dbData = await prisma.object.findUnique({
    where: { id: Number(params.id) },
    include: {
      city: true,
      sections: {include: {section: {include: {specs: {include: {spec: {include: {options: true}}}}}}}},
      options: {include: {option: true}},
      schedule: true,
      photos: {orderBy: {order: "asc"}},
      statusInstead: true,
      phones: {orderBy: {order: "asc"}},
      links: {orderBy: {order: "asc"}},
      parentOrg: {include: {
        city: true,
        sections: {include: {section: {include: {specs: {include: {spec: {include: {options: true}}}}}}}},
        options: {include: {option: true}},
        schedule: true,
        photos: {orderBy: {order: "asc"}},
        statusInstead: true,
        phones: {orderBy: {order: "asc"}},
        links: {orderBy: {order: "asc"}},
        childObjects: {include: {photos: true}},
      }},
      childObjects: {include: {photos: true}},
    },
  });
  const processed = objectReadProcessing(dbData);
  return Response.json(processed);
}

export async function DELETE(_, {params}) {
  await prisma.object.delete({ where: {
    id: Number(params.id)
  } });
}