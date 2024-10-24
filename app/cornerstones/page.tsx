import * as EffectsData from '@/data/effects.json';
import { cn } from '@/lib/utils';
import { Cornerstone } from '@/types/Cornerstone';

//ts assumption for object will enumerate keys, but the JSON import wont, so assign generally string indexable object
type si = { [key: string]: string };

const borderMapping: si = {
    'Mythic': 'border-perk-stormforged',
    'Legendary': 'border-perk-orange',
    'Epic': 'border-perk-purple',
    'Rare': 'border-perk-blue',
    'Uncommon': 'border-perk-green',
}

const innerBorderMapping: si = {
    'Mythic': 'border-color-gold',
    'Legendary': 'border-perk-orange',
    'Epic': 'border-perk-purple',
    'Rare': 'border-perk-blue',
    'Uncommon': 'border-perk-green',
}

const textMapping: si = {
    'Mythic': 'text-perk-stormforged',
    'Legendary': 'text-perk-orange',
    'Epic': 'text-perk-purple',
    'Rare': 'text-perk-blue',
    'Uncommon': 'text-perk-green',
}

const CornerstoneComponent = ({ cornerstone }: { cornerstone: Cornerstone }) => 
{
    return (
        <div className={cn('border rounded-md p-4 flex flex-row gap-4', borderMapping[cornerstone.tier])}>
            <div className={cn('h-16 aspect-square border ', innerBorderMapping[cornerstone.tier])}>
                <img
                
                />
            </div>

            <div className='flex flex-col gap-2'>
                <p className={cn('text-lg font-bold', textMapping[cornerstone.tier])}>{cornerstone.label}</p>
                <p className='text-slate-300'>{cornerstone.description}</p>
            </div>
            
        </div>
    )
}

const CornerstonesPage = () => {
    
    const cornerstones: Cornerstone[] = EffectsData.filter(effect => effect.type === 'Cornerstone');
    const stormforged = cornerstones.filter(cornerstone => cornerstone.tier === 'Mythic');
    const annual = cornerstones.filter(cornerstone => cornerstone.tier === 'Legendary' || cornerstone.tier === 'Epic');

    return (
        <div className='flex flex-col gap-2 p-2 overflow-y-auto max-h-full bg-slate-900'>
            {cornerstones.map((cornerstone, index) => {
                return <CornerstoneComponent key={index} cornerstone={cornerstone} />
            })}
        </div>
    )
}

export default CornerstonesPage;