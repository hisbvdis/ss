"use client";
import { MapContext } from "./Map";
import { useContext, useEffect } from "react";


export default function TileLayer(props) {
  const mapContext = useContext(MapContext);
  const L = mapContext.L;
  const map = mapContext.map;
  const url = props.url ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution = props.attribution ?? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  useEffect(() => {
    if (!L || !map) return;
    L.tileLayer(url, {attribution}).addTo(map);
  }, [L, map]);

  return null;
}
