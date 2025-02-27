import { getImgSrc } from "@/utils/img/getImgSrc";
import { interpolateSprites } from "@/utils/text/interpolateSprites";

const GladeEffectCard = ({ effect }: { effect: any }) =>
{
    //{effect.interval && <span>(Every {formatSecondsToMMSS(effect.interval)})</span>}

    return (
        <div className='flex flex-row items-start gap-4 p-4 border-t border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-colors'>
            <img 
                className='h-16 w-16 rounded-md border border-slate-600' 
                src={`/img/${getImgSrc(effect.label)}.png`} 
                alt={effect.label}
            />
            <div className='flex flex-col gap-2'>
                <p className='text-lg font-medium text-slate-50'>{effect.label}</p>
                <p className='text-slate-300 text-sm leading-relaxed'>{interpolateSprites(effect.description)}</p>
            </div>
        </div>
    );
};

export default GladeEffectCard;