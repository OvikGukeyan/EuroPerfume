export const insightDays = (raw: string | string[] | undefined): 7 | 30 | 90 => raw === "7" ? 7 : raw === "90" ? 90 : 30;
export const scalar = (raw: string | string[] | undefined) => typeof raw === "string" ? raw : "";
export const berlinZone = "Europe/Berlin";
export const berlinHour = (date: Date) => Number(new Intl.DateTimeFormat("en-GB",{timeZone:berlinZone,hour:"2-digit",hourCycle:"h23"}).format(date));
export const promoKey = (code: string) => code.trim().toUpperCase().startsWith("EP15-") ? "legacy15" : code;
export const pageNumber = (raw: string | string[] | undefined) => Math.max(1, Math.min(10000, Number.parseInt(scalar(raw),10)||1));
