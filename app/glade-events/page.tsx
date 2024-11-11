'use client';

import { gladeEvents } from '@/data/gladeEvents';
import { RootState } from '@/redux/store';
import { GladeEvent, GladeSolveOption } from '@/types/GladeEvent';
import { getImgSrc } from '@/utils/img/getImgSrc';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const GladeSolveOptionCard = (solveOption: GladeSolveOption) => {
    return (
        <div className='flex flex-row p-4 border rounded-md'>
            <div className='flex flex-col'>
                <p>{solveOption.name}</p>
                <p>{solveOption.decisionTag}</p>
                <div className='grid grid-cols-2'>
                    <div>
                        <p>Option 1</p>
                        {solveOption.options1?.map((item, index) => (
                            <div key={index}>
                                <p>{item.id}</p>
                                <p>{item.count}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p>Option 2</p>
                        {solveOption.options2?.map((item, index) => (
                            <div key={index}>
                                <p>{item.id}</p>
                                <p>{item.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const GladeEventCard = (event: GladeEvent) =>
{
    const selectedDifficulty = useSelector((state: RootState) => state.settings.difficulty);
    const difficultyIndex = Math.min(event.difficulties.length - 1, selectedDifficulty);

    const difficulty = event.difficulties[difficultyIndex];

	return (
		<div className='flex flex-row p-4 border rounded-md'>
			<img
            className='w-48 h-48'
            src={`/img/${getImgSrc(event.id)}.png`}
            />
            <div className='grid grid-cols-3'>
                <GladeSolveOptionCard {...difficulty.gladeSolveOptions[0]} />
                <div className='flex flex-col'>

                </div>
                <GladeSolveOptionCard {...difficulty.gladeSolveOptions[1]} />
            </div>
		</div>
	);
};

const GladeEventsPage = () =>
{
    const gladeEventsByCategory = useMemo(() => {
        return gladeEvents.reduce((acc, event) => {
            const difficulty = event.difficulty || 'Unknown';
            if (!acc[difficulty]) {
              acc[difficulty] = [];
            }
            acc[difficulty].push(event);
            return acc;
          }, {} as Record<string, GladeEvent[]>);
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
