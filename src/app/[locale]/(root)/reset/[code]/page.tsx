import { prisma } from "@/prisma/prisma-client";
import { Container, ResetForm } from "@/src/shared/components";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const code = (await params).code;

  if (!code) {
    redirect("/not-auth");
  }

  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      code,
    },
  });

  if (!verificationCode) {
    redirect("/not-auth");
  }

  return (
    <Container className="flex justify-center lg:justify-start my-10">
      <ResetForm code={code} />
    </Container>
  );
}
