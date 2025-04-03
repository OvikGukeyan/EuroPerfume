
interface Props {
  name: string;
  info: string;
  clssName?: string;
}

export const CartItemInfo: React.FC<Props> = ({ name, info, clssName }) => {
  

  return (
    <div className={clssName}>
      <div className="flex flex-col justify-center">
        <h2 className="text-md md:text-lg font-bold flex-1 leading-6">{name}</h2>
        <p className="text-xs text-gray-400">{info}</p>
      </div>
    </div>
  );
};
