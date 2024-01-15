import Photos from "./Photos";
import Status from "./Status";
import Address from "./Address";
import Schedule from "./Schedule";
import Contacts from "./Contacts";
import NameOrg from "./NameOrg";
import ObjectEdit from "./ObjectEdit";
import Description from "./Description";
import NamePlace from "./NamePlace";
import { ObjectContext } from "./ObjectEdit";
import SectionsOptions from "./SectionsOptions";

import { syncPhotos } from "./utils/syncPhotos";
import { setInheritedData } from "./utils/setInheritedData";
import { handleChangeWithQuotes } from "./utils/handleChangeWithQuotes";

export {
  ObjectEdit,
  Status,
  Address,
  Contacts,
  Description,
  Schedule,
  Photos,
  SectionsOptions,
  NameOrg,
  ObjectContext,
  NamePlace,
  handleChangeWithQuotes, setInheritedData, syncPhotos
};