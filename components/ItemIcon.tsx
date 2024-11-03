import { cn } from "@/lib/utils";
import { getImgSrc } from "@/utils/img/getImgSrc";

interface ItemIconProps
{
	item: string;
	size: 's' | 'm' | 'l' | 'xl';
	className?: string;
}

const ItemIcon = ({ item, size, className }: ItemIconProps) =>
{
    const sizeClassName = {
        s: 'w-8 h-8',
        m: 'w-12 h-12',
        l: 'w-16 h-16',
        xl: 'w-24 h-24'
    }[size];

	return (
		<div className={cn('h-16 aspect-square border ', sizeClassName, className)}>
			<img src={encodeURI(`/img/${getImgSrc(item)}.png`)} />
		</div>
	);
};

export default ItemIcon;
