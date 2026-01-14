interface Props {
  name: string;
  brand: string;
  info: string;
  clssName?: string;
}

export const CartItemInfo: React.FC<Props> = ({ name, brand, info, clssName }) => {
  return (
    <div className={clssName}>
      <div className="flex flex-col justify-center">
        <h2 className="text-md md:text-md font-bold flex-1 leading-6">
          {brand}
        </h2>

        <h2 className="text-md md:text-lg font-bold flex-1 leading-6">
          {name}
        </h2>
        <p className="text-xs text-gray-400">{info}</p>
      </div>
    </div>
  );
};
