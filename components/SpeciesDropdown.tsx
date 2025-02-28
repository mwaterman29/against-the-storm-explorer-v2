import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { species } from '@/data/species';
import SpeciesRow from './SpeciesRow';
import { formatName } from '@/utils/text/formatName';

interface SpeciesDropdownProps
{
	selected: string;
	onPick: (species: string) => void;
	filter: string[];
}

const SpeciesDropdown = ({ selected, onPick, filter }: SpeciesDropdownProps) =>
{
	const [searchTerm, setSearchTerm] = useState('');

	const filteredSpecies = useMemo(() =>
	{
		return species
			.filter(speciesItem => filter.includes(speciesItem.name))
			.filter(speciesItem => speciesItem.name.toLowerCase().includes(searchTerm.toLowerCase()));
	}, [filter, searchTerm]);

	const sortedSpecies = useMemo(() =>
	{
		return filteredSpecies.sort((a, b) => a.name.localeCompare(b.name));
	}, [filteredSpecies]);

	const selectedSpecies = useMemo(() =>
	{
		return species.find(speciesItem => speciesItem.name === selected);
	}, [selected]);

	return (
		<DropdownMenu>
			<div className='flex flex-col items-center gap-1'>
				<DropdownMenuTrigger>
					{selectedSpecies ? 
						<img 
							className='w-24 h-24 rounded-lg border-2 border-slate-700 hover:border-slate-600 transition-colors' 
							src={`/img/${selectedSpecies.name}.png`} 
						/> :
						<div className='h-24 w-24 flex items-center justify-center rounded-lg border-2 border-slate-700 hover:border-slate-600 transition-colors bg-slate-800 text-slate-400'>
							+
						</div>
					}
				</DropdownMenuTrigger>
				<div className='flex flex-row items-center gap-2 text-sm text-slate-300'>
					{selectedSpecies ? formatName(selectedSpecies.name) : 'Select Species'}
				</div>
			</div>
			<DropdownMenuContent className='max-h-[40dvh] w-[350px] overflow-y-auto p-0 bg-slate-800 border border-slate-700'>
				<div className='sticky top-0 bg-slate-800 z-10 p-2 border-b border-slate-700'>
					<input
						type='text'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						placeholder='Search species...'
						className='w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600'
					/>
				</div>
				<div className='p-2 flex flex-col gap-2'>
					{sortedSpecies.map((speciesItem, index) => (
						<div key={index} className='hover:bg-slate-700 rounded-lg transition-colors'>
							<SpeciesRow species={speciesItem} onPick={onPick} />
						</div>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SpeciesDropdown;
