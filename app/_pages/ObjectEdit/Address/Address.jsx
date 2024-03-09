"use client";
import { produce } from "immer";
import { useContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { Select } from "@/app/_components/Select";
import { ObjectEditContext } from "../ObjectEdit";
import { Control } from "@/app/_components/Control";
import { Checkbox } from "@/app/_components/Choice";
import { Map, Marker } from "@/app/_components/Map";
// -----------------------------------------------------------------------------
import { setInheritedData } from "../";
import { getCitiesByFilters } from "@/app/_db/city";
import { handleQuotes } from "@/app/_utils/handleQuotes";
import { queryAddressForCoord, queryCoodFromAddress } from "@/app/_utils/nominatim";
import styles from "./styles.module.css";
import { getObjectsByFilters } from "@/app/_db/object";


export default function Address(props) {
  const { state, setState, handleStateChange } = useContext(ObjectEditContext);
  const [ mapInstance, setMapInstance ] = useState();

  const handleMap = {
    getCoordFromAddress: async () => {
      if (!state.city_id) return;
      const result = await queryCoodFromAddress({
        country: state.city.country_name,
        city: state.city.name,
        street: state.address
      });
      if (!result) return;
      setState(produce(state, (draft) => {
        draft.coord_lat = result.lat;
        draft.coord_lon = result.lon;
      }));
      mapInstance.setView([result.lat, result.lon]);
      mapInstance.setZoom(17);
    },
    getAddressFromCoord: async () => {
      if (!state.coord_lat || !state.coord_lon) return;
      const result = await queryAddressForCoord({
        lat: state.coord_lat,
        lon: state.coord_lon
      });
      if (!result) return;
      const road = result.address.road;
      const house = result.address.house_number;
      setState(produce(state, (draft) => {
        draft.address = `${road}${house ? `, ${house}` : ""}`;
      }));
    },
    markerDragEnd: (e) => {
      const { lat, lng } = e.target._latlng;
      setState(produce(state, (draft) => {
        draft.coord_lat = lat;
        draft.coord_lon = lng;
      }));
    },
    rightClick: (e) => {
      const { lat, lng } = e.latlng;
      setState(produce(state, (draft) => {
        if (draft.coord_inherit) return;
        draft.coord_lat = lat;
        draft.coord_lon = lng;
      }));
    }
  }

  useEffect(() => {
    if (!state.coord_inherit) return;
    setState(produce(state, (draft) => {
      draft.coord_lat = draft.parent?.coord_lat;
      draft.coord_lon = draft.parent?.coord_lon;
    }))
  }, [state.coord_inherit])

  return (
    <Card className="mt10">
      <Card.Heading>Адрес и местоположение</Card.Heading>
      <Card.Section className={styles["objectEdit__content"]}>
        <div className="objectEdit__address">
          <Control>
            <Control.Label>Город</Control.Label>
          </Control>
          <Select
            name="city_id"
            value={state.city_id}
            text={state?.city?.name}
            onChange={handleStateChange.value}
            onChangeData={(data) => setState(produce(state, (draft) => {draft.city = data}))}
            isAutocomplete disabled={state.parent_id}
            placeholder="Введите название"
            requestItemsOnInputChange={async (name) => (
              await getCitiesByFilters({name})).map((city) => ({
              id: city.id, text: city.name, text2: city.country_name, text3: city.admin1_name, text4: city.admin2_name, data: city
            }))}
          />
          <Control className="mt20">
            <Control.Label>
              <a href={state.parent_id ? `/object/${state.parent_id}` : undefined}>На базе организации</a>
            </Control.Label>
            <Select
              name="parent_id"
              value={state?.parent_id}
              text={state?.parent?.name_full}
              onChange={(e) => setInheritedData(e.target.data, setState)}
              isAutocomplete
              placeholder="Введите название"
              disabled={!state.city_id}
              requestItemsOnInputChange={async (value) => (
                await getObjectsByFilters({cityId: state.city_id, type: "org", query: value}))
                  .filter((org) => org.id !== state.id)
                  .map((org) => ({id: org.id, text: org.name_full, data: org})
              )}
            />
          </Control>
          <Control className="mt20">
            <Control.Label>Адрес</Control.Label>
            <div style={{display: "flex"}}>
              <Input
                name="address"
                value={state.address}
                onChange={handleStateChange.value}
                disabled={state.parent_id}
                placeholder="Центральный проспект, 153А"
                required
              />
              <Button onClick={handleMap.getCoordFromAddress} disabled={state.parent_id}>→</Button>
              <Button onClick={handleMap.getAddressFromCoord} disabled={state.parent_id}>←</Button>
            </div>
          </Control>
          <Control>
            <Control.Label srOnly>Уточнение расположения</Control.Label>
            <Input
              name="address_2"
              value={state.address_2}
              onChange={(e) => handleStateChange.value(handleQuotes(e))}
              placeholder="ТРЦ «Центральный»"
              disabled={state.parent_id}
            />
          </Control>
        </div>
        <div className="objectEdit__map">
          <Checkbox
            name="coord_inherit"
            checked={state.coord_inherit}
            onChange={handleStateChange.value}
            disabled={!state.parent_id}
          >
            Наследовать координату
          </Checkbox>
          <Map
            center={[state.coord_lat, state.coord_lon]}
            zoom={16}
            liftMapInstance={setMapInstance}
            onMapRightClick={handleMap.rightClick}
          >
            <Marker
              coord={[state.coord_lat, state.coord_lon]}
              draggable={!state.coord_inherit}
              onDragEnd={handleMap.markerDragEnd}
            />
          </Map>
        </div>
      </Card.Section>
    </Card>
  )
}
