import { prisma } from "@/app/(routes)/api/dbClient";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const cityId = Number(searchParams.get("cityId")) ?? undefined;
  const sectionId = searchParams.get("sectionId") ?? undefined;
  // const optionIds = searchParams.get("options")?.split(",").map((id) => Number(id));
  // const specs = await getSpecsByOptionIds(optionIds) ?? undefined;
  const dbData = await prisma.object.findMany({
    where: {
      city_id: cityId,
      sections: sectionId ? {some: {section_id: {equals: sectionId}}} : undefined,
      name_full: query ? {contains: query, mode: 'insensitive'} : undefined,
      type,
      // AND: specs?.length ? specs?.map(({options}) => options.map(({id}) => id)).map((ids) => ({options: {some: {option_id: {in: ids}}}})) : undefined,
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
  const scalarFields = {
    name_type: state.name_type || null,
    name_where: state.name_where || null,
    name_full: state.type === "org" ? state.name_full : [state.name_type, state.name_where].filter((v) => v).join(" "),
    type: state.type || null,
    status: state.status || null,
    status_inherit: state.status_inherit || null,
    status_comment: state.status_comment || null,
    status_confirm: state.status_confirm || null,
    status_instead_id: state.status_instead_id || null,
    city_id: state.city_id || null,
    parent_id: state.parent_id || null,
    address: state.address || null,
    address_2: state.address_2 || null,
    description: state.description || null,
    schedule_inherit: state.schedule_inherit || null,
    schedule_247: state.schedule_247 || null,
    schedule_date: state.schedule_date ? new Date(state.schedule_date) : null,
    schedule_source: state.schedule_source || null,
    schedule_comment: state.schedule_comment || null,
    modified: new Date(),
  };
  const phonesAdded = state.phones?.filter((statePhone) => !init?.phones?.some((initPhone) => statePhone.localId === initPhone.localId && statePhone.value !== ""));
  const phonesChanged = state.phones?.filter((statePhone) => init.phones?.some((initPhone) => statePhone.localId === initPhone.localId && (statePhone.value !== initPhone.value || statePhone.comment !== initPhone.comment)));
  const phonesDeleted = init.phones?.filter((initPhone) => !state.phones.some((statePhone) => initPhone.localId === statePhone.localId));
  const linksAdded = state.links?.filter((stateLink) => !init?.links?.some((initLink) => stateLink.localId === initLink.localId && stateLink.value !== ""));
  const linksChanged = state.links?.filter((stateLink) => init.links?.some((initLink) => stateLink.localId === initLink.localId && (stateLink.value !== initLink.value || stateLink.comment !== initLink.comment)));
  const linksDeleted = init.links?.filter((initLink) => !state.links.some((stateLink) => initLink.localId === stateLink.localId));
  const optionsAdded = state.options?.filter((stateOption) => !init?.options?.some((initOption) => stateOption.id === initOption.id));
  const optionsDeleted = init.options?.filter((initOption) => !state.options.some((stateOption) => initOption.id === stateOption.id));
  const sectionsAdded = state.sections?.filter((stateSection) => !init?.sections?.some((initSection) => stateSection.id === initSection.id));
  const sectionsDeleted = init.sections?.filter((initSection) => !state.sections.some((stateSection) => initSection.id === stateSection.id));
  const scheduleAdded = state.schedule?.filter((stateDay) => init?.schedule?.some((initDay) => stateDay.day_num === initDay.day_num && !initDay.time_string && stateDay.time_string));
  const scheduleChanged = state.schedule?.filter((stateDay) => init.schedule?.some((initDay) => (stateDay.day_num === initDay.day_num) && initDay.time_string && stateDay.time_string && initDay.time_string !== stateDay.time_string));
  const scheduleDeleted = init.schedule?.filter((initDay) => state.schedule?.some((stateDay) => initDay.day_num === stateDay.day_num && initDay.time_string && !stateDay.time_string));
  const photosAdded = state.photos?.filter((statePhoto) => !init?.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId));
  const photosDeleted = init.photos?.filter((initPhoto) => !state.photos.some((statePhoto) => initPhoto.localId === statePhoto.localId));
  const photosMoved = state.photos?.filter((statePhoto) => init.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId && statePhoto.order !== initPhoto.order));
  const addedObject = await prisma.object.upsert({
    where: {
      id: state.id ?? -1
    },
    create: {
      ...scalarFields,
      phones: {
        create: phonesAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})),
      },
      links: {
        create: linksAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})),
      },
      options: {
        create: optionsAdded?.map(({id}) => ({option: {connect: {id}}})),
      },
      sections: {
        create: sectionsAdded?.map(({id}) => ({section: {connect: {id}}})),
      },
      schedule: {
        create: scheduleAdded.map((day) => ({time_string: day.time_string, from_min: day.from_min, to_min: day.to_min, day_num: day.day_num})),
      },
      photos: {
        create: photosAdded?.map(({name, order}) => ({name, order, uploaded: new Date()})),
      },
      created: new Date(),
    },
    update: {
      ...scalarFields,
      phones: {
        create: phonesAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})),
        update: phonesChanged?.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})),
        deleteMany: phonesDeleted?.map((item) => ({...item, localId: undefined}))
      },
      links: {
        create: linksAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})),
        update: linksChanged?.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})),
        deleteMany: linksDeleted?.map((item) => ({...item, localId: undefined}))
      },
      options: {
        create: optionsAdded?.map(({id}) => ({option: {connect: {id}}})),
        deleteMany: {option_id: {in: optionsDeleted?.map(({id}) => id)}},
      },
      sections: {
        create: sectionsAdded?.map(({id}) => ({section: {connect: {id}}})),
        deleteMany: {section_id: {in: sectionsDeleted?.map(({id}) => id)}},
      },
      schedule: {
        create: scheduleAdded.map((day) => ({time_string: day.time_string, from_min: day.from_min, to_min: day.to_min, day_num: day.day_num})),
        update: scheduleChanged?.map((day) => ({where: {id: day.id}, data: {time_string: day.time_string, from_min: day.from_min, to_min: day.to_min, day_num: day.day_num}})),
        deleteMany: scheduleDeleted?.map((day) => ({...day, name_ru_short: undefined, day: undefined, isWork: undefined}))
      },
      photos: {
        create: photosAdded?.map(({name, order}) => ({name, order, uploaded: new Date()})),
        update: photosMoved?.map((photo) => ({where: {id: photo.id}, data: {order: photo.order}})),
        deleteMany: {id: {in: photosDeleted?.map(({id}) => id)}},
      },
    }
  });

  // Rename photo names of created object
  if (!state.id && state.photos?.length > 0) {
    const updatedOrg = await prisma.object.update({
      where: {id: addedObject.id},
      data: {
        photos: {
          create: state.photos.map(({name, order}) => ({
            name: name.replace("ID", addedObject.id),
            order,
            uploaded: new Date()
          })),
        }
      },
    });
    return Response.json(updatedOrg);
  };

  return Response.json(addedObject);
}