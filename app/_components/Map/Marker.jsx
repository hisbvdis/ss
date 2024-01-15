"use client";
import { MapContext } from "./Map";
import { useContext, useEffect, useState } from "react";


export default function Marker(props) {
  const { draggable, onDragEnd=(e=>e) } = props;
  const mapContext = useContext(MapContext);
  const L = mapContext.L;
  const map = mapContext.map;
  const coord = props.coord[0] && props.coord[1] ? props.coord : mapContext.coord ?? [0, 0];
  const [ marker, setMarker ] = useState();

  useEffect(() => {
    if (!L || !map) return;
    const marker = L.marker(coord, {draggable}).addTo(map);
    marker.on("dragend", onDragEnd);
    setMarker(marker);
    return () => marker.remove();
  }, [L, map, draggable]);

  useEffect(() => {
    if (!marker) return;
    marker.setLatLng(coord);
  }, [coord])

  return null;
}
