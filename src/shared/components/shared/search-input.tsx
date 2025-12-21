"use client";

import { Link, useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/shared/lib/utils";
import { Api } from "@/src/shared/services/api-client";
import { ProductDTO } from "@/src/shared/services/dto/product.dto";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useClickAway, useDebounce } from "react-use";

interface Props {
  onProductClick: (product: ProductDTO) => void;
  className?: string;
}
export const russianToGermanLayout = (input: string) => {
  const layoutMap: { [key: string]: string } = {
    а: "a",
    б: "b",
    в: "w",
    г: "g",
    д: "d",
    е: "e",
    ё: "ö",
    ж: "v",
    з: "z",
    и: "b",
    й: "q",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "x",
    ш: "y",
    щ: "y",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "ü",
    я: "ä",
    А: "A",
    Б: "B",
    В: "W",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "Ö",
    Ж: "V",
    З: "Z",
    И: "B",
    Й: "Q",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "C",
    Ч: "X",
    Ш: "Y",
    Щ: "Y",
    Ъ: "",
    Ы: "Y",
    Ь: "",
    Э: "E",
    Ю: "Ü",
    Я: "Ä",
  };
  return input
    .split("")
    .map((char) => layoutMap[char] || char)
    .join("");
};
export const ruToDeLayoutQWERTZ = (input: string) => {
  const map: { [key: string]: string } = {
    й: "q",
    ц: "w",
    у: "e",
    к: "r",
    е: "t",
    н: "z",
    г: "u",
    ш: "i",
    щ: "o",
    з: "p",
    х: "ü",
    ъ: "+",
    ф: "a",
    ы: "s",
    в: "d",
    а: "f",
    п: "g",
    р: "h",
    о: "j",
    л: "k",
    д: "l",
    я: "y",
    ч: "x",
    с: "c",
    м: "v",
    и: "b",
    т: "n",
    ь: "m",
    б: ",",
    ю: ".",
    ё: "§",
    Й: "Q",
    Ц: "W",
    У: "E",
    К: "R",
    Е: "T",
    Н: "Z",
    Г: "U",
    Ш: "I",
    Щ: "O",
    З: "P",
    Х: "Ü",
    Ъ: "+",
    Ф: "A",
    Ы: "S",
    В: "D",
    А: "F",
    П: "G",
    Р: "H",
    О: "J",
    Л: "K",
    Д: "L",
    Я: "Y",
    Ч: "X",
    С: "C",
    М: "V",
    И: "B",
    Т: "N",
    Ь: "M",
    Б: ",",
    Ю: ".",
    Ё: "§",
    " ": " ",
  };

  return input
    .split("")
    .map((char) => map[char] || char)
    .join("");
};
export const SearchInput: React.FC<Props> = ({ className, onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useClickAway(ref, () => {
    setFocused(false);
  });

  const goToSearchPage = () => {
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/items?search=${encodeURIComponent(q)}`);
    setFocused(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearchPage();
    }
  };

  const onItemClick = (product: ProductDTO) => {
    setFocused(false);
    setProducts([]);
    setSearchQuery("");
    onProductClick(product);
  };

  useDebounce(
    async () => {
      try {
        const convertedQuery = ruToDeLayoutQWERTZ(searchQuery);
        const convertedQuery2 = russianToGermanLayout(searchQuery);

        const response = await Api.products.search(convertedQuery);
        const responseAlt =
          response.length === 0 && convertedQuery !== convertedQuery2
            ? await Api.products.search(convertedQuery2)
            : [];

        const combined = [...response, ...responseAlt].reduce<ProductDTO[]>(
          (acc, curr) => {
            if (!acc.some((p) => p.id === curr.id)) acc.push(curr);
            return acc;
          },
          []
        );
        setProducts(combined);
      } catch (error) {
        console.log(error);
      }
    },
    250,
    [searchQuery]
  );
  return (
    <>
      <div
        ref={ref}
        className={cn(
          "flex rounded-2xl flex-1 justify-between relative h-12 z-30",
          className
        )}
      >
        <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
        <input
          className="rounded-md border outline-none w-full bg-gray-100 pl-11"
          type="text"
          placeholder={
            session ? `${session.user.name}, что ищете?` : "Find product..."
          }
          onFocus={() => setFocused(true)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />

        {products.length > 0 && (
          <div
            className={cn(
              "absolute w-full h-[400px] overflow-y-auto bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30 scrollbar",
              focused && "visible opacity-100 top-12"
            )}
          >
            {products.map((product) => (
              <div
                onClick={() => onItemClick(product)}
                key={`product/${product.id}`}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10 "
                // href={`/product/${product.id}`}
              >
                <Image
                  src={product.imageUrl[0] || product.variations[0].imageUrl}
                  width={30}
                  height={30}
                  alt={product.name}
                />
                <div className="flex flex-col gap-1">
                  <span>{product.brand.name}</span>
                  <span>{product.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
