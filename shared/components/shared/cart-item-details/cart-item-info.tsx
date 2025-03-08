
interface Props {
  name: string;
  clssName?: string
}

export const CartItemInfo: React.FC<Props> = ({ name, clssName }) => {
  

  return (
    <div className={clssName}>
      <div className="flex items-center justify-between">
        <h2 className="text-md md:text-lg font-bold flex-1 leading-6">{name}</h2>
      </div>
    </div>
  );
};
