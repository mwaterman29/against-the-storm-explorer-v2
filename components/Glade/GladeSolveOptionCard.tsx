import { GladeSolveOption } from "@/types/GladeEvent";
import GladeSolveOptionColumn from "./GladeSolveOptionColumn";
import GladeEffectCard from "./GladeEffectCard";
import { cn } from "@/lib/utils";

const GladeSolveOptionCard = (solveOption: GladeSolveOption) =>
{
	return (
		<div className='flex flex-row rounded-lg bg-slate-800/50 border border-slate-700'>
			<div className='flex flex-col w-full'>
				{solveOption.name && (
					<div className='flex flex-row items-center justify-center gap-2 w-full border-b border-slate-700 py-3 mb-3'>
						<p className='font-medium text-slate-50'>{solveOption.name}</p>
						{solveOption.decisionTag && <p className='text-sm text-slate-400'>({solveOption.decisionTag})</p>}
					</div>
				)}
				<div className={cn('grid w-full gap-4 p-4', solveOption.options2?.length > 0 ? ' grid-cols-2' : ' grid-cols-1')}>
					<GladeSolveOptionColumn options={solveOption.options1} showBorder={solveOption.options2?.length > 0} />
					{solveOption.options2?.length > 0 && <GladeSolveOptionColumn options={solveOption.options2} />}
				</div>

				{solveOption.workingEffects?.length > 0 && (
					<div className='border-t border-slate-700'>
						<p className='p-3 w-full text-center font-medium text-slate-400'>While Solving</p>
						<div className='flex flex-col'>
							{solveOption.workingEffects?.map((effect, index) => <GladeEffectCard key={`we_${index}`} effect={effect} />)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default GladeSolveOptionCard;
