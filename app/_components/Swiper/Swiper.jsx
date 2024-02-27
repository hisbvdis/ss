"use client";
import Image from "next/image";
import { useEffect } from "react";
import { register } from "swiper/element/bundle";
// -----------------------------------------------------------------------------
import "./styles.css";


export default function Swiper(props) {
  const { photos, width, height, navigation, speed, loop } = props;

  useEffect(() => {
    register();
  },[])

  return (
    <swiper-container navigation={navigation} speed={speed} loop={loop} pagination="true" pagination-type="bullets">
      {photos.map((photo) => (
        <swiper-slide key={photo.name}>
          <Image className="swiper__image" src={`/photos/${photo.name}`} width={width} height={height} alt="Image" style={{inlineSize: "100%", blockSize: "auto", aspectRatio: `${width}/${height}`, objectFit: "cover"}}/>
        </swiper-slide>
      ))}
    </swiper-container>
  )
}