import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BuildingRow from './BuildingRow';
import { productionBuildings } from '@/data/productionBuildings';

interface BuildingsDropdownProps 
{
    filter: any[];
    onPick?: any;
}

const BuildingsDropdown = ({ filter, onPick }: BuildingsDropdownProps) =>
{
    // First, filter:
    const filtered = productionBuildings.filter(building => filter.includes(building.id));

    //Group into categories
    const grouped = filtered.reduce((acc, building) =>
    {
        if (!acc[building.category])
        {
            acc[building.category] = [];
        }
        acc[building.category].push(building);
        return acc;
    }, {} as Record<string, any[]>);

    //Within each category, sort by id
    for (const category in grouped)
    {
        grouped[category].sort((a, b) => a.id.localeCompare(b.id));
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button>Choose Building</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='max-h-[40dvh] overflow-y-auto'>
                {Object.keys(grouped).map(category => {
                    return (
                        <div key={category}>
                            <p>{category}</p>
                            {grouped[category].map((building, index) => {
                                return (
                                    <BuildingRow key={index} building={building} onPick={onPick} />
                                );
                            })}
                        </div>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default BuildingsDropdown;