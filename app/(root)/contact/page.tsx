import { InfoBlock } from "@/shared/components";

export default function ContactPage() {
    return (
        <div className="flex flex-col items-center justify-center my-10 md:mt-40">
            <InfoBlock
                title="Contact"
                text="If you have any questions or feedback, please don't hesitate to contact us."
                imageUrl="/assets/images/lock.png"
            />
        </div>
    );
}