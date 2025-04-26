export default function AGBPage() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">ОБЩИЕ УСЛОВИЯ (AGB) и ИНФОРМАЦИЯ ДЛЯ КЛИЕНТОВ</h1>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">I. Общие положения</h2>
  
          <h3 className="text-xl font-semibold mb-2">§1 Основные положения</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Настоящие условия регулируют договорные отношения между вами как клиентом и нами — интернет-магазином Euro Perfume, доступным по адресу www.euro-perfume.com.</li>
            <li>Ваши собственные условия не являются частью договора, если иное не согласовано явно.</li>
            <li>Потребителем считается любое физическое лицо, совершающее сделку в личных целях.</li>
            <li>Предпринимателем считается лицо, действующее в рамках своей профессиональной или коммерческой деятельности.</li>
          </ul>
  
          <h3 className="text-xl font-semibold mb-2">§2 Заключение договора</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Предметом договора является продажа товаров.</li>
            <li>Размещение товара на сайте является юридически обязывающим предложением.</li>
            <li>Договор заключается путем добавления товара в корзину и оформления заказа с последующим нажатием кнопки «Заказать с обязательством оплаты», «Купить» или аналогичной.</li>
            <li>После оформления заказа вы получите подтверждение по электронной почте. Убедитесь в правильности адреса e-mail.</li>
          </ul>
  
          <h3 className="text-xl font-semibold mb-2">§3 Особые положения по способам оплаты</h3>
          <p className="mb-4">
            При выборе PayPal или других платёжных сервисов (например, Klarna, Apple Pay) оплата обрабатывается соответствующим провайдером. Дополнительные условия указываются отдельно.
          </p>
  
          <h3 className="text-xl font-semibold mb-2">§4 Удержание и право собственности</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Удержание возможно только в рамках одного договорного обязательства.</li>
            <li>Товар остаётся нашей собственностью до полной оплаты.</li>
          </ul>
  
          <h3 className="text-xl font-semibold mb-2">§5 Гарантия</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Действует установленное законом право на гарантию.</li>
            <li>Рекомендуем проверять товар на наличие повреждений при получении.</li>
            <li>Отклонения от стандартных характеристик товара считаются согласованными только при уведомлении.</li>
          </ul>
  
          <h3 className="text-xl font-semibold mb-2">§6 Применимое право и юрисдикция</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Применяется право Германии.</li>
            <li>Место исполнения и юрисдикция — адрес нашего офиса для предпринимателей.</li>
            <li>Конвенция ООН о договорах международной купли-продажи товаров не применяется.</li>
          </ul>
        </section>
  
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">II. Информация для клиентов</h2>
  
          <h3 className="text-xl font-semibold mb-2">1. Продавец</h3>
          <p className="mb-4">
            Euro Perfume<br />
            Email: <a href="mailto:europerfumeshop@gmail.com" className="text-blue-600 underline">europerfumeshop@gmail.com</a><br />
            Платформа для разрешения споров:{" "}
            <a
              href="https://ec.europa.eu/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://ec.europa.eu/odr
            </a>
          </p>
  
          <h3 className="text-xl font-semibold mb-2">2. Информация о заключении договора</h3>
          <p className="mb-4">См. §2 Общих положений.</p>
  
          <h3 className="text-xl font-semibold mb-2">3. Язык и сохранение договора</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Язык договора — русский (немецкий).</li>
            <li>Полный текст договора не сохраняется, рекомендуется сохранить заказ самостоятельно.</li>
            <li>Данные заказа отправляются по электронной почте.</li>
          </ul>
  
          <h3 className="text-xl font-semibold mb-2">4. Основные характеристики товаров</h3>
          <p className="mb-4">Указаны в описании каждого товара.</p>
  
          <h3 className="text-xl font-semibold mb-2">5. Цены и оплата</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Все цены указаны без стоимости доставки.</li>
            <li>Стоимость доставки указывается отдельно.</li>
            <li>За пределами ЕС возможны таможенные сборы.</li>
            <li>Оплата производится сразу после оформления заказа.</li>
            <li>Доступные способы оплаты указаны на сайте.</li>
          </ul>
  
          <h3 className="text-xl font-semibold mb-2">6. Условия доставки</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Сроки и ограничения доставки указаны на сайте.</li>
            <li>Риск утраты товара переходит к покупателю при получении.</li>
          </ul>
  
          <h3 className="text-xl font-semibold mb-2">7. Право на гарантию</h3>
          <p className="mb-4">См. §5 Общих положений.</p>
        </section>
      </div>
    );
  }