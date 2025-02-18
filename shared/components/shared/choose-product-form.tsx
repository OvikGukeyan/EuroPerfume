import { cn } from "@/shared/lib/utils";
import React, { FC } from "react";
import { GroupVariants } from "./group-variants";
import { Button, Separator } from "../ui";
import Image from "next/image";
import { Title, Text, VolumeSelection } from ".";

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  loading: boolean;
  onSubmit?: VoidFunction;
  className?: string;
}
export const ChooseProductForm: FC<Props> = ({
  name,
  imageUrl,
  price,
  loading,
  onSubmit,
  className,
}) => {
  return (
    <div className={cn("flex flex-col lg:flex-row flex-1", className)}>
      <div className="flex  items-center justify-center flex-1 relative w-2/5">
        <Image
          width={350}
          height={350}
          src={
            "https://media.douglas.de/medias/zUsfEz1217085-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4Mzg1NnxpbWFnZS9qcGVnfGFHUXdMMmhsTmk4Mk16QTNNelEyT1RnNU1EVTVNQzk2VlhObVJYb3hNakUzTURnMVh6QmZaR2RzTFVSRkxtcHdad3wyYmMxMGVhZGQ5ZjdiNWRjZDMyZDU1Y2QwMTQ4MWY4MzE4NjhkYTJiZjNkODU0MGE3ZTQxOTk4NzA0YWUyYzE4&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775"
          }
          alt="product"
          className="relative left-2 top-2 tranzition-all z-10 duration-300 w-[350px] h-[350px] "
        />
      </div>

      <div className="w-3/5 bg-[#f2f2f2] p-7">
        <Title
          text={"Emporio Armani Stronger with You"}
          size="md"
          className="font-extrabold mb-2"
        />

        <Separator/>

        <Text className="my-4">
          Entdecken Sie STRONGER WITH YOU PARFUM, einen intensiven und
          fesselnden Duft mit den süchtig machenden Noten von ledriger Vanille,
          der niemanden unberührt lassen wird. <br /> <br />
          Dieses Parfum betört die Sinne. Zunächst verbindet sich eine würzige
          Vibration, die durch Noten von rosa Pfeffer erzeugt wird, mit einem
          aromatischen Herz aus Lavendel. Dann wird der ikonische STRONGER WITH
          YOU Eis-Kastanien-Akkord mit einer ledrigen, intensiv süchtig
          machenden Vanille verwoben. <br /> <br />
          STRONGER WITH YOU PARFUM wird in einem Flakon mit einem klaren, sehr
          maskulinen Design und Bernsteintönen präsentiert, die keinen Zweifel
          an seiner Intensität lassen. Der Deckel mit seinen ineinander
          verschlungenen Ringen aus geschwärztem Silber symbolisiert die Stärke,
          die aus der Verbindung mit anderen entsteht.
        </Text>

        <VolumeSelection className="mb-4"/>

        <Separator/>

        <Button
          loading={loading}
          onClick={() => onSubmit?.()}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-6"
        >
          Add too cart for {price} €
        </Button>
        <GroupVariants items={[]} />
      </div>
    </div>
  );
};
