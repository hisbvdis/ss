import { prisma } from "@/prisma/client.prisma";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query") ?? undefined;
  const cityId = searchParams.get("city") ? Number(searchParams.get("city")) : undefined;
  const type = searchParams.get("type") ?? undefined;
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
      name_full: query ? {contains: query, mode: 'insensitive'} : undefined,
      city_id: cityId,
      type: type,
      sections: sectionId ? {some: {section_id: {equals: sectionId}}} : undefined,
      AND: groupedOptions?.length ? groupedOptions.map((ids) => ({options: {some: {option_id: {in: ids}}}})) : undefined,
    },
    orderBy: {
      created: "desc",
    },
    take: 10,
    include: {
      city: true,
      options: {include: {option: true}},
      photos: {orderBy: {order: "asc"}},
    },
  });
  return Response.json(dbData);
}

export async function POST(req) {
  const { state, init } = await req.json();
  const fields = {
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
  const scheduleAdded = state.schedule.filter((stateSchedule) => init.schedule.some((initSchedule) => stateSchedule.day_num === initSchedule.day_num && !initSchedule.time && stateSchedule.time));
  const scheduleChanged = state.schedule.filter((stateSchedule) => init.schedule.some((initSchedule) => stateSchedule.day_num === initSchedule.day_num && initSchedule.id && stateSchedule.time && stateSchedule.time !== initSchedule.time));
  const scheduleDeleted = init.schedule.filter((initSchedule) => state.schedule.some((stateSchedule) => initSchedule.day_num === stateSchedule.day_num && initSchedule.time && !stateSchedule.time));
  const photosAdded = state.photos?.filter((statePhoto) => !init?.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId));
  const photosDeleted = init.photos?.filter((initPhoto) => !state.photos.some((statePhoto) => initPhoto.localId === statePhoto.localId));
  const photosMoved = state.photos?.filter((statePhoto) => init.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId && statePhoto.order !== initPhoto.order));
  const addedObject = await prisma.object.upsert({
    where: {
      id: state.id ?? -1
    },
    create: {
      ...fields,
      phones: {
        create: phonesAdded?.length ? phonesAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
      },
      links: {
        create: linksAdded?.length ? linksAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
      },
      options: {
        create: optionsAdded?.length ? optionsAdded.map(({id}) => ({option: {connect: {id}}})) : undefined,
      },
      sections: {
        create: sectionsAdded?.length ? sectionsAdded.map(({id}) => ({section: {connect: {id}}})) : undefined,
      },
      schedule: {
        create: scheduleAdded?.length ? scheduleAdded.map((day) => ({time: day.time, from: day.from, to: day.to, day_num: day.day_num})) : undefined,
      },
      photos: {
        // Don't: The
      },
      created: new Date(),
    },
    update: {
      ...fields,
      phones: {
        create: phonesAdded?.length ? phonesAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
        update: phonesChanged?.length ? phonesChanged.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})) : undefined,
        deleteMany: phonesDeleted?.length ? phonesDeleted.map((item) => ({...item, localId: undefined})) : undefined,
      },
      links: {
        create: linksAdded?.length ? linksAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
        update: linksChanged?.length ? linksChanged.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})) : undefined,
        deleteMany: linksDeleted?.length ? linksDeleted.map((item) => ({...item, localId: undefined})) : undefined,
      },
      options: {
        create: optionsAdded?.length ? optionsAdded.map(({id}) => ({option: {connect: {id}}})) : undefined,
        deleteMany: optionsDeleted?.length ? {option_id: {in: optionsDeleted.map(({id}) => id)}} : undefined,
      },
      sections: {
        create: sectionsAdded?.length ? sectionsAdded.map(({id}) => ({section: {connect: {id}}})) : undefined,
        deleteMany: sectionsDeleted?.length ? {section_id: {in: sectionsDeleted.map(({id}) => id)}} : undefined,
      },
      schedule: {
        create: scheduleAdded?.length ? scheduleAdded.map((day) => ({...day, isWork: undefined})) : undefined,
        update: scheduleChanged?.length ? scheduleChanged.map((day) => ({where: {id: day.id}, data: {...day, id: undefined, object_id: undefined, isWork: undefined}})) : undefined,
        deleteMany: scheduleDeleted?.length ? {id: {in: scheduleDeleted.map(({id}) => id)}} : undefined,
      },
      photos: {
        create: photosAdded?.length ? photosAdded.map(({name, order}) => ({name, order, uploaded: new Date()})) : undefined,
        update: photosMoved?.length ? photosMoved.map((photo) => ({where: {id: photo.id}, data: {order: photo.order}})) : undefined,
        deleteMany: photosDeleted?.length ? {id: {in: photosDeleted.map(({id}) => id)}} : undefined,
      },
      children: {
        update: state.children?.length ? state.children.map((child) => ({where: {id: child.id}, data: {
          name_where: state.name_where,
          name_full: child.name_type + " " + state.name_where,
          city_id: state.city_Id,
          address: state.address,
          address_2: state.address_2,
          status: child.status_inherit ? state.status : child.status,
          status_comment: child.status_inherit ? state.status_comment : child.status_comment,
          status_confirm: child.status_inherit ? state.status_confirm : child.status_confirm,
          status_instead_id: child.status_inherit ? state.status_instead_id : child.status_instead_id,
          coord_lat: child.coord_inherit ? state.coord_lat : child.coord_lat,
          coord_lon: child.coord_inherit ? state.coord_lon : child.coord_lon,
          phones: {
            deleteMany: (phonesAdded.length || phonesChanged.length || phonesDeleted.length) ? child.phones.map((item) => ({...item})) : undefined,
            create: (phonesAdded.length || phonesChanged.length || phonesDeleted.length) ? state.phones.map((item) => ({...item, id: undefined, object_id: undefined, localId: undefined})) : undefined
          },
          links: {
            deleteMany: (linksAdded.length || linksChanged.length || linksDeleted.length) ? child.links.map((item) => ({...item})) : undefined,
            create: (linksAdded.length || linksChanged.length || linksDeleted.length) ? state.links.map((item) => ({...item, id: undefined, object_id: undefined, localId: undefined})) : undefined
          },
          schedule: {
            deleteMany: (child.schedule_inherit && scheduleAdded.length || scheduleChanged.length || scheduleDeleted.length) ? child.schedule.map((item) => ({...item})) : undefined,
            create: (child.schedule_inherit && scheduleAdded.length || scheduleChanged.length || scheduleDeleted.length) ? state.schedule.filter(({time}) => time).map((day) => ({...day, isWork: undefined, id: undefined, object_id: undefined})) : undefined,
          },
        }})) : undefined
      }
    }
  });
  // Rename photo names of created object
  if (!state.id && state.photos?.length > 0) {
    const updatedObject = await prisma.object.update({
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
    return Response.json(updatedObject);
  };

  return Response.json(addedObject);
}