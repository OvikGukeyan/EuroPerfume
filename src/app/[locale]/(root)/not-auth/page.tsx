import { InfoBlock } from "@/src/shared/components";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center my-10 md:mt-40">
      <InfoBlock
        title="Access denied"
        text="You are not authorized to view this page."
        imageUrl="/assets/images/lock.png"
      />
    </div>
  );
}
