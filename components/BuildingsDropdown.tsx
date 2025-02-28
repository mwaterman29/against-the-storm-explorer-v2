import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import BuildingRow from './BuildingRow';
import { productionBuildings } from '@/data/productionBuildings';
import KeyboardArrowDown from '@material-symbols/svg-400/outlined/keyboard_arrow_down.svg';

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
                <Button className="w-full bg-slate-800 border border-slate-700 text-slate-50 hover:bg-slate-700">
                    <span className="text-slate-400">Choose Building</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='max-h-[40dvh] w-[350px] overflow-y-auto p-0 bg-slate-800 border border-slate-700'>
                <div className="sticky top-0 bg-slate-800 z-10 p-2 border-b border-slate-700">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search buildings..."
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                </div>
                {Object.keys(sortedGrouped).map(category => {
                    return (
                        <Collapsible key={category} defaultOpen>
                            <CollapsibleTrigger className="p-2 text-left w-full font-medium bg-slate-800 hover:bg-slate-700 text-slate-50 flex flex-row items-center justify-between group border-b border-slate-700">
                                {category}
                                <div className='text-xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
                                    <KeyboardArrowDown />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="bg-slate-900/50">
                                {sortedGrouped[category].map((building, index) => (
                                    <div key={index} className="hover:bg-slate-800 transition-colors">
                                        <BuildingRow key={index} building={building} onPick={onPick} />
                                    </div>
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