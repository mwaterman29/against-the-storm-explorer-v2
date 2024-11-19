'use client';

import ItemIcon from '@/components/ItemIcon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { gladeEvents } from '@/data/gladeEvents';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { GladeEvent, GladeSolveOption } from '@/types/GladeEvent';
import { ItemUsage } from '@/types/ItemUsage';
import { getImgSrc } from '@/utils/img/getImgSrc';
import { interpolateSprites } from '@/utils/text/interpolateSprites';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const categoryDescriptions: Record<string, string> = {
	Forbidden: 'Forbidden Glade events appear only in Forbidden glades.'
};

function formatSecondsToMMSS(seconds: number): string
{
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formattedMinutes = minutes.toString(); //.padStart(2, '0');
	const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
	return `${formattedMinutes}:${formattedSeconds}`;
}

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

const GladeSolveOptionColumn = ({ options, showBorder }: { options?: ItemUsage[], showBorder?: boolean }) =>
{
	return (
		<div className='flex flex-col w-full items-start gap-1'>

			<div className={cn('flex flex-col p-4 pt-1 gap-1 h-full w-full relative', (showBorder ? 'border-r ' : ''))}>
				<div className='absolute top-2 right-2'>
				{options?.length === 1 ? (
						<p className='hidden'>
							(<span className='font-semibold'>Required</span>)
						</p>
					) : (
						<p>
							(<span className='font-semibold'>One</span> of {options?.length})
						</p>
					)}

				</div>
				{options?.map((item, index) => (
					<div key={index} className='flex flex-row items-center gap-2'>
						<p>{item.count}</p>
						<ItemIcon item={item.id} size='s' />
						<p>{item.id}</p>
					</div>
				))}
			</div>
		</div>
	);
};

const GladeSolveOptionCard = (solveOption: GladeSolveOption) =>
{
	return (
		<div className='flex flex-row rounded-md'>
			<div className='flex flex-col w-full'>
				<div className='flex flex-row items-center justify-center gap-2 w-full border-b py-2 mb-2 h-10'>
					<p>{solveOption.name}</p>
					{solveOption.decisionTag && <p className='text-sm'>({solveOption.decisionTag})</p>}
				</div>
				<div className={cn('grid w-full', solveOption.options2?.length > 0 ? ' grid-cols-2' : ' grid-cols-1')}>
					<GladeSolveOptionColumn options={solveOption.options1} showBorder={solveOption.options2?.length > 0}/>
					{solveOption.options2?.length > 0 && <GladeSolveOptionColumn options={solveOption.options2} />}
				</div>

				{solveOption.workingEffects?.length > 0 && (
					<div>
						<p className='p-2 w-full text-center font-semibold'>While Solving</p>
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
	if (solveTime > 120)
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
		<div className='flex flex-col text-white'>
			<p className='font-semibold text-2xl'>{event.label}</p>
			<div className='flex flex-row p-4 gap-2 border rounded-md w-full '>
				<img className='w-48 h-48 rounded-md border-ats-dark-brown border-2' src={`/img/${getImgSrc(event.id)}.png`} />
				<div className='grid grid-cols-3 w-full'>
					<GladeSolveOptionCard {...difficulty.gladeSolveOptions[0]} />
					<div className='flex flex-col border-x'>
						{event.threats.map((threat, index) =>
						{
							let displayThreat = false;
							if (index === 0 && threat.interval)
							{
								displayThreat = true;
							}
							if (index > 0 && event.threats[index - 1].interval !== threat.interval)
							{
								displayThreat = true;
							}

							return (
								<div>
									{displayThreat && (
										<p className='w-full text-center font-semibold h-[39px] flex items-center justify-center'>Every {formatSecondsToMMSS(threat.interval as number)} not solved:</p>
									)}
									<GladeEffectCard effect={threat} />
								</div>
							);
						})}
						<hr />
						<div className='w-full flex flex-col items-center p-2 pt-4 gap-2'>
							<p className='text-center font-semibold'>{formatSecondsToMMSS(solveTime)} to solve</p>
							<p>Up to {event.workerSlots} Workers</p>
						</div>
					</div>
					<GladeSolveOptionCard {...difficulty.gladeSolveOptions[1]} />
				</div>
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
		<div className='flex flex-col overflow-y-auto max-h-full bg-slate-900 text-white p-4'>
			<p>Glade Events</p>

			{Object.entries(gladeEventsByCategory).map(([category, events]) =>
			{
				return (
					<Collapsible defaultOpen>
						<CollapsibleTrigger className='w-full items-start flex flex-col gap-1'>
							<h2 className='text-3xl'>{category}</h2>
							{categoryDescriptions[category] && <p>{categoryDescriptions[category]}</p>}
							<hr className='w-full mb-4' />
						</CollapsibleTrigger>
						<CollapsibleContent className='flex flex-col gap-2'>
							{events.map((event, index) => (
								<GladeEventCard key={index} {...event} />
							))}
						</CollapsibleContent>
					</Collapsible>
				);

				return (
					<div key={category} className='p-4'>
						<div className='flex flex-col gap-2'></div>
					</div>
				);
			})}
		</div>
	);
};

export default GladeEventsPage;
