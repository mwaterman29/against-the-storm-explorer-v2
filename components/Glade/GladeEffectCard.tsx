import { getImgSrc } from "@/utils/img/getImgSrc";
import { interpolateSprites } from "@/utils/text/interpolateSprites";

const GladeEffectCard = ({ effect }: { effect: any }) =>
{
    //{effect.interval && <span>(Every {formatSecondsToMMSS(effect.interval)})</span>}

    return (
        <div className='flex flex-row items-start gap-2 p-1 rounded-md border-t rounded-t-none'>
            <img className='h-16 aspect aspect-square' src={`/img/${getImgSrc(effect.label)}.png`} />
            <div className='flex flex-col gap-1'>
                <p className='text-lg font-medium'>{effect.label} </p>
                <p>{interpolateSprites(effect.description)}</p>
            </div>
        </div>
    );
};

export default GladeEffectCard;