import { objectReadProcessing } from "@/app/(routes)/api/objects/processing";

export const setInheritedData = (parent, setState) => {
  if (parent) {
    const processed = objectReadProcessing(parent);
    setState((state) => {
      state.status_inherit = true;
      state.coord_inherit = true;
      state.schedule_inherit = true;
      state.name_where = processed?.name_where;
      state.status = processed?.status;
      state.status_comment = processed?.status_comment;
      state.status_confirm = processed?.status_confirm;
      state.city_id = processed?.city_id;
      state.city = processed?.city;
      state.parent_id = processed?.id;
      state.parent = processed;
      state.address = processed?.address;
      state.address_2 = processed?.address_2;
      state.coord_lat = processed?.coord_lat;
      state.coord_lon = processed?.coord_lon;
      state.phones = processed?.phones;
      state.links = processed?.links;
      state.schedule_247 = processed?.schedule_247;
      state.schedule = processed?.schedule;
      state.schedule_date = processed?.schedule_date;
      state.schedule_comment = processed?.schedule_comment;
      state.schedule_source = processed?.schedule_source;
    });
  }
  else {
    setState((state) => {
      state.parent_id = null;
      state.parent = null;
      state.status_inherit = false;
      state.coord_inherit = false;
      state.schedule_inherit = false;
    })
  }
}