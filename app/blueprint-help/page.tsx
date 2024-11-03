'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import * as buildings from '@/data/productionBuildings.json';
import { biomes } from '@/data/biomes'; //import * as biomes from '@/data/biomes';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ItemIcon from '@/components/ItemIcon';

const defaultList = ['Crude Workstation', 'Makeshift Post', 'Field Kitchen'];

const BuildingRow = ({ building, onPick }: { building: any; onPick?: any }) =>
{
	return (
		<div className='flex flex-row items-center gap-2 w-full'>
			<img className='w-12 h-12' src={`/img/${building.id}.png`} />
			<p className='w-full'>{building.id}</p>
			{onPick && (
				<Button className='justify-self-end' onClick={() => onPick(building)}>
					Select
				</Button>
			)}
		</div>
	);
};

const BuildingsDropdown = ({ buildings, onPick }: { buildings: any[]; onPick?: any }) =>
{
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button>Choose Building</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='max-h-[40dvh] overflow-y-auto'>
				{buildings.map(building =>
				{
					return <BuildingRow key={building.id} building={building} onPick={onPick} />;
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const BiomesDropdown = ({ biomes, onPick }: { biomes: any[]; onPick: any }) =>
{
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button>Choose Biome</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='max-h-[40dvh] overflow-y-auto'>
				{biomes.map(biome =>
				{
					return <div>{biome.name}</div>;
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const BlueprintDraftPage = () =>
{
	const [blueprintsOwned, setBlueprintsOwned] = useState(defaultList);
	const [thisPick, setThisPick] = useState([]);

	const difficulty = useSelector((state: RootState) => state.settings.difficulty);
	const picksPerDraft = useMemo(() =>
	{
		return difficulty < 15 ? 4 : 2;
	}, [difficulty]);

	const availableBlueprints = useMemo(() =>
	{
		return buildings.filter(building => !blueprintsOwned.includes(building.id));
	}, [blueprintsOwned]);

	const [biome, setBiome] = useState('Royal Woodlands');
	const tutorial = useSelector((state: RootState) => state.settings.showTutorial);
	const interal = useSelector((state: RootState) => state.settings.showInternal);

	const filteredBiomes = useMemo(() =>
	{
		let filtered = [...biomes];
		if (!tutorial)
		{
			filtered = filtered.filter(b => !b.name.includes('Tutorial'));
		}
		if (!interal)
		{
			filtered = filtered.filter(b => !b.name.includes('Citadel'));
		}

		return filtered.filter(b => b.name !== biome);
	}, [biome, tutorial, interal]);

	const biomeData = useMemo(() =>
	{
		return biomes.find(b => b.name === biome);
	}, [biome]);

	return (
		<div className='flex flex-col items-center gap-2 px-8'>
			<p>Blueprint Helper</p>

			<div className='flex flex-row w-full'>
				<div className='basis-1/3 '>
					<p>Select your species:</p>
				</div>
				<div className='basis-2/3'>
					<p>Select your biome:</p>
					<BiomesDropdown biomes={filteredBiomes} onPick={(biome: any) => setBiome(biome.name)} />
					<div className='flex flex-row items-center gap-2'>
						<p>Trees</p>
						{biomeData?.treeItems.map((treeItem, index) => {
							return (
								<ItemIcon item={treeItem} size='s' key={index}/>
							)
						})}
					</div>
					<div className='flex flex-row items-center gap-2'>
						<p>Deposits</p>
						{biomeData?.depositItems.map((treeItem, index) => {
							return (
								<ItemIcon item={treeItem} size='s' key={index}/>
							)
						})}
					</div>
				</div>
			</div>

			<div className='flex flex-row w-full gap-4'>
				<div className='flex flex-col p-2 border rounded-md gap-2 basis-1/4'>
					<p>Blueprints Owned</p>
					{blueprintsOwned.map(blueprint =>
					{
						const building = buildings.find(building => building.id === blueprint);

						if (!building) return <></>;

						return (
							<div key={building.id} className='flex flex-row items-center gap-2 justify-between'>
								<BuildingRow building={building} />
								<Button variant={'destructive'} onClick={() => setBlueprintsOwned(blueprintsOwned.filter(b => b !== blueprint))}>
									Remove
								</Button>
							</div>
						);
					})}
					<div className='flex flex-row items-center gap-2'>
						<BuildingsDropdown buildings={availableBlueprints} onPick={(building: any) => setBlueprintsOwned([...blueprintsOwned, building.id])} />
					</div>
				</div>
				<div className='grid grid-cols-4 w-full gap-4'>
					{Array.from({ length: picksPerDraft }).map((_, index) =>
					{
						const colsClass = picksPerDraft === 2 ? 'col-span-2' : '';

						return (
							<div key={index} className={cn('flex flex-col p-2 border rounded-md gap-2', colsClass)}>
								<p>Pick {index + 1}</p>
								{thisPick[index] && (
									<BuildingRow building={thisPick[index]} onPick={() => setThisPick([...thisPick.slice(0, index), undefined])} />
								)}
								<BuildingsDropdown
									buildings={availableBlueprints}
									onPick={(building: any) => setThisPick([...thisPick.slice(0, index), building])}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default BlueprintDraftPage;
