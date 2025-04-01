"use client";
import React, { useEffect, useRef } from "react";
import "./ImageCarousel.css";

const images = [
    "https://wallpapers.com/images/high/ipl-2021-andre-russell-yelling-tsb0w9j0j0lmr4cn.webp",
    "https://wallpapers.com/images/high/ipl-2021-rohit-sharma-with-equipment-tdvufq5i82vxivuh.webp",
    "https://wallpapers.com/images/high/ipl-2021-devdutt-padikkal-raised-bat-bxyesgkhxgdn6nrf.webp",
    "https://wallpapers.com/images/high/ipl-2021-faf-du-plessis-walking-mffwsdc09p00bm3e.webp",
    "https://wallpapers.com/images/high/ab-de-villiers-rcb-ipl-2018-inrjttyi2t85nuzr.webp",
    "https://wallpapers.com/images/high/ipl-2021-kl-rahul-holding-helmet-z19rj7tceb99tyqh.webp",
    "https://wallpapers.com/images/high/ipl-2021-red-de-villiers-2n3sytk8fkbshjm6.webp",
    "https://wallpapers.com/images/high/ipl-2021-ab-de-villiers-with-bat-4awjublgxq197c4r.webp",
    "https://wallpapers.com/images/high/ipl-2021-chris-gayle-in-red-dq6ryc732v7ud850.webp"
  ];
  

const ImageCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const copy = containerRef.current.innerHTML;
      containerRef.current.innerHTML += copy;
    }
  }, []);

  return (
    <div className="carousel">
      <div className="carousel-track" ref={containerRef}>
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Image ${index + 1}`} className="carousel-image" />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
