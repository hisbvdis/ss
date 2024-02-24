"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { ObjectContext } from ".";
import { Flex } from "@/app/_components/Flex";
import { Card } from "@/app/_components/Card";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { Select } from "@/app/_components/Select";
import { Control } from "@/app/_components/Control";
import { Checkbox } from "@/app/_components/Choice";
import { Map, Marker } from "@/app/_components/Map";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/(routes)/api/cities/requests";
import { getObjectsByFilters } from "@/app/(routes)/api/objects/requests";
import { queryAddressForCoord, queryCoodFromAddress } from "@/app/_utils/nominatim";
import { handleQuotes } from "@/app/_utils/handleQuotes";
import { setInheritedData } from "./utils";


export default function Address(props) {
  const { state, setState, handleStateChange } = useContext(ObjectContext);
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
      setState((state) => {
        state.coord_lat = result.lat;
        state.coord_lon = result.lon;
      });
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
      setState((state) => {
        state.address = `${road}${house ? `, ${house}` : ""}`;
      });
    },
    markerDragEnd: (e) => {
      const { lat, lng } = e.target._latlng;
      setState((state) => {
        state.coord_lat = lat;
        state.coord_lon = lng;
      });
    },
    rightClick: (e) => {
      const { lat, lng } = e.latlng;
      setState((state) => {
        if (state.coord_inherit) return;
        state.coord_lat = lat;
        state.coord_lon = lng;
      });
    }
  }

  useEffect(() => {
    if (!state.coord_inherit) return;
    setState((state) => {
      state.coord_lat = state.parent?.coord_lat;
      state.coord_lon = state.parent?.coord_lon;
    })
  }, [state.coord_inherit])

  return (
    <Card heading="Адрес и местоположение" className="mt10">
      <Flex gap="15px">
        <div className="objectEdit__address">
          <Control>
            <Control.Label>Город</Control.Label>
          </Control>
          <Select
            name="city_id"
            value={state.city_id}
            text={state?.city?.name}
            onChange={handleStateChange.value}
            onChangeData={(data) => setState((state) => {state.city = data})}
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
              onChange={(e) => handleStateChange(handleQuotes(e))}
              placeholder="ТРЦ Центральный"
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
      </Flex>
    </Card>
  )
}
