'use client';

import { Card } from "fumadocs-ui/components/card";
import Image from "next/image";
import React from "react";

interface ImageCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  href: string;
  imageSrc: string;
  imageAlt?: string;
  data_plausible_event_name?: string;
}

export function ImageCard({
  title,
  description,
  href,
  imageSrc,
  imageAlt = title,
  data_plausible_event_name,
}: ImageCardProps) {

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (data_plausible_event_name && typeof window !== "undefined" && typeof window.plausible === "function") {
      window.plausible(data_plausible_event_name); // Trigger the Plausible event
    }
  };

  return (
    <Card
      className="transition hover:shadow-lg hover:bg-fd-muted cursor-pointer"
      title={
        <a
          href={href}
          onClick={handleClick}
          className="block no-underline text-inherit"
        >
          <div className="flex flex-col">
            <div className="-mx-4 -mt-4 mb-4">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={800}
                height={400}
                className="w-full h-auto object-cover rounded-t-xl"
              />
            </div>
            <div>{title}</div>
          </div>
        </a>
      }
      description={description}
    />
  );
}