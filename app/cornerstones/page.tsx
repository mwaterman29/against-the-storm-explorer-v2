'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as EffectsData from '@/data/effects.json';
import { cn } from '@/lib/utils';
import { Cornerstone } from '@/types/Cornerstone';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { getImgSrc } from '@/utils/img/getImgSrc';

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

const CornerstoneComponent = ({ cornerstone }: { cornerstone: Cornerstone }) =>
{
	console.log('id', cornerstone.label, 'img', `/img/${getImgSrc(cornerstone.label)}`, 'link', encodeURI(`/img/${getImgSrc(cornerstone.label)}.png`));

	return (
		<div className={cn('border rounded-md p-4 flex flex-row gap-4', borderMapping[cornerstone.tier])}>
			<div className={cn('h-16 aspect-square border ', innerBorderMapping[cornerstone.tier])}>
				<img 
					src={encodeURI(`/img/${getImgSrc(cornerstone.label)}.png`)}
				/>
			</div>

			<div className='flex flex-col gap-2'>
				<div className='flex flex-row items-center gap-2'>
					<p className={cn('text-lg font-bold', textMapping[cornerstone.tier])}>{cornerstone.label}</p>
					{cornerstone.tags.includes('tutorial') && <span className='text-xs text-perk-blue'>Tutorial</span>}
					{cornerstone.tags.includes('hidden') && <span className='text-xs text-perk-blue'>Hidden</span>}
				</div>
				<p className=''>{cornerstone.description}</p>
			</div>
		</div>
	);
};

const CornerstonesPage = () =>
{
	let cornerstones: Cornerstone[] = EffectsData.filter(effect => effect.type === 'Cornerstone');

	//Account for settings
	const showTutorial = useSelector((state: RootState) => state.settings.showTutorial);
	const showInternal = useSelector((state: RootState) => state.settings.showInternal);

	if (!showTutorial)
	{
		cornerstones = cornerstones.filter(cornerstone => !cornerstone.tags.includes('tutorial'));
	}

	if (!showInternal)
	{
		cornerstones = cornerstones.filter(cornerstone => !cornerstone.tags.includes('hidden'));
	}

	//Sort by tags length, then alphabetically
	cornerstones.sort((a, b) =>
	{
		const tagLengthDifference = a.tags.length - b.tags.length;
		if (tagLengthDifference !== 0)
		{
			return tagLengthDifference;
		}
		return a.label.localeCompare(b.label);
	});

	let stormforged = cornerstones.filter(cornerstone => cornerstone.tier === 'Mythic');
	let annual = cornerstones.filter(cornerstone => cornerstone.tier === 'Legendary' || cornerstone.tier === 'Epic');
	let legendary = cornerstones.filter(cornerstone => cornerstone.tier === 'Legendary');
	let epic = cornerstones.filter(cornerstone => cornerstone.tier === 'Epic');

	return (
		<div className='flex flex-col gap-2 p-2 overflow-y-auto max-h-[calc(100dvh-48px)] bg-slate-900 text-slate-300'>
			<Collapsible>
				<CollapsibleTrigger className='flex flex-col items-start'>
					<p className='text-xl text-white'>
						<span className='text-perk-stormforged font-bold'>Stormforged</span> Cornerstones
					</p>
					<p>
						<span className='text-perk-stormforged font-bold'>Stormforged</span> Cornerstones are only available from the Forsaken Altar, during the
						storm.
					</p>
				</CollapsibleTrigger>
				<CollapsibleContent className='flex flex-col gap-2'>
					{stormforged.map((cornerstone, index) =>
					{
						return <CornerstoneComponent key={index} cornerstone={cornerstone} />;
					})}
				</CollapsibleContent>
			</Collapsible>

			<Collapsible>
				<CollapsibleTrigger>
					<p className='text-xl text-white'>
						<span className='text-perk-orange font-bold'>Annual</span> Cornerstones
					</p>
				</CollapsibleTrigger>
				<CollapsibleContent className='flex flex-col gap-2'>
					<div className='flex flex-col py-2'>
						<p className='text-white text-lg'>
							<span className='text-perk-orange'>Legendary</span> Cornerstones
						</p>
						<p className=''>
							<span className='text-perk-orange'>Legendary</span> Cornerstones are offered at the start of <strong>even years</strong>, until
							after year 6.
						</p>
						<p></p>
						<hr />
					</div>
					{legendary.map((cornerstone, index) =>
					{
						return <CornerstoneComponent key={index} cornerstone={cornerstone} />;
					})}

					<div className='flex flex-col py-2'>
						<p className='text-white text-lg'>
							<span className='text-perk-purple'>Epic</span> Cornerstones
						</p>
						<p className=''>
							<span className='text-perk-purple'>Epic</span> Cornerstones are offered at the start of <strong>even years</strong>.
						</p>
						<p></p>
						<hr />
					</div>
					{epic.map((cornerstone, index) =>
					{
						return <CornerstoneComponent key={index} cornerstone={cornerstone} />;
					})}
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

export default CornerstonesPage;
