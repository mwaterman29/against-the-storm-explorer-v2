import { getImgSrc } from '@/utils/img/getImgSrc';
import { format } from 'util';
import { formatText } from '@/utils/text/format';
import { Cornerstone } from '@/types/Cornerstone';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

//ts assumption for object will enumerate keys, but the JSON import wont, so assign generally string indexable object
type si = { [key: string]: string };

const borderMapping: si = {
	Mythic: 'border-perk-stormforged',
	Legendary: 'border-perk-orange',
	Epic: 'border-perk-purple',
	Rare: 'border-perk-blue',
	Uncommon: 'border-perk-green'
};

const innerBorderMapping: si = {
	Mythic: 'border-color-gold',
	Legendary: 'border-perk-orange',
	Epic: 'border-perk-purple',
	Rare: 'border-perk-blue',
	Uncommon: 'border-perk-green'
};

const textMapping: si = {
	Mythic: 'text-perk-stormforged',
	Legendary: 'text-perk-orange',
	Epic: 'text-perk-purple',
	Rare: 'text-perk-blue',
	Uncommon: 'text-perk-green'
};

const TutorialTooltip = () =>
{
	return (
		<Tooltip>
			<TooltipTrigger>
				<span className='text-xs text-perk-blue'>Tutorial</span>
			</TooltipTrigger>
			<TooltipContent className='flex flex-col gap-2 text-base'>
				<p>This cornerstone is biome-locked to one of the tutorials.</p>
				<p>
					This cornerstone is <strong>not</strong> available as an annual reward outside of the tutorial scenarios.
				</p>
			</TooltipContent>
		</Tooltip>
	);
};

const HiddenTooltip = () =>
    {
        return (
            <Tooltip>
                <TooltipTrigger>
                    <span className='text-xs text-perk-blue'>Hidden</span>
                </TooltipTrigger>
                <TooltipContent className='flex flex-col gap-2 text-base p-2 border'>
                    <p>Though this cornerstone is available in the game files, it is not available in the game.</p>
                    <p>You will <strong>not</strong> see this as a reward anually, from the altar, from perks, or from glade events.</p>
                </TooltipContent>
            </Tooltip>
        );
    };

const CornerstoneComponent = ({ cornerstone }: { cornerstone: Cornerstone }) =>
{
	console.log('id', cornerstone.label, 'img', `/img/${getImgSrc(cornerstone.label)}`, 'link', encodeURI(`/img/${getImgSrc(cornerstone.label)}.png`));

	const formattedDescription = formatText(cornerstone.description);

	return (
		<div className={cn('border rounded-md p-4 flex flex-row gap-4', borderMapping[cornerstone.tier])}>
			<div className={cn('h-16 aspect-square border ', innerBorderMapping[cornerstone.tier])}>
				<img src={encodeURI(`/img/${getImgSrc(cornerstone.label)}.png`)} />
			</div>

			<div className='flex flex-col gap-2'>
				<div className='flex flex-row items-center gap-2'>
					<p className={cn('text-lg font-bold', textMapping[cornerstone.tier])}>{cornerstone.label}</p>
					{cornerstone.tags.includes('tutorial') && <TutorialTooltip />}
					{cornerstone.tags.includes('hidden') && <HiddenTooltip />}
				</div>
				{formattedDescription}
			</div>
		</div>
	);
};

export default CornerstoneComponent;
