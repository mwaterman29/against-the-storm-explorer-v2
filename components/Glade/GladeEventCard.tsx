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
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import GladeSolveOptionCard from './GladeSolveOptionCard';
import { formatSecondsToMMSS } from '@/utils/formatSecondsToMMSS';
import GladeEffectCard from './GladeEffectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import ArrowForwardIos from '@material-symbols/svg-400/outlined/arrow_forward_ios.svg';
import ArrowBackIos from '@material-symbols/svg-400/outlined/arrow_back_ios.svg';

const GladeEventCard = (event: GladeEvent) =>
{
	const selectedDifficulty = useSelector((state: RootState) => state.settings.difficulty);
	const difficultyIndex = Math.min(event.difficulties.length - 1, selectedDifficulty);
	const difficulty = event.difficulties[difficultyIndex];

	const [allVisible, setAllVisible] = useState(false);
	const [visibleTab, setVisibleTab] = useState('solve1');

	let solveTime = event.totalTime;
	if (solveTime > 120)
	{
		if (selectedDifficulty > 0) solveTime += 30;
		if (selectedDifficulty > 1) solveTime += 30;
		if (selectedDifficulty > 2) solveTime += 30;
	}
	if (selectedDifficulty >= 12)
	{
		solveTime = Math.floor(solveTime * 1.4935);
	}

	return (
		<div className={cn('flex p-4 border rounded-md text-white items-center gap-2', allVisible ? 'flex flex-row items-start col-span-4' : 'flex-col')}>
			<div className='flex flex-col items-center gap-2'>
				<div className='flex flex-row items-center justify-center gap-4 min-w-72'>
					<p className='font-semibold text-2xl'>{event.label}</p>
					<button onClick={() => setAllVisible(!allVisible)} className={cn(' bg-transparent transition-all duration-300 text-xl')}>
						{allVisible ? <ArrowBackIos /> : <ArrowForwardIos />}
					</button>
				</div>
				<img className='w-48 h-48 rounded-md border-ats-dark-brown border-2' src={`/img/${getImgSrc(event.id)}.png`} />
			</div>

			<div className={cn('flex w-full bg-transparent gap-2', allVisible ? 'hidden' : '')}>
				{difficulty.gladeSolveOptions.length > 0 && (
					<button
						onClick={() =>
						{
							setVisibleTab('solve1');
							setAllVisible(false);
						}}
						className={cn('w-full bg-transparent transition-all duration-300', visibleTab === 'solve1' && 'bg-gray-700')}
					>
						{difficulty.gladeSolveOptions[0].name}
					</button>
				)}
				<button
					onClick={() =>
					{
						setVisibleTab('threats');
						setAllVisible(false);
					}}
					className={cn('w-full', visibleTab === 'threats' && 'bg-gray-700')}
				>
					Threats
				</button>
				{difficulty.gladeSolveOptions.length > 1 && (
					<button
						onClick={() =>
						{
							setVisibleTab('solve2');
							setAllVisible(false);
						}}
						className={cn('w-full', visibleTab === 'solve2' && 'bg-gray-700')}
					>
						{difficulty.gladeSolveOptions[1].name}
					</button>
				)}
			</div>

			<div className={cn('', allVisible ? 'grid grid-cols-3' : 'flex')}>
				{(!allVisible && visibleTab === 'solve1') || allVisible ? <GladeSolveOptionCard {...difficulty.gladeSolveOptions[0]} /> : null}

				{(!allVisible && visibleTab === 'threats') || allVisible ? (
					<div>
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
								<div key={index}>
									{displayThreat && (
										<p className='w-full text-center font-semibold h-[39px] flex items-center justify-center'>
											Every {formatSecondsToMMSS(threat.interval as number)} not solved:
										</p>
									)}
									<GladeEffectCard effect={threat} />
								</div>
							);
						})}
					</div>
				) : null}

				{(!allVisible && visibleTab === 'solve2') || allVisible ? <GladeSolveOptionCard {...difficulty.gladeSolveOptions[1]} /> : null}
			</div>
		</div>
	);
};

export default GladeEventCard;

/*

	return (
		<div className='flex flex-col text-white border rounded-md '>
			<p className='font-semibold text-2xl px-4 pt-2'>{event.label}</p>
			<div className='flex flex-row p-4 pt-2 gap-4 w-full '>
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
										<p className='w-full text-center font-semibold h-[39px] flex items-center justify-center'>
											Every {formatSecondsToMMSS(threat.interval as number)} not solved:
										</p>
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

*/
