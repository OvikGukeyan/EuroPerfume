"use client";
import React, { FC, useRef, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";
import { ErrorText } from ".";

interface Props {
  name: string;
  className?: string;
}
export const AdressInput: FC<Props> = ({ name, className }) => {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const [cityBounds, setCityBounds] = useState<google.maps.LatLngBounds | null>(
    null
  );

  const adressError = errors[name]?.message as string;
  const cityName = name === 'deliveryAddress' ? "deliveryCity" : "city";
  const zipName = name === 'deliveryAddress' ? "deliveryZip" : "zip";
  const cityError =  errors[cityName]?.message as string ;

  const handleCitySelect = (place: google.maps.places.PlaceResult) => {
    const components = place.address_components;
    const city =
      components?.find((c) => c.types.includes("locality"))?.long_name ?? "";

    const zip =
      components?.find((c) => c.types.includes("postal_code"))?.long_name ?? "";

    setValue(cityName, city);
    setValue(zipName, zip);

    // Установить bounds по геолокации города
    const location = place.geometry?.location;
    if (location) {
      const lat = location.lat();
      const lng = location.lng();

      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(lat - 0.05, lng - 0.05),
        new google.maps.LatLng(lat + 0.05, lng + 0.05)
      );

      setCityBounds(bounds);
    }
  };

  const handleStreetSelect = (place: google.maps.places.PlaceResult) => {
    const components = place.address_components;
    if (!components) return;

    const streetNumber = components.find((c) =>
      c.types.includes("street_number")
    )?.long_name;

    const route = components.find((c) => c.types.includes("route"))?.long_name;

    const fullStreet = [route, streetNumber].filter(Boolean).join(" ");
    setValue(name, fullStreet);
  };

  return (
    <div className={cn("w-full flex flex-col md:flex-row gap-4", className)}>
      <div className="w-full">
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          placeholder="Enter city or postal code"
          options={{
            types: ["(regions)"],
            componentRestrictions: { country: "de" },
          }}
          onPlaceSelected={handleCitySelect}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {cityError && <ErrorText className="mt-2" text={cityError} />}
      </div>

      <div className="w-full">
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          placeholder="Enter street"
          options={{
            types: ["address"],
            componentRestrictions: { country: "de" },
            ...(cityBounds && {
              bounds: cityBounds,
              strictBounds: true,
            }),
          }}
          onPlaceSelected={handleStreetSelect}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {adressError && <ErrorText className="mt-2" text={adressError} />}
      </div>
    </div>
  );
};
