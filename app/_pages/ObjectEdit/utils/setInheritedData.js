import { objectReadProcessing } from "@/app/_db/object.processing";
import { produce } from "immer";

export const setInheritedData = (parent, setState) => {
  if (parent) {
    const processed = objectReadProcessing(parent);
    setState(produce(state, (draft) => {
      draft.status_inherit = true;
      draft.coord_inherit = true;
      draft.schedule_inherit = true;
      draft.name_where = processed?.name_where;
      draft.status = processed?.status;
      draft.status_comment = processed?.status_comment;
      draft.status_confirm = processed?.status_confirm;
      draft.city_id = processed?.city_id;
      draft.city = processed?.city;
      draft.parent_id = processed?.id;
      draft.parent = processed;
      draft.address = processed?.address;
      draft.address_2 = processed?.address_2;
      draft.coord_lat = processed?.coord_lat;
      draft.coord_lon = processed?.coord_lon;
      draft.phones = processed?.phones;
      draft.links = processed?.links;
      draft.schedule_247 = processed?.schedule_247;
      draft.schedule = processed?.schedule;
      draft.schedule_date = processed?.schedule_date;
      draft.schedule_comment = processed?.schedule_comment;
      draft.schedule_source = processed?.schedule_source;
      draft.statusInstead = processed?.statusInstead;
      draft.status_instead_id = processed?.status_instead_id;
    }));
  }
  else {
    setState(produce(state, (draft) => {
      draft.parent_id = null;
      draft.parent = null;
      draft.status_inherit = false;
      draft.coord_inherit = false;
      draft.schedule_inherit = false;
    }))
  }
}