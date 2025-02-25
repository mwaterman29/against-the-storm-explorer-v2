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
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const categoryDescriptions: Record<string, string> = {
	Forbidden: 'Forbidden Glade events appear only in Forbidden glades.'
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
			<div className='flex flex-col py-4'>
				<p>Glade Events</p>

			</div>
			<div className='flex flex-col gap-8'>
				{Object.entries(gladeEventsByCategory).map(([category, events]) =>
				{
					return (
						<Collapsible defaultOpen>
							<CollapsibleTrigger className='w-full items-start flex flex-col gap-1'>
								<h2 className='text-3xl'>{category}</h2>
								{categoryDescriptions[category] && <p>{categoryDescriptions[category]}</p>}
								<hr className='w-full mb-4' />
							</CollapsibleTrigger>
							<CollapsibleContent className='grid grid-cols-4 gap-6'>
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
