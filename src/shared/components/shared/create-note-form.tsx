"use client";

import React, { FC, useState } from "react";
import { Button, Input, Title } from "..";
import { Label } from "../ui/label";
import { cn } from "@/src/lib/utils";
import { createSlide } from "@/src/app/actions";
import { MetaValues } from "../../store";

type Props = {
  onSubmit: (data: MetaValues) => void;
  loading?: boolean;
  error: boolean;
  className?: string;
};

export const CreateNoteForm: FC<Props> = ({ className, onSubmit, loading, error }) => {
  
  const [labelRu, setLabelRu] = useState("");
  const [labelDe, setLabelDe] = useState("");

  const onClickSubmit = () => {
    onSubmit({ labelRu, labelDe });
  }
  return (
    <div className={cn(" px-10 mb-10", className)}>
      <Title className="mb-5" text="Create new Note" />

      <form className="flex flex-col items-start gap-5" action={createSlide}>
        <div>
          <Label className=" text-lg" htmlFor="name">
            Ru
          </Label>
          <Input
            value={labelRu}
            onChange={(e) => setLabelRu(e.target.value)}
            required
            name="labelRu"
            className="mt-2"
            placeholder="Ru"
          />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="name">
            De
          </Label>
          <Input
            value={labelDe}
            onChange={(e) => setLabelDe(e.target.value)}
            required
            name="labelDe"
            className="mt-2"
            placeholder="De"
          />
        </div>
{error && <p className="text-red-500 text-sm mt-2">Error</p>}
        <Button  disabled={labelRu === "" || labelDe === ""} loading={loading} onClick={onClickSubmit}>Add</Button>
      </form>
    </div>
  );
};
