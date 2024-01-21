import { prisma } from "@/prisma/client.prisma";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const cityId = searchParams.get("city") ? Number(searchParams.get("city")) : undefined;
  const sectionId = searchParams.get("section") ? Number(searchParams.get("section")) : undefined;
  const options = searchParams.get("options") ?? undefined;
  const groupedOptions = Object.values(
    options
      ? options?.split(",")
        .map((str) => str.split(":"))
        .map((arr) => arr.map((str) => Number(str)))
        .reduce((acc, [key, value]) => ({...acc,[key]: acc[key] ? [...acc[key], value] : [value]}),{})
      : {}
    )
  const dbData = await prisma.object.findMany({
    where: {
      city_id: cityId,
      sections: {some: {section_id: {equals: sectionId}}},
      name_full: query ? {contains: query, mode: 'insensitive'} : undefined,
      type,
      AND: groupedOptions?.length ? groupedOptions?.map((ids) => ({options: {some: {option_id: {in: ids}}}})) : undefined,
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
    coord_inherit: state.coord_inherit || null,
    coord_lat: state.coord_lat ? Number.parseFloat(state.coord_lat) : null,
    coord_lon: state.coord_lon ? Number.parseFloat(state.coord_lon) : null,
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
  const scheduleAdded = (init.schedule.filter(({time}) => time).length === 0 && state.schedule.filter(({time}) => time).length !== 0) ? state.schedule : undefined;
  const scheduleChanged = init.schedule.filter(({time}) => time).length > 0 && state.schedule?.filter((stateDay) => init.schedule?.some((initDay) => (stateDay.day_num === initDay.day_num) && stateDay.time !== initDay.time)).length ? state.schedule : undefined;
  const scheduleDeleted = (state.schedule.filter(({time}) => time).length === 0 && init.schedule.filter(({time}) => time).length !== 0) ? {} : undefined;
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
        create: scheduleAdded?.map((day, i) => ({time: day.time, from: day.from, to: day.to, day_num: i})),
      },
      photos: {
        // Don't: The
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
        create: scheduleAdded?.map((day, i) => ({time: day.time, from: day.from, to: day.to, day_num: i})),
        update: scheduleChanged?.map((day, i) => ({where: {id: day.id}, data: {time: day.time, from: day.from, to: day.to, day_num: i}})),
        deleteMany: scheduleDeleted,
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