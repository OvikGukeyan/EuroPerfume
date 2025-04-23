import * as React from "react";

interface Props {
  code: string;
}

export const UserVerificationTemplate: React.FC<Props> = ({ code }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      lineHeight: "1.5",
    }}
  >
    <p>Здравствуйте!</p>

    <p>
      Благодарим вас за регистрацию на сайте <strong>Euro Perfume</strong> (
      <a
        href="https://www.euro-perfume.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://www.euro-perfume.com/
      </a>
      ) — мире оригинальной парфюмерии и утончённого стиля.
    </p>

    <p>
      Чтобы завершить создание аккаунта и получить доступ к вашему личному
      кабинету, подтвердите, пожалуйста, ваш адрес электронной почты:
    </p>

    <p>
      <a
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?code=${code}`}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#222",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Подтвердить email
      </a>
    </p>

    <p>Если кнопка не работает, воспользуйтесь этой ссылкой:</p>
    <p>
      <a
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?code=${code}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?code=${code}`}
      </a>
    </p>

    <p>После подтверждения вы сможете:</p>
    <ul>
      <li>Оформлять заказы быстрее</li>
      <li>Отслеживать историю покупок</li>
      <li>Получать эксклюзивные предложения и скидки</li>
    </ul>

    <p>
      Если вы не регистрировались у нас — просто проигнорируйте это письмо. Ваша
      почта не будет использована.
    </p>

    <p>С любовью к парфюму,</p>
    <p>
      <strong>Команда Euro Perfume</strong>
      <br />
      <a
        href="https://www.euro-perfume.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.euro-perfume.com
      </a>
    </p>
  </div>
);
