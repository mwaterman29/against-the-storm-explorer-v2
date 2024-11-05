import { useMemo } from 'react';
import { species as allSpecies } from '@/data/species';
import { cn } from '@/lib/utils';
import { Species } from '@/types/Species';

interface SpeciesNeedsProps { species: string | Species, className?: string, includeHousing?: boolean, labelClassName?: string }

const needMap: Record<string, string> = {
    'Leasiure': 'Ale',
    'Religion': 'Incense',
    'Clothes': 'Coats',
    'Bloodthirst': 'Training Gear',
    'Education': 'Scrolls',
    'Treatment': 'Tea',
    'Skewer': 'Skewers',
    'Luxury': 'Wine',
}

const SpeciesNeeds = ({ species, className, labelClassName, includeHousing = false}: SpeciesNeedsProps) =>
{
	const speciesObj = useMemo(() =>
	{
		if (typeof species === 'string')
		{
			return allSpecies.find(s => s.name === species)!;
		}
		else
		{
			return species;
		}
	}, [species]);

    return (
        <div className={cn('', className)}>
            {speciesObj.needs.map((needRaw: string, index: number) => 
            {
                const need = needMap[needRaw] || needRaw;

                if(!includeHousing && need.includes('Housing'))
                {
                    return null;
                }

                return (
                    <div key={index} className='flex flex-row items-center gap-2'>
                        <img className='w-8 h-8' src={`/img/${need}.png`} />
                        <p className={cn('', labelClassName)}>{need}</p>
                    </div>
                )
            })}
        </div>
    )    
};

export default SpeciesNeeds;
