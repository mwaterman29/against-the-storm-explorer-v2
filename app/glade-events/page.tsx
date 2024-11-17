'use client';

import ItemIcon from '@/components/ItemIcon';
import { gladeEvents } from '@/data/gladeEvents';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { GladeEvent, GladeSolveOption } from '@/types/GladeEvent';
import { ItemUsage } from '@/types/ItemUsage';
import { getImgSrc } from '@/utils/img/getImgSrc';
import { interpolateSprites } from '@/utils/text/interpolateSprites';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

function formatSecondsToMMSS(seconds: number): string
{
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formattedMinutes = minutes.toString().padStart(2, '0');
	const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
	return `${formattedMinutes}:${formattedSeconds}`;
}

const GladeEffectCard = ({ effect }: { effect: any }) =>
{
	return (
		<div className='flex flex-row items-start gap-2 border p-1 rounded-md'>
			<img className='h-16 aspect aspect-square' src={`/img/${getImgSrc(effect.label)}.png`} />
			<div className='flex flex-col gap-1'>
				<p className='text-lg font-medium'>{effect.label}</p>
				<p>{interpolateSprites(effect.description)}</p>
			</div>
		</div>
	);
};

const GladeSolveOptionColumn = ({ options }: { options?: ItemUsage[] }) =>
{
	return (
		<div className='flex flex-col w-full items-start p-4 border'>
			{options?.length === 1 ? (
				<p>
					<span className='font-semibold'>One</span> of:
				</p>
			) : (
				<p>
					<span className='font-semibold'>Requires</span>:
				</p>
			)}

			<div className='w-full border-b my-1' />
			{options?.map((item, index) => (
				<div key={index} className='flex flex-row items-center gap-2'>
					<p>{item.count}</p>
					<ItemIcon item={item.id} size='s' />
					<p>{item.id}</p>
				</div>
			))}
		</div>
	);
};

const GladeSolveOptionCard = (solveOption: GladeSolveOption) =>
{
	return (
		<div className='flex flex-row p-4 border rounded-md'>
			<div className='flex flex-col w-full'>
				<div className='flex flex-row items-center justify-center gap-2'>
					<p>{solveOption.name}</p>
					{solveOption.decisionTag && <p className='text-sm'>({solveOption.decisionTag})</p>}
				</div>
				<div className={cn('grid w-full', solveOption.options2?.length > 0 ? ' grid-cols-2' : ' grid-cols-1')}>
					<GladeSolveOptionColumn options={solveOption.options1} />
					{solveOption.options2?.length > 0 && <GladeSolveOptionColumn options={solveOption.options2} />}
				</div>

				{solveOption.workingEffects?.length > 0 && (
					<div>
						<p>Working Effects</p>
						<div className='flex flex-col gap-2'>
							{solveOption.workingEffects?.map((effect, index) => <GladeEffectCard key={`we_${index}`} effect={effect} />)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const GladeEventCard = (event: GladeEvent) =>
{
	const selectedDifficulty = useSelector((state: RootState) => state.settings.difficulty);
	const difficultyIndex = Math.min(event.difficulties.length - 1, selectedDifficulty);

	const difficulty = event.difficulties[difficultyIndex];

	let solveTime = event.totalTime;
	if(solveTime > 120)
	{
		if (selectedDifficulty > 0)
			{
				solveTime += 30;
			}
			if (selectedDifficulty > 1)
			{
				solveTime += 30;
			}
			if (selectedDifficulty > 2)
			{
				solveTime += 30;
			}
	}
	if (selectedDifficulty >= 12)
	{
		solveTime = Math.floor(solveTime * 1.4935);
	}

	return (
		<div className='flex flex-row p-4 border rounded-md'>
			<img className='w-48 h-48' src={`/img/${getImgSrc(event.id)}.png`} />
			<div className='grid grid-cols-3'>
				<GladeSolveOptionCard {...difficulty.gladeSolveOptions[0]} />
				<div className='flex flex-col'>
					<p>Threats:</p>
					{event.threats.map((threat, index) =>
					{
						return (
							<div>
								<GladeEffectCard effect={threat} />
							</div>
						);
					})}
					<hr />
					<p>Time to Solve: {formatSecondsToMMSS(solveTime)}</p>
				</div>
				<GladeSolveOptionCard {...difficulty.gladeSolveOptions[1]} />
			</div>
		</div>
	);
};

const GladeEventsPage = () =>
{
	const gladeEventsByCategory = useMemo(() =>
	{
		return gladeEvents.reduce(
			(acc, event) =>
			{
				const difficulty = event.difficulty || 'Unknown';
				if (!acc[difficulty])
				{
					acc[difficulty] = [];
				}
				acc[difficulty].push(event);
				return acc;
			},
			{} as Record<string, GladeEvent[]>
		);
	}, [gladeEvents]);

	return (
		<div className='flex flex-col overflow-y-auto max-h-full'>
			<p>Glade Events</p>
			{Object.entries(gladeEventsByCategory).map(([category, events]) => (
				<div key={category}>
					<h2 className='text-2xl'>{category}</h2>
					<div className='flex flex-col gap-2'>
						{events.map((event, index) => (
							<GladeEventCard key={index} {...event} />
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default GladeEventsPage;
