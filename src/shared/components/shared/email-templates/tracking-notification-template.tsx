import * as React from "react";

interface Props {
  orderId: number;
  trackingNumber: string;
  trackingUrl?: string; // можно сгенерировать на сервере
  deliveryService?: string; // например, "DHL"
}

export const TrackingNotificationTemplate: React.FC<Props> = ({
  orderId,
  trackingNumber,
  trackingUrl = `https://www.dhl.de/de/privatkunden/dhl-sendungsverfolgung.html?piececode=${trackingNumber}`,
  deliveryService = "DHL",
}) => (
  <div>
    <h1>Ihre Bestellung ist unterwegs!</h1>

    <p>
      Ihre Bestellung <strong>#EP-{orderId.toString().padStart(6, "0")}</strong> wurde erfolgreich verpackt und an den Versanddienstleister übergeben.
    </p>

    <h2>Sendungsverfolgung:</h2>
    <ul>
      <li>
        Versanddienstleister: <strong>{deliveryService}</strong>
      </li>
      <li>
        Sendungsnummer: <strong>{trackingNumber}</strong>
      </li>
      <li>
        Tracking-Link:{" "}
        <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
          Sendung verfolgen
        </a>
      </li>
    </ul>

    <p>
      Bitte beachten Sie, dass es je nach Region 1–2 Werktage dauern kann, bis die Sendung im System sichtbar ist.
    </p>

    <p>
      Wenn Sie Fragen zur Lieferung haben, antworten Sie einfach auf diese E-Mail oder schreiben Sie an:{" "}
      <a href="mailto:europerfumeshop@gmail.com">europerfumeshop@gmail.com</a>
    </p>

    <p>
      Vielen Dank für Ihren Einkauf und Ihr Vertrauen!
      <br />
      Ihr Euro Perfume Team
    </p>

    <p>
      <a href="https://www.euro-perfume.com" target="_blank" rel="noopener noreferrer">
        www.euro-perfume.com
      </a>
    </p>
  </div>
);