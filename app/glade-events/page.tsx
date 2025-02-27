'use client';

import GladeEventCard from '@/components/Glade/GladeEventCard';
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
import KeyboardArrowUp from '@material-symbols/svg-400/outlined/keyboard_arrow_up.svg';
import KeyboardArrowDown from '@material-symbols/svg-400/outlined/keyboard_arrow_down.svg';

const categoryDescriptions: Record<string, string> = {
	Forbidden: 'Forbidden Glade events appear only in Forbidden glades.'
};

const categoryOrder = ['Dangerous', 'Forbidden', 'Other'];

const GladeEventsPage = () =>
{
	const [searchTerm, setSearchTerm] = useState('');

	const gladeEventsByCategory = useMemo(() =>
	{
		const categorizedEvents = gladeEvents.reduce(
			(acc, event) =>
			{
				if (searchTerm && !event.label.toLowerCase().includes(searchTerm.toLowerCase())) {
					return acc;
				}

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

		// Sort categories based on predefined order
		return Object.entries(categorizedEvents).sort(([a], [b]) => {
			const aIndex = categoryOrder.indexOf(a);
			const bIndex = categoryOrder.indexOf(b);
			
			// If both categories are not in the predefined order, sort alphabetically
			if (aIndex === -1 && bIndex === -1) {
				return a.localeCompare(b);
			}
			
			// If one category is not in the order, put it after the ordered ones
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			
			// Sort by predefined order
			return aIndex - bIndex;
		}).reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {} as Record<string, GladeEvent[]>);
	}, [gladeEvents, searchTerm]);

	return (
		<div className='flex flex-col overflow-y-auto max-h-full bg-slate-900 text-white'>
			<div className='flex flex-row items-center justify-between px-4 sm:px-8 py-4 bg-slate-800 border-b border-slate-700'>
				<h1 className='text-2xl font-semibold text-slate-50'>Glade Events</h1>
				<div className='relative max-w-md w-full ml-8'>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search events by name..."
						className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
					/>
					<div className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>
						{searchTerm ? `${Object.values(gladeEventsByCategory).reduce((acc, events) => acc + events.length, 0)} results` : ''}
					</div>
				</div>
			</div>
			<div className='flex flex-col gap-12 p-4 sm:p-8'>
				{Object.entries(gladeEventsByCategory).map(([category, events]) =>
				{
					if (events.length === 0) return null;

					return (
						<Collapsible key={category} defaultOpen>
							<CollapsibleTrigger className='w-full items-start flex flex-col gap-2 group hover:opacity-80 transition-opacity'>
								<div className='flex flex-row items-center gap-3'>
									<h2 className='text-3xl font-semibold'>{category}</h2>
									<div className='text-2xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
										<KeyboardArrowDown />
									</div>
								</div>
								{categoryDescriptions[category] && (
									<p className='text-slate-400 text-sm'>{categoryDescriptions[category]}</p>
								)}
								<hr className='w-full border-slate-700' />
							</CollapsibleTrigger>
							<CollapsibleContent className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6'>
								{events.map((event, index) => (
									<GladeEventCard key={index} {...event} />
								))}
							</CollapsibleContent>
						</Collapsible>
					);
				})}
			</div>
		</div>
	);
};

export default GladeEventsPage;
