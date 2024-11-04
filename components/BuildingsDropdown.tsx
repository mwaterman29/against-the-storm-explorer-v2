import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import BuildingRow from './BuildingRow';
import { productionBuildings } from '@/data/productionBuildings';

interface BuildingsDropdownProps {
    filter: any[];
    onPick?: any;
}

const BuildingsDropdown = ({ filter, onPick }: BuildingsDropdownProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = useMemo(() => {
        return productionBuildings
            .filter(building => filter.includes(building.id))
            .filter(building => building.id.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [filter, searchTerm]);

    const grouped = useMemo(() => {
        return filtered.reduce((acc, building) => {
            if (!acc[building.category]) {
                acc[building.category] = [];
            }
            acc[building.category].push(building);
            return acc;
        }, {} as Record<string, any[]>);
    }, [filtered]);

    const sortedGrouped = useMemo(() => {
        for (const category in grouped) {
            grouped[category].sort((a, b) => a.id.localeCompare(b.id));
        }
        return grouped;
    }, [grouped]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>Choose Building</Button>
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
                {Object.keys(sortedGrouped).map(category => {
                    return (
                        <Collapsible key={category} defaultOpen>
                            <CollapsibleTrigger className="p-2 text-left w-full font-bold bg-gray-100 hover:bg-gray-200">
                                {category}
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                {sortedGrouped[category].map((building, index) => (
                                    <BuildingRow key={index} building={building} onPick={onPick} />
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default BuildingsDropdown;