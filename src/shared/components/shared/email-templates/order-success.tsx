import { calcCartItemTotalPrice } from "@/src/shared/lib";
import { CartItemDTO } from "@/src/shared/services/dto/cart.dto";
import { PricingSnapshot, splitGross } from "@/src/shared/lib/tax";

import * as React from "react";

interface Props {
  orderId: number;
  orderDate: string;
  total: number;
  items: CartItemDTO[];
  pricing?: PricingSnapshot;
}

export const OrderSuccessTemplate: React.FC<Props> = ({
  orderId,
  orderDate,
  total,
  items,
  pricing,
}) => (
  <div>
    <h1>Vielen Dank für Ihren Einkauf!</h1>
    <p>
      Ihre Bestellung bei Euro Perfume wurde erfolgreich aufgegeben – wir danken
      Ihnen für Ihr Vertrauen und Ihre ausgezeichnete Wahl!
    </p>

    <h2>Bestelldetails:</h2>
    <ul>
      <li>
        Bestellnummer:{" "}
        <strong>#EP-{orderId.toString().padStart(6, "0")}</strong>
      </li>
      <li>
        Datum: <strong>{orderDate}</strong>
      </li>
      <li>
        Gesamtbetrag inkl. Versand: <strong>€{total.toFixed(2)}</strong>
      </li>
    </ul>

    {pricing && <p>{pricing.policy.mode === "exempt" ? "Umsatzsteuer wird gemäß §19 UStG nicht ausgewiesen." : pricing.policy.mode === "vat" ? `Darin enthaltene MwSt. 19%: ${(splitGross(pricing.totalGrossCents, pricing.policy.rateBasisPoints ?? 1900).vatCents / 100).toFixed(2)} €.` : "Die anwendbare Umsatzsteuer wird bei der Bestätigung Ihrer Bestellung ausgewiesen."}</p>}
    <p>
      Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um die Details zu
      bestätigen, und Sie informieren, sobald das Paket an den
      Versanddienstleister übergeben wurde.
    </p>

    <p>
      <strong>Wie geht es weiter?</strong>
      <br />
      • Wir verpacken Ihre Bestellung sorgfältig
      <br />
      • Sie erhalten eine E-Mail/SMS mit der Sendungsverfolgungsnummer
      <br />• Die Lieferung dauert je nach Region 2–7 Werktage
    </p>

    <p>
      Wenn Sie Fragen haben – antworten Sie einfach auf diese E-Mail oder
      kontaktieren Sie uns unter:
      <br />
      <a href="mailto:europerfumeshop@gmail.com">europerfumeshop@gmail.com</a>
    </p>

    <p>
      Sie können uns auch über den beim Bestellvorgang angegebenen Messenger
      kontaktieren.
    </p>

    <hr />

    <h3>Bestellübersicht:</h3>
    <ul>
      {pricing ? pricing.lines.map((line, index) => <li key={index}>{line.title} × {line.quantity} {line.onTap ? "ml" : "Stk."} = <strong>{(line.grossCents / 100).toFixed(2)} €</strong></li>) : items.map((item) => (
        <li key={item.id}>
          {item.product.name} | {item.variation?.name} × {item.quantity} ={" "}
          <strong>
            {calcCartItemTotalPrice(
              item.product.price,
              item.quantity,
              Boolean(item.product.productGroup?.onTap),
              item.product.discountPrice || undefined
            )}{" "}
            €
          </strong>
        </li>
      ))}
    </ul>

    <p style={{ marginTop: "2rem" }}>
      Mit Liebe zu Düften,
      <br />
      Ihr Euro Perfume Team
      <br />
      <a href="https://euro-perfume-inky.vercel.app" target="_blank">
        www.euro-perfume.com
      </a>
    </p>
  </div>
);
