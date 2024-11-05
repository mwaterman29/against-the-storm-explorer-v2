import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { species } from '@/data/species';
import SpeciesRow from './SpeciesRow';

interface SpeciesDropdownProps {
    selected: string;
    onPick: (species: string) => void;
    filter: string[];
}

const SpeciesDropdown = ({ selected, onPick, filter }: SpeciesDropdownProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSpecies = useMemo(() => {
        return species
            .filter(speciesItem => filter.includes(speciesItem.name))
            .filter(speciesItem => speciesItem.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [filter, searchTerm]);

    const sortedSpecies = useMemo(() => {
        return filteredSpecies.sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredSpecies]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>Choose Species</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='max-h-[40dvh] overflow-y-auto p-0 m-0'>
                <div className="sticky top-0 bg-white z-10 p-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full p-2 border rounded"
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