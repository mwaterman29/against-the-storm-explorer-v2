'use client';

import { biomes } from '@/data/biomes';
import { items } from '@/data/items';
import { productionBuildings as buildings } from '@/data/productionBuildings';
import { species } from '@/data/species';
//import * as biomes from '@/data/biomes';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';

import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import BuildingRow from '@/components/BuildingRow';
import BuildingsDropdown from '@/components/BuildingsDropdown';
import ItemIcon from '@/components/ItemIcon';
import SpeciesDropdown from '@/components/SpeciesDropdown';
import SpeciesNeeds from '@/components/SpeciesNeeds';
import TierSpan from '@/components/TierSpan';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

import { calculateDifferences } from '@/utils/calculateDifferences';
import { findProductionChainsWithTiers } from '@/utils/findProductionChainsWithTiers';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import KeyboardArrowDown from '@material-symbols/svg-400/outlined/keyboard_arrow_down.svg';

const defaultList = ['Crude Workstation', 'Makeshift Post', 'Field Kitchen'];

const BiomesDropdown = ({ biomes, onPick }: { biomes: any[]; onPick: any }) =>
{
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="w-full bg-slate-800 border border-slate-700 text-slate-50 hover:bg-slate-700">
					<span className="text-slate-400">Choose Biome</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='max-h-[40dvh] overflow-y-auto w-full min-w-[200px] bg-slate-800 border border-slate-700 p-0'>
				{biomes.map(biome => (
					<Button 
						key={biome.name}
						className="w-full justify-start font-normal text-slate-50 hover:bg-slate-700 rounded-none border-b border-slate-700 last:border-0"
						onClick={() => onPick(biome)}
					>
						{biome.name}
					</Button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const BlueprintDraftPage = () =>
{
	const [blueprintsOwned, setBlueprintsOwned] = useState(defaultList);
	const [thisPick, setThisPick] = useState<any[]>([]);
	const [waterTypes, setWaterTypes] = useState<string[]>([]);

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
	const internal = useSelector((state: RootState) => state.settings.showInternal);

	const [selectedSpecies, setSelectedSpecies] = useState(difficulty > 10 ? ['Frog, Foxes', 'Harpy'] : ['Human', 'Beaver', 'Lizard']);
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
		if (!internal)
		{
			filtered = filtered.filter(b => !b.name.includes('Citadel'));
		}

		return filtered.filter(b => b.name !== biome);
	}, [biome, tutorial, internal]);

	const biomeData = useMemo(() =>
	{
		return biomes.find(b => b.name === biome);
	}, [biome]);

	const baseResources = useMemo(() =>
	{
		return new Set(biomeData?.treeItems.concat(biomeData?.depositItems));
	}, [biomeData]);

	const { completedChains, completedChainsWithTiers } = useMemo(() =>
	{
		return findProductionChainsWithTiers(baseResources, blueprintsOwned);
	}, [blueprintsOwned, biomeData]);

	const draftBlueprintData = useMemo(() =>
	{
		const data = thisPick.map(selectedBuilding =>
		{
			if (!selectedBuilding)
			{
				return { newResources: [], improvedTiers: {} };
			}
			return calculateDifferences(baseResources, blueprintsOwned, selectedBuilding);
		});

		return data;
	}, [biomeData, blueprintsOwned, thisPick]);

	const handleWaterTypeToggle = (type: string) => {
		setWaterTypes(prev => 
			prev.includes(type) 
				? prev.filter(t => t !== type)
				: [...prev, type]
		);
	};

	return (
		<div className='flex flex-col overflow-y-auto max-h-full bg-slate-900 text-white'>
			<div className='flex flex-row items-center justify-between px-4 sm:px-8 py-4 bg-slate-800 border-b border-slate-700'>
				<h1 className='text-2xl font-semibold text-slate-50'>Blueprint Helper</h1>
			</div>

			<div className='flex flex-col gap-8 p-4 sm:p-8 pb-24'>
				{/* Settlement Configuration */}
				<Collapsible defaultOpen>
					<CollapsibleTrigger className='w-full items-start flex flex-col gap-2 group hover:opacity-80 transition-opacity'>
						<div className='flex flex-row items-center gap-3'>
							<h2 className='text-2xl font-semibold text-slate-50'>Settlement Configuration</h2>
							<div className='text-2xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
								<KeyboardArrowDown />
							</div>
						</div>
						<hr className='w-full border-slate-700' />
					</CollapsibleTrigger>
					<CollapsibleContent className='mt-4'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
							{/* Species Selection */}
							<div className='flex flex-col gap-4'>
								<h3 className='text-xl font-semibold text-slate-50'>Species</h3>
								<div className='grid grid-cols-3 gap-4'>
									{selectedSpecies.map((speciesName, index) => (
										<div key={index} className='flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700'>
											<SpeciesDropdown
												selected={speciesName}
												onPick={(species: string) => {
													const newSpecies = [...selectedSpecies];
													newSpecies[index] = species;
													setSelectedSpecies(newSpecies);
												}}
												filter={availableSpecies}
											/>
											<SpeciesNeeds species={speciesName} labelClassName='hidden' className='grid grid-cols-3 gap-1' />
										</div>
									))}
								</div>
							</div>

							{/* Biome Selection */}
							<div className='flex flex-col gap-4'>
								<h3 className='text-xl font-semibold text-slate-50'>Biome</h3>
								<div className='p-4 bg-slate-800/50 rounded-lg border border-slate-700'>
									<BiomesDropdown biomes={filteredBiomes} onPick={(biome: any) => setBiome(biome.name)} />
									{biomeData && (
										<div className='mt-4 flex flex-col gap-4'>
											<div className='flex flex-row items-center gap-2'>
												<h4 className='text-sm font-medium text-slate-400'>Trees:</h4>
												<div className='flex flex-row gap-2'>
													{biomeData.treeItems.map((item, index) => (
														<ItemIcon key={index} item={item} size='s' />
													))}
												</div>
											</div>
											<div className='flex flex-row items-center gap-2'>
												<h4 className='text-sm font-medium text-slate-400'>Deposits:</h4>
												<div className='flex flex-row gap-2'>
													{biomeData.depositItems.map((item, index) => (
														<ItemIcon key={index} item={item} size='s' />
													))}
												</div>
											</div>
										</div>
									)}
								</div>

								{/* Geyser Selection */}
								<div className='flex flex-col gap-4'>
									<h3 className='text-xl font-semibold text-slate-50'>Rainpunk / Geysers</h3>
									<div className='grid grid-cols-3 gap-4'>
										{[
											{ type: 'storm', label: 'Storm Geyser' },
											{ type: 'clearance', label: 'Clearance Geyser' },
											{ type: 'drizzle', label: 'Drizzle Geyser' }
										].map(geyser => (
											<div key={geyser.type} className='flex flex-col items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700'>
												<h4 className='font-medium text-slate-50'>{geyser.label}</h4>
												<div className='w-24 h-24 rounded-lg border-2 border-slate-700 flex items-center justify-center bg-slate-800'>
													<img 
														className='w-20 h-20' 
														src={`/img/${geyser.type}_geyser.png`} 
														alt={geyser.label}
													/>
												</div>
												<div className='flex items-center gap-2'>
													<Checkbox 
														id={`geyser-${geyser.type}`}
														checked={waterTypes.includes(geyser.type)}
														onCheckedChange={() => handleWaterTypeToggle(geyser.type)}
													/>
													<label 
														htmlFor={`geyser-${geyser.type}`}
														className='text-sm text-slate-300'
													>
														Available
													</label>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>

				{/* Blueprints Section */}
				<div className='flex flex-row gap-8'>
					{/* Owned Blueprints */}
					<div className='flex flex-col gap-4 basis-1/4'>
						<h3 className='text-xl font-semibold text-slate-50'>Blueprints Owned</h3>
						<div className='p-4 bg-slate-800/50 rounded-lg border border-slate-700'>
							<div className='flex flex-col gap-4'>
								{blueprintsOwned.map(blueprint =>
								{
									const building = buildings.find(building => building.id === blueprint);
									if (!building) return null;
									return (
										<div key={building.id} className='flex flex-row items-center gap-2 justify-between group hover:bg-slate-800 p-2 rounded-md transition-colors'>
											<BuildingRow building={building} />
											<Button 
												variant='destructive' 
												size='sm'
												onClick={() => setBlueprintsOwned(blueprintsOwned.filter(b => b !== blueprint))}
											>
												Remove
											</Button>
										</div>
									);
								})}
								<BuildingsDropdown 
									filter={availableBlueprints} 
									onPick={(building: any) => setBlueprintsOwned([...blueprintsOwned, building.id])} 
								/>
							</div>
						</div>
					</div>

					{/* Draft Picks */}
					<div className='flex-1'>
						<h3 className='text-xl font-semibold text-slate-50 mb-4'>Draft Options</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{Array.from({ length: picksPerDraft }).map((_, index) =>
							{
								const selectedBuilding = thisPick[index];
								const differences = draftBlueprintData[index];

								return (
									<div key={index} className='flex flex-col gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700'>
										<h4 className='font-medium text-slate-50'>Pick {index + 1}</h4>
										{selectedBuilding && (
											<div className='flex flex-col gap-4'>
												<BuildingRow 
													building={selectedBuilding} 
													onPick={() => setThisPick([...thisPick.slice(0, index), undefined])} 
												/>
												<div className='flex flex-col gap-2 text-sm text-slate-300'>
													{differences.newResources.length > 0 && (
														<p>New Resources: {differences.newResources.join(', ')}</p>
													)}
													{Object.keys(differences.improvedTiers).length > 0 && (
														<p>
															Improved Tiers:{' '}
															{Object.entries(differences.improvedTiers)
																.map(([resource, tier]) => `${resource}: Tier ${tier}`)
																.join(', ')}
														</p>
													)}
												</div>
											</div>
										)}
										<BuildingsDropdown
											filter={availableBlueprints}
											onPick={(building: any) => setThisPick([...thisPick.slice(0, index), building])}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Production Chains */}
				<Collapsible defaultOpen>
					<CollapsibleTrigger className='w-full items-start flex flex-col gap-2 group hover:opacity-80 transition-opacity'>
						<div className='flex flex-row items-center gap-3'>
							<h2 className='text-2xl font-semibold text-slate-50'>Completed Production Chains</h2>
							<div className='text-2xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
								<KeyboardArrowDown />
							</div>
						</div>
						<hr className='w-full border-slate-700' />
					</CollapsibleTrigger>
					<CollapsibleContent className='mt-4'>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
							{completedChains.map((chain, index) => (
								<div key={index} className='flex flex-row items-center gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700'>
									<ItemIcon item={chain} size='s' />
									<div className='flex flex-col'>
										<p className='text-sm text-slate-50'>{chain}</p>
										<TierSpan tier={completedChainsWithTiers[chain]} />
									</div>
								</div>
							))}
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>

			<div className='min-h-24 w-full'>
			</div>
		</div>
	);
};

export default BlueprintDraftPage;
