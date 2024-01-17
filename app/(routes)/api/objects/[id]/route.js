import { prisma } from "@/app/(routes)/api/dbClient";
import { getEmptyObject } from "../requests";

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
      children: {include: {photos: true}},
    },
  });
  const processed = {
    ...dbData,
    phones: dbData?.phones?.map((phone) => ({...phone, localId: crypto.randomUUID()})),
    links: dbData?.links?.map((link) => ({...link, localId: crypto.randomUUID()})),
    sections : dbData?.sections.map(({section}) => section),
    options : dbData?.options.map(({option}) => option),
    schedule: (await getEmptyObject())?.schedule?.map((emptyDay) => {
      const dbDay = dbData?.schedule.find((dbDay) => dbDay.day_num === emptyDay.day_num);
      return {...emptyDay, ...dbDay, isWork: dbDay ? true : false}
    }),
    schedule_date: !dbData?.schedule_date ? null : new Intl.DateTimeFormat('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(dbData?.schedule_date),
    modified: !dbData?.modified ? null : new Intl.DateTimeFormat('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit', hour: "2-digit", hour12: false, minute: "2-digit"}).format(dbData?.modified),
    created: !dbData?.created ? null : new Intl.DateTimeFormat('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit', hour: "2-digit", hour12: false, minute: "2-digit"}).format(dbData?.created),
  };
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