'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { biomes } from '@/data/biomes'; //import * as biomes from '@/data/biomes';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ItemIcon from '@/components/ItemIcon';
import { items } from '@/data/items';
import TierSpan from '@/components/TierSpan';
import { productionBuildings as buildings } from '@/data/productionBuildings';
import BuildingsDropdown from '@/components/BuildingsDropdown';
import BuildingRow from '@/components/BuildingRow';
import { findProductionChainsWithTiers } from '@/utils/findProductionChainsWithTiers';
import { calculateDifferences } from '@/utils/calculateDifferences';
import SpeciesDropdown from '@/components/SpeciesDropdown';
import { species } from '@/data/species';

const defaultList = ['Crude Workstation', 'Makeshift Post', 'Field Kitchen'];

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
	const [thisPick, setThisPick] = useState<any[]>([]);

	const difficulty = useSelector((state: RootState) => state.settings.difficulty);
	const picksPerDraft = useMemo(() =>
	{
		return difficulty < 15 ? 4 : 2;
	}, [difficulty]);

	const availableBlueprints = useMemo(() =>
	{
		return buildings.filter(building => !blueprintsOwned.includes(building.id)).map(building => building.id);
	}, [blueprintsOwned]);

	const [biome, setBiome] = useState('Royal Woodlands');
	const tutorial = useSelector((state: RootState) => state.settings.showTutorial);
	const interal = useSelector((state: RootState) => state.settings.showInternal);

	const [selectedSpecies, setSelectedSpecies] = useState(
		difficulty > 10 ? 
		['Frog, Foxes', 'Harpy'] :
		['Human', 'Beaver', 'Lizard']
	);
	const availableSpecies = useMemo(() =>
	{
		const allSpecies = species.map(s => s.name);
		return allSpecies.filter(s => !selectedSpecies.includes(s));
	}, [selectedSpecies]);

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

	const baseResources = useMemo(() => {
		return new Set(biomeData?.treeItems.concat(biomeData?.depositItems));
	}, [biomeData]);

	const { completedChains, completedChainsWithTiers } = useMemo(() =>
	{
		return findProductionChainsWithTiers(baseResources, blueprintsOwned);
	}, [blueprintsOwned, biomeData]);

	const draftBlueprintData = useMemo(() => {
		const data = thisPick.map(selectedBuilding => {
			if (!selectedBuilding) {
			  return { newResources: [], improvedTiers: {} };
			}
			return calculateDifferences(baseResources, blueprintsOwned, selectedBuilding);
		  });

		return data;
		
	}, [biomeData, blueprintsOwned, thisPick]);
	
	return (
		<div className='flex flex-col items-center gap-2 px-8'>
			<p>Blueprint Helper</p>

			<div className='flex flex-row w-full'>
				<div className='basis-1/3 '>
					<p>Select your species:</p>
					<div className='grid grid-cols-3'>
						{selectedSpecies.map((species, index) => {
							return (
								<SpeciesDropdown
									key={index}
									selected={species}
									onPick={(species: string) => setSelectedSpecies([...selectedSpecies, species])}
									filter={availableSpecies}
									/>
							)
						})}
					</div>
				</div>
				<div className='basis-2/3'>
					<p>Select your biome:</p>
					<BiomesDropdown biomes={filteredBiomes} onPick={(biome: any) => setBiome(biome.name)} />
					<div className='flex flex-row items-center gap-2'>
						<p>Trees</p>
						{biomeData?.treeItems.map((treeItem, index) =>
						{
							return <ItemIcon item={treeItem} size='s' key={index} />;
						})}
					</div>
					<div className='flex flex-row items-center gap-2'>
						<p>Deposits</p>
						{biomeData?.depositItems.map((treeItem, index) =>
						{
							return <ItemIcon item={treeItem} size='s' key={index} />;
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
						<BuildingsDropdown filter={availableBlueprints} onPick={(building: any) => setBlueprintsOwned([...blueprintsOwned, building.id])} />
					</div>
				</div>

				<div className='grid grid-cols-4 w-full gap-4'>
					{Array.from({ length: picksPerDraft }).map((_, index) =>
					{
						const colsClass = picksPerDraft === 2 ? 'col-span-2' : '';

						const selectedBuilding = thisPick[index];
						const differences = draftBlueprintData[index];

						return (
							<div key={index} className={`flex flex-col p-2 border rounded-md gap-2 ${colsClass}`}>
								<p>Pick {index + 1}</p>
								{selectedBuilding && (
									<BuildingRow building={selectedBuilding} onPick={() => setThisPick([...thisPick.slice(0, index), undefined])} />
								)}
								<BuildingsDropdown
									filter={availableBlueprints}
									onPick={(building: any) => setThisPick([...thisPick.slice(0, index), building])}
								/>
								{selectedBuilding && (
									<div>
										<p>New Resources: {differences.newResources.join(', ')}</p>
										<p>
											Improved Tiers:{' '}
											{Object.entries(differences.improvedTiers)
												.map(([resource, tier]) => `${resource}: Tier ${tier}`)
												.join(', ')}
										</p>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
			<div className='flex flex-col'>
				<p>Completed Chains</p>
				<div className='flex flex-wrap'>
					{completedChains.map((chain, index) =>
					{
						return (
							<div className='flex flex-row items-center gap-2' key={index}>
								<ItemIcon item={chain} size='s' key={index} />
								<p className='text-nowrap'>{chain}</p>
								<TierSpan tier={completedChainsWithTiers[chain]} />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default BlueprintDraftPage;
