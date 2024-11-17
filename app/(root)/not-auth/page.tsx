import { InfoBlock } from "@/shared/components";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <InfoBlock
        title="Access denied"
        text="You are not authorized to view this page."
        imageUrl="/assets/images/lock.png"
      />
    </div>
  );
}
