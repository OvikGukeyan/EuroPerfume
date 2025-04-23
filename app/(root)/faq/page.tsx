export default function Faq() {
    return (
      <div className="flex flex-col items-start justify-center max-w-3xl mx-auto my-10 md:mt-40 px-4">
        <h1 className="text-3xl font-bold mb-8">Часто задаваемые вопросы о возврате и обмене</h1>
  
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Могу ли я вернуть парфюм на распив?</h2>
          <p>
            Нет. В соответствии с §312g Гражданского кодекса Германии, а также по гигиеническим причинам,
            парфюмы на распив возврату и обмену не подлежат.
          </p>
        </div>
  
        <hr className="my-4 border-gray-300 w-full" />
  
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. Почему право на возврат не действует для распивов?
          </h2>
          <p>
            Распив оформляется под индивидуальный заказ (например, 2–10 мл), и не может быть перепродан после вскрытия.
          </p>
        </div>
  
        <hr className="my-4 border-gray-300 w-full" />
  
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            3. Я купил оригинальный флакон в плёнке. Можно вернуть?
          </h2>
          <p>
            Да, если упаковка не вскрыта, и товар в заводской плёнке, его можно вернуть в течение 14 дней.
            Пожалуйста, предварительно свяжитесь с нами.
          </p>
        </div>
  
        <hr className="my-4 border-gray-300 w-full" />
  
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            4. Что делать, если заказ пришёл повреждённым?
          </h2>
          <p>
            Пожалуйста, отправьте нам фото повреждения в течение 48 часов после получения на{" "}
            <a href="mailto:info@euro-perfume.com" className="text-blue-600 underline">
              info@euro-perfume.com
            </a>{" "}
            — мы обязательно найдём решение.
          </p>
        </div>
      </div>
    );
  }