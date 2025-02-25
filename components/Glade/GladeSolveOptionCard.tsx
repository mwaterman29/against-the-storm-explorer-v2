import { GladeSolveOption } from "@/types/GladeEvent";
import GladeSolveOptionColumn from "./GladeSolveOptionColumn";
import GladeEffectCard from "./GladeEffectCard";
import { cn } from "@/lib/utils";

const GladeSolveOptionCard = (solveOption: GladeSolveOption) =>
{
	return (
		<div className='flex flex-row rounded-md'>
			<div className='flex flex-col w-full'>
				{solveOption.name && (
					<div className='flex flex-row items-center justify-center gap-2 w-full border-b py-2 mb-2 h-10'>
						<p>{solveOption.name}</p>
						{solveOption.decisionTag && <p className='text-sm'>({solveOption.decisionTag})</p>}
					</div>
				)}
				<div className={cn('grid w-full', solveOption.options2?.length > 0 ? ' grid-cols-2' : ' grid-cols-1')}>
					<GladeSolveOptionColumn options={solveOption.options1} showBorder={solveOption.options2?.length > 0} />
					{solveOption.options2?.length > 0 && <GladeSolveOptionColumn options={solveOption.options2} />}
				</div>

				{solveOption.workingEffects?.length > 0 && (
					<div>
						<p className='p-2 w-full text-center font-semibold h-[39px]'>While Solving</p>
						<div className='flex flex-col gap-2'>
							{solveOption.workingEffects?.map((effect, index) => <GladeEffectCard key={`we_${index}`} effect={effect} />)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default GladeSolveOptionCard;
