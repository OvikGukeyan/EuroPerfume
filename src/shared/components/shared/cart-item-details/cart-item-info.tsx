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
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500 leading-5">
          {brand}
        </h2>

        <h2 className="text-sm font-semibold leading-5 break-words">
          {name}
        </h2>
        <p className="text-xs text-neutral-500">{info}</p>
      </div>
    </div>
  );
};
