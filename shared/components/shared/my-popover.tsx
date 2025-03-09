import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Popover } from "..";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { CircleHelp } from "lucide-react";

type Props = {
  className?: string;
};

export const MyPopover: FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <Popover>
        <PopoverTrigger>
          <CircleHelp />
        </PopoverTrigger>
        <PopoverContent className="w-72  md:w-96 ">
          Мы рады предложить вам три способа доставки вашего заказа: <br /> 1.⁠ ⁠Без
          отслеживания в конверте Großbrief - стоимость 3 €. Пожалуйста, имейте
          в виду, что при выборе этого варианта почта иногда теряет посылки, и
          без номера отслеживания у нас не будет возможности помочь в розыске
          отправления. В данном случае ответственность за доставку лежит на
          почте. <br /> 2.С отслеживанием в конверте Einschreiben- стоимость от 4.2 до
          5.5 € зависит от объема посылки.В данном случае ответственность за
          доставку лежит так же на почте. <br /> 3.С отслеживанием- Paket bis Haftung в
          коробке стоимость 6.20€. Мы рекомендуем этот способ доставки, так как
          он позволяет отслеживать посылку на всех этапах пути и значительно
          снижает риск потери. Ответственность за доставку также лежит на почте,
          но с отслеживанием шансов на успешное разрешение проблем больше.
          <br /> *Обратите внимание:* При выборе доставки без отслеживания, вы
          принимаете на себя риск возможной потери посылки, так как в этом
          случае у нас не будет возможности помочь в розыске отправления.
          Спасибо за понимание и приятных покупок!
        </PopoverContent>
      </Popover>
    </div>
  );
};
