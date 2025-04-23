export default function PaymentInfoPage() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Доставка и оплата</h1>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Доставка</h2>
          <p className="mb-3">
            Мы доставляем заказы по всей территории Германии и в страны ЕС.
            Отправка осуществляется через DHL, Deutsche Post или другие надёжные службы доставки.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-3">
            <li>Срок отправки: 1–3 рабочих дня после подтверждения оплаты.</li>
            <li>Срок доставки по Германии: 2–5 рабочих дней.</li>
            <li>Международная доставка: от 4 до 10 рабочих дней.</li>
            <li>Стоимость доставки рассчитывается при оформлении заказа и зависит от страны и веса посылки.</li>
            <li>Бесплатная доставка по Германии при заказе от 100€.</li>
          </ul>
          <p>Вы получите уведомление на email (или в мессенджер) с трекинг-номером после отправки.</p>
        </section>
  
        <hr className="my-8 border-t border-gray-300" />
  
        <section>
          <h2 className="text-2xl font-semibold mb-4">Оплата</h2>
          <p className="mb-3">Мы принимаем следующие способы оплаты:</p>
          <ul className="list-disc list-inside space-y-2 mb-3">
            <li>PayPal</li>
            <li>Кредитные и дебетовые карты (Visa, Mastercard)</li>
            <li>Предоплата по банковскому переводу</li>
          </ul>
          <p>
            Оплата должна быть произведена в течение 3 рабочих дней после оформления заказа. <br />
            Заказы, не оплаченные в срок, автоматически отменяются.
          </p>
        </section>
      </div>
    );
  }