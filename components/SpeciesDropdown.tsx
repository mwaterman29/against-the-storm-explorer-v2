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
					{selectedSpecies ? <img className='w-24 h-24 border-4 border-ats-dark-brown' src={`/img/${selectedSpecies.name}.png`} /> :
                     
                     <div className='h-24 w-24 flex items-center justify-center border-4 border-ats-dark-brown bg-ats-gold'>+</div>}
				</DropdownMenuTrigger>
                <div className='flex flex-row items-center gap-2'>
                    {selectedSpecies ? formatName(selectedSpecies.name) : 'Select Species'}
                </div>
			</div>
			<DropdownMenuContent className='max-h-[40dvh] overflow-y-auto p-0 m-0'>
				<div className='sticky top-0 bg-white z-10 p-2'>
					<input
						type='text'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						placeholder='Search...'
						className='w-full p-2 border rounded'
					/>
				</div>
				{sortedSpecies.map((speciesItem, index) => (
					<SpeciesRow key={index} species={speciesItem} onPick={onPick} />
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SpeciesDropdown;
