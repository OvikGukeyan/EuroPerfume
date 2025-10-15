"use client";
import React, { FC, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";
import { ErrorText, FormInput } from ".";
import { useTranslations } from "next-intl";
import { iso2to3 } from "../../lib";
import { log } from "console";

interface Props {
  name: string;
  className?: string;
}
export const AddressInput: FC<Props> = ({ name, className }) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const [cityInput, setCityInput] = useState("");
  const [streetInput, setStreetInput] = useState("");
  const [countryInput, setCountryInput] = useState("Deutschland");

  const [cityBounds, setCityBounds] = useState<google.maps.LatLngBounds | null>(
    null
  );

  const addressError = errors[name]?.message as string;
  const cityName = name === "deliveryAddress" ? "deliveryCity" : "city";
  const zipName = name === "deliveryAddress" ? "deliveryZip" : "zip";
  const countryName =
    name === "deliveryAddress" ? "deliveryCountry" : "country";
  const cityError = errors[cityName]?.message as string;
  const countryError = errors[countryName]?.message as string;

  const handleCountrySelect = (place: google.maps.places.PlaceResult) => {
    const components = place.address_components;

    const countryComponent = components?.find((c) =>
      c.types.includes("country")
    );
    const country = countryComponent?.long_name ?? "";
    const country2Letter = countryComponent?.short_name ?? "";
    const country3 = iso2to3(country2Letter);

    if (!country) return; // Не страна — не устанавливаем

    setValue(countryName, country3);
    setCountryInput(country);
  };

  const handleCitySelect = (place: google.maps.places.PlaceResult) => {
    const components = place.address_components;
    const city =
      components?.find((c) => c.types.includes("locality"))?.long_name ?? "";
    const zip =
      components?.find((c) => c.types.includes("postal_code"))?.long_name ?? "";

    setValue(cityName, city);
    setValue(zipName, zip);
    setCityInput(city);

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
    setStreetInput(fullStreet);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountryInput(value);
    setValue(countryName, value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setValue(cityName, value);
  };

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStreetInput(value);
    setValue(name, value);
  };

  const t = useTranslations("Checkout.AddressInput");
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-5", className)}>
      <div className="w-full">
        <Autocomplete
          language="en"
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          placeholder={t("City")}
          options={{
            types: ["(regions)"],
            componentRestrictions: { country: "de" },
          }}
          onPlaceSelected={handleCitySelect}
          onChange={handleCityChange}
          value={cityInput}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-md"
        />
        {cityError && <ErrorText className="mt-2" text={cityError} />}
      </div>
      <FormInput name="zip" className="text-base" placeholder={t("zip")} />
      <div className="w-full">
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          placeholder={t("Address")}
          options={{
            types: ["address"],
            componentRestrictions: { country: "de" },
            ...(cityBounds && {
              bounds: cityBounds,
              strictBounds: true,
            }),
          }}
          onPlaceSelected={handleStreetSelect}
          onChange={handleStreetChange}
          value={streetInput}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-md"
        />
        {addressError && <ErrorText className="mt-2" text={addressError} />}
      </div>
      <div>
        <FormInput
          name="houseNumber"
          className="text-base"
          placeholder={t("houseNumber")}
        />
      </div>

      <div className="w-full">
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          placeholder={t("Country")}
          options={{
            types: ["geocode"],
          }}
          onPlaceSelected={handleCountrySelect}
          onChange={handleCountryChange}
          value={countryInput}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-md"
        />
        {countryError && <ErrorText className="mt-2" text={countryError} />}
      </div>
    </div>
  );
};
