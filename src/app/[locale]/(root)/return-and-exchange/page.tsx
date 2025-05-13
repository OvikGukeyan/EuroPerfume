import { Button } from "@/src/shared/components";
import { File } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ReturnAndExchange() {
  const t = useTranslations("Return");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">{t("title")}</h1>

      <p className="mb-4">{t("greeting")}</p>
      <p className="mb-4">
        {t.rich("legalNote", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      <ul className="list-disc list-inside space-y-2 mb-6">
        {t.raw("nonReturnable").map((item: string, i: number) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mb-4">
        {t("consumerRight.title")}
      </h2>
      <p className="mb-4">
        {t.rich("consumerRight.definition", {
          em: (chunks) => <em>{chunks}</em>,
        })}
      </p>

      <h2 className="text-2xl font-semibold mb-4">{t("instruction.title")}</h2>
      <p className="mb-4">
        {t.rich("instruction.period", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      <p className="mb-4 font-semibold">{t("instruction.begins")}</p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        {t.raw("instruction.conditions").map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <p className="mb-4 font-semibold">{t("instruction.how.title")}</p>
      <p className="mb-4">
        {t.rich("instruction.how.description", {
          a: (chunks) => (
            <a href="mailto:europerfumeshop@gmail.com" className="underline">
              {chunks}
            </a>
          ),
        })}
      </p>

      <a href="/withdrawal-form.pdf" download>
        <Button className="flex gap-2" variant="outline">
          {t("instruction.download")}
          <File />
        </Button>
      </a>

      <p className="my-4 italic">{t("instruction.deadlineNote")}</p>

      <h2 className="text-2xl font-semibold mb-4">{t("consequences.title")}</h2>
      <ul className="list-disc list-inside space-y-2 mb-6">
        {t.raw("consequences.items").map((item: string, i: number) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mb-4">{t("exceptions.title")}</h2>
      <ul className="list-disc list-inside space-y-2 mb-6">
        {t.raw("exceptions.items").map((item: string, i: number) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }}/>
        ))}
      </ul>

      <p className="font-semibold">{t("thanks")}</p>
      <p className="font-semibold">{t("team")}</p>
    </div>
  );
}
