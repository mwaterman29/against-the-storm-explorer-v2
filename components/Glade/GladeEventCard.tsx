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
import { useMemo, useState, useRef, useEffect } from 'react';
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
	const cardRef = useRef<HTMLDivElement>(null);

	const handleVisibilityToggle = () => {
		setAllVisible(!allVisible);
		// Wait for the next render cycle before scrolling
		setTimeout(() => {
			if (cardRef.current) {
				cardRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
			}
		}, 0);
	};

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
		<div ref={cardRef} className={cn('flex p-4 border border-slate-700 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-white items-center gap-4', 
			allVisible ? 'flex-col sm:flex-row items-start col-span-1 sm:col-span-2 lg:col-span-3 2xl:col-span-4' : 'flex-col')}>
			<div className={cn('flex flex-col items-center gap-4', allVisible && 'sm:min-w-[300px]')}>
				<div className='flex flex-row items-center justify-between w-full gap-4'>
					<h3 className='font-semibold text-xl text-slate-50'>{event.label}</h3>
					<button 
						onClick={handleVisibilityToggle} 
						className={cn('p-2 rounded-md hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-50')}
					>
						{allVisible ? <ArrowBackIos /> : <ArrowForwardIos />}
					</button>
				</div>
				<img 
					className='w-48 h-48 rounded-lg border-2 border-slate-600 hover:border-slate-500 transition-colors' 
					src={`/img/${getImgSrc(event.id)}.png`}
					alt={event.label} 
				/>
				<div className='text-center text-slate-400 text-sm'>
					<p>{formatSecondsToMMSS(solveTime)} to solve</p>
					<p>Up to {event.workerSlots} Workers</p>
				</div>
			</div>

			<div className={cn('flex w-full bg-transparent gap-2', allVisible ? 'hidden' : '')}>
				{difficulty.gladeSolveOptions.length > 0 && (
					<button
						onClick={() => {
							setVisibleTab('solve1');
							setAllVisible(false);
						}}
						className={cn('w-full p-2 rounded-md transition-colors hover:bg-slate-700/50', 
							visibleTab === 'solve1' ? 'bg-slate-700 text-slate-50' : 'text-slate-400')}
					>
						{difficulty.gladeSolveOptions[0].name}
					</button>
				)}
				<button
					onClick={() => {
						setVisibleTab('threats');
						setAllVisible(false);
					}}
					className={cn('w-full p-2 rounded-md transition-colors hover:bg-slate-700/50',
						visibleTab === 'threats' ? 'bg-slate-700 text-slate-50' : 'text-slate-400')}
				>
					Threats
				</button>
				{difficulty.gladeSolveOptions.length > 1 && (
					<button
						onClick={() => {
							setVisibleTab('solve2');
							setAllVisible(false);
						}}
						className={cn('w-full p-2 rounded-md transition-colors hover:bg-slate-700/50',
							visibleTab === 'solve2' ? 'bg-slate-700 text-slate-50' : 'text-slate-400')}
					>
						{difficulty.gladeSolveOptions[1].name}
					</button>
				)}
			</div>

			<div className={cn('w-full', allVisible ? 'grid grid-cols-1 lg:grid-cols-3 gap-4' : 'flex')}>
				{(!allVisible && visibleTab === 'solve1') || allVisible ? (
					difficulty.gladeSolveOptions[0] ? 
						<GladeSolveOptionCard {...difficulty.gladeSolveOptions[0]} /> :
						<div className='flex items-center justify-center p-8 text-slate-400 border border-slate-700 rounded-lg bg-slate-800/50'>
							No requirements to solve this event
						</div>
				) : null}

				{(!allVisible && visibleTab === 'threats') || allVisible ? (
					<div className='flex flex-col rounded-lg bg-slate-800/50 border border-slate-700'>
						{event.threats.length > 0 ? (
							event.threats.map((threat, index) => {
								let displayThreat = false;
								if (index === 0 && threat.interval) {
									displayThreat = true;
								}
								if (index > 0 && event.threats[index - 1].interval !== threat.interval) {
									displayThreat = true;
								}

								return (
									<div key={index}>
										{displayThreat && (
											<div className='p-3 text-center font-medium text-slate-400 border-b border-slate-700'>
												Every {formatSecondsToMMSS(threat.interval as number)} not solved:
											</div>
										)}
										<GladeEffectCard effect={threat} />
									</div>
								);
							})
						) : (
							<div className='p-8 text-center text-slate-400'>
								No threats while solving this event
							</div>
						)}
					</div>
				) : null}

				{(!allVisible && visibleTab === 'solve2') || allVisible ? (
					difficulty.gladeSolveOptions[1] ? 
						<GladeSolveOptionCard {...difficulty.gladeSolveOptions[1]} /> :
						<div className='flex items-center justify-center p-8 text-slate-400 border border-slate-700 rounded-lg bg-slate-800/50'>
							No alternative solution available
						</div>
				) : null}
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
