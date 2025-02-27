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

const GladeSolveOptionColumn = ({ options, showBorder }: { options?: ItemUsage[]; showBorder?: boolean }) =>
{
	return (
		<div className='flex flex-col w-full items-start gap-1'>
			{options && options.length > 0 && (
				<div className={cn('flex flex-col p-4 pt-1 gap-1 h-full w-full relative', showBorder ? 'border-r ' : '')}>
					<div className='//absolute //top-2 //right-2'>
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
			)}
		</div>
	);
};


export default GladeSolveOptionColumn;