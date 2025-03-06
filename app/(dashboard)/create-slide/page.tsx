import { createSlider } from "@/app/actions";
import { Input, SubmitButtonBar, Title } from "@/shared/components";
import { Label } from "@/shared/components/ui/label";

export default function CreateSlide() {
  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Create new Slide" />

      <form  className="flex flex-col items-start gap-5" action={createSlider}>
        <div>
          <Label className=" text-lg" htmlFor="name">
            Name
          </Label>
          <Input
            required
            name="name"
            className="mt-2"
            placeholder="Name"
          />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="desctopImg">
            Desctop Image
          </Label>
          <Input className="mt-2" required type="file" name="desctopImg" />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="tabletImg">
            Tablet Image
          </Label>
          <Input className="mt-2" required type="file" name="tabletImg" />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="mobileImg">
            Mobile Image
          </Label>
          <Input className="mt-2" required type="file" name="mobileImg" />
        </div>
        <SubmitButtonBar />
      </form>
    </div>
  );
}
