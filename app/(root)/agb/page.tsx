export default function AGBPage() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Общие условия (AGB)</h1>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">1. Область применения</h2>
          <p>
            Настоящие Общие условия распространяются на все заказы, сделанные через наш интернет-магазин.
            Отклоняющиеся условия покупателя не признаются, если только мы не согласовали их в письменной форме.
          </p>
        </section>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">2. Договорный партнёр</h2>
          <p>
            Купля-продажа осуществляется с Euro Perfume, представленным директором, с юридическим адресом в Германии.
          </p>
        </section>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">3. Заключение договора</h2>
          <p>
            Представленные в интернет-магазине товары не являются юридически обязывающим предложением, а служат только каталогом.
            Нажимая кнопку «Купить сейчас», вы делаете обязательный заказ на товары, находящиеся в корзине.
          </p>
        </section>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">4. Цены и стоимость доставки</h2>
          <ul className="list-disc list-inside space-y-2 mb-3">
            <li>Все цены указаны с учетом действующего НДС.</li>
            <li>К указанным ценам добавляются расходы на доставку, которые будут явно указаны при оформлении заказа.</li>
          </ul>
        </section>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">5. Доставка</h2>
          <p>
            Доставка осуществляется по территории Германии, а также в другие страны ЕС. Информацию о сроках доставки можно найти на странице конкретного товара.
          </p>
        </section>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">6. Оплата</h2>
          <p>Доступны следующие способы оплаты:</p>
          <ul className="list-disc list-inside space-y-2 mb-3">
            <li>PayPal</li>
            <li>Кредитная карта (Visa, Mastercard)</li>
            <li>Предоплата банковским переводом</li>
          </ul>
        </section>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">7. Право собственности</h2>
          <p>
            Товар остаётся нашей собственностью до полной оплаты.
          </p>
        </section>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">8. Право на отзыв</h2>
          <p>
            Потребители имеют законное право на отзыв. Подробную информацию вы найдете в нашей политике возврата.
          </p>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Урегулирование споров</h2>
          <p>
            Европейская Комиссия предоставляет платформу для онлайн-урегулирования споров (OS), доступную по следующей ссылке:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
          <p>
            Мы не обязаны и не готовы участвовать в процедуре урегулирования споров в потребительском арбитраже.
          </p>
        </section>
      </div>
    );
  }