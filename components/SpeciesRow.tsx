import { Species } from '@/types/Species';
import { formatName } from '@/utils/text/formatName';

interface SpeciesRowProps {
	species: Species;
	onPick: (species: string) => void;
}

const SpeciesRow = ({ species, onPick }: SpeciesRowProps) => {
	return (
		<button
			className='w-full p-2 flex flex-row items-center gap-4 text-left'
			onClick={() => onPick(species.name)}
		>
			<img
				className='w-12 h-12 rounded-lg border border-slate-700'
				src={`/img/${species.name}.png`}
			/>
			<div className='flex flex-col'>
				<div className='text-slate-50'>{formatName(species.name)}</div>
				<div className='text-sm text-slate-400'>{species.description}</div>
			</div>
		</button>
	);
};

export default SpeciesRow;