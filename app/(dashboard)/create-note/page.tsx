import { createNote } from "@/app/actions";
import { Input, SubmitButtonBar, Title } from "@/shared/components";
import { Label } from "@/shared/components/ui/label";

export default function CreateNote() {
  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Create new Note" />

      <form  className="flex flex-col items-start gap-5" action={createNote}>
        <div>
          <Label className=" text-lg" htmlFor="name">
            Ru
          </Label>
          <Input
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
            required
            name="labelDe"
            className="mt-2"
            placeholder="De"
          />
        </div>

    
       

       

        
        <SubmitButtonBar />
      </form>
    </div>
  );
}
