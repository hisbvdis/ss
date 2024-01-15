"use client";
import clsx from "clsx";
import { TileLayer } from ".";
import { createContext, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./Map.css";


export default function Map(props) {
  const { className, children, style, zoomControl=true, liftMapInstance=(e=>e), onMapRightClick=(e=>e), fitBoundsArray } = props;
  const center = props.center?.[0] && props.center?.[1] ? props.center : [0, 0];
  const zoom = props.zoom ?? 3;
  const ref = useRef();
  const [ map, setMap ] = useState();
  const [ L, setL ] = useState();

  useEffect(() => {(async () => {
    const L = await import("leaflet");
    if (ref.current.children.length > 0) return;
    const map = L.map(ref.current, {center, zoom, zoomControl});
    L.Icon.Default.imagePath = "/map/";
    map.on("contextmenu", onMapRightClick);
    setL(L);
    setMap(map);
    liftMapInstance(map);
  })()}, [])

  useEffect(() => {
    if (!map || !fitBoundsArray || fitBoundsArray.length === 0) return;
    map.fitBounds(fitBoundsArray);
  }, [map, fitBoundsArray])

  useEffect(() => {
    if (!map || !center[0] || !center[1]) return;
    map.setView(center);
  }, [center])

  return (
    <MapContext.Provider value={{center, zoom, map, ref, L}}>
      <TileLayer/>
      <div className={clsx("map", className)} ref={ref} style={style}></div>
      {children}
    </MapContext.Provider>
  )
}

export const MapContext = createContext();
