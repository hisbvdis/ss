import { prisma } from "@/app/(routes)/api/dbClient";
import { objectWriteProcessing } from "./processing";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const cityId = searchParams.get("city") ?? undefined;
  const sectionId = searchParams.get("section") ?? undefined;
  const query = searchParams.get("query") ?? undefined;
  const optionIds = searchParams.get("options")?.split(",").map((id) => Number(id));
  const type = searchParams.get("type") ?? undefined;
  const specs = await getSpecsByOptionIds(optionIds) ?? undefined;
  const dbData = await prisma.object.findMany({
    where: {
      city_id: cityId || undefined,
      sections: sectionId ? {some: {section_id: {equals: sectionId}}} : undefined,
      name_full: query ? {contains: query, mode: 'insensitive'} : undefined,
      type: type,
      AND: specs?.length ? specs?.map(({options}) => options.map(({id}) => id)).map((ids) => ({options: {some: {option_id: {in: ids}}}})) : undefined,
    },
    orderBy: {
      created: "desc",
    },
    take: 10,
    include: {
      city: true,
      sections: {include: {section: {include: {specs: {include: {spec: {include: {options: true}}}}}}}},
      options: {include: {option: true}},
      schedule: true,
      photos: {orderBy: {order: "asc"}},
      statusInstead: true,
      phones: {orderBy: {order: "asc"}},
      links: {orderBy: {order: "asc"}},
    },
  });
  return Response.json(dbData);
}

export async function POST(req) {
  const { state, init } = await req.json();
  const processed = objectWriteProcessing(state);
  // const phonesAdded = state.phones?.filter((statePhone) => !init?.phones?.some((initPhone) => statePhone.localId === initPhone.localId && statePhone.value !== ""));
  // const phonesChanged = state.phones?.filter((statePhone) => init.phones?.some((initPhone) => statePhone.localId === initPhone.localId && (statePhone.value !== initPhone.value || statePhone.comment !== initPhone.comment)));
  // const phonesDeleted = init.phones?.filter((initPhone) => !state.phones.some((statePhone) => initPhone.localId === statePhone.localId));
  // const linksAdded = state.links?.filter((stateLink) => !init?.links?.some((initLink) => stateLink.localId === initLink.localId && stateLink.value !== ""));
  // const linksChanged = state.links?.filter((stateLink) => init.links?.some((initLink) => stateLink.localId === initLink.localId && (stateLink.value !== initLink.value || stateLink.comment !== initLink.comment)));
  // const linksDeleted = init.links?.filter((initLink) => !state.links.some((stateLink) => initLink.localId === stateLink.localId));
  // const optionsAdded = state.options?.filter((stateOption) => !init?.options?.some((initOption) => stateOption.id === initOption.id));
  // const optionsDeleted = init.options?.filter((initOption) => !state.options.some((stateOption) => initOption.id === stateOption.id));
  // const photosAdded = state.photos?.filter((statePhoto) => !init?.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId));
  // const photosDeleted = init.photos?.filter((initPhoto) => !state.photos.some((statePhoto) => initPhoto.localId === statePhoto.localId));
  // const photosMoved = state.photos?.filter((statePhoto) => init.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId && statePhoto.order !== initPhoto.order));
  const scheduleAdded = processed.schedule?.filter((procDay) => init?.schedule?.some((initDay) => procDay.day_num === initDay.day_num && initDay.time === "" && procDay.time !== null));
  const scheduleChanged = processed.schedule?.filter((procDay) => init.schedule?.some((initDay) => procDay.day_num === initDay.day_num && initDay.time !== "" && procDay.time !== null));
  const scheduleDeleted = init.schedule?.filter((initDay) => processed.schedule.some((procDay) => initDay.day_num === procDay.day_num && initDay.time !== "" && procDay.time === null));
  // const sectionsAdded = state.sections?.filter((stateSection) => !init?.sections?.some((initSection) => stateSection.id === initSection.id));
  // const sectionsDeleted = init.sections?.filter((initSection) => !state.sections.some((stateSection) => initSection.id === stateSection.id));
  const addedObject = await prisma.object.upsert({
    where: {id: state.id ?? -1},
    create: {
      ...processed,
  //     phones: {
  //       create: phonesAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})),
  //     },
  //     links: {
  //       create: linksAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})),
  //     },
  //     sections: {
  //       create: sectionsAdded?.map(({id}) => ({section: {connect: {id}}})),
  //     },
  //     options: {
  //       create: optionsAdded?.map(({id}) => ({option: {connect: {id}}})),
  //     },
      schedule: {
        create: scheduleAdded.map((day) => ({time: day.time, from: day.from, to: day.to, day_num: day.day_num})),
      },
  //     photos: {
  //       // Don't specify
  //     },
  //     created: new Date(),
    },
    update: {
  //     ...processed,
  //     phones: {
  //       create: phonesAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})),
  //       update: phonesChanged?.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})),
  //       deleteMany: phonesDeleted?.map((item) => ({...item, localId: undefined}))
  //     },
  //     links: {
  //       create: linksAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})),
  //       update: linksChanged?.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})),
  //       deleteMany: linksDeleted?.map((item) => ({...item, localId: undefined}))
  //     },
  //     sections: {
  //       create: sectionsAdded?.map(({id}) => ({section: {connect: {id}}})),
  //       deleteMany: {section_id: {in: sectionsDeleted?.map(({id}) => id)}},
  //     },
  //     options: {
  //       create: optionsAdded?.map(({id}) => ({option: {connect: {id}}})),
  //       deleteMany: {option_id: {in: optionsDeleted?.map(({id}) => id)}},
  //     },
  //     schedule: {
  //       create: scheduleAdded.map((day) => ({time: day.time, from: day.from, to: day.to, day_num: day.day_num})),
  //       update: scheduleChanged?.map((day) => ({where: {id: day.id}, data: {time: day.time, from: day.from, to: day.to, day_num: day.day_num}})),
  //       deleteMany: scheduleDeleted?.map((day) => ({...day, name_ru_short: undefined, day: undefined, isWork: undefined}))
  //     },
  //     photos: {
  //       create: photosAdded?.map(({name, order}) => ({name, order, uploaded: new Date()})),
  //       update: photosMoved?.map((photo) => ({where: {id: photo.id}, data: {order: photo.order}})),
  //       deleteMany: {id: {in: photosDeleted?.map(({id}) => id)}},
      // },
    }
  });
  // if (!state.id && state.photos?.length > 0) {
  //   const updatedOrg = await prisma.object.update({
  //     where: {id: addedObject.id},
  //     data: {
  //       photos: {
  //         create: state.photos.map(({name, order}) => ({name: name.replace("ID", addedObject.id), order, uploaded: new Date()})),
  //       }
  //     },
  //   });
  //   return updatedOrg;
  // };
  // return Response.json(addedObject);
  return Response.json("ok");
}