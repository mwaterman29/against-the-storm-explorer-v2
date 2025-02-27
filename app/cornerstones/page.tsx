'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { effects } from '@/data/effects';
import { cn } from '@/lib/utils';
import { Cornerstone } from '@/types/Cornerstone';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import CornerstoneComponent from '@/components/Cornerstone';
import { useMemo, useState } from 'react';
import KeyboardArrowDown from '@material-symbols/svg-400/outlined/keyboard_arrow_down.svg';

const categoryDescriptions: Record<string, { title: string; description: string }> = {
	stormforged: {
		title: 'Stormforged Cornerstones',
		description: 'Stormforged Cornerstones are only available from the Forsaken Altar, during the storm.'
	},
	legendary: {
		title: 'Legendary Cornerstones',
		description: 'Legendary Cornerstones are offered at the start of even years, until after year 6.'
	},
	epic: {
		title: 'Epic Cornerstones',
		description: 'Epic Cornerstones are offered at the start of even years.'
	},
	perks: {
		title: 'Perks',
		description: '<perks explainer text eventually>'
	},
	effects: {
		title: 'Effects',
		description: '<effects explainer text eventually>'
	}
};

const CornerstonesPage = () => {
	const [searchTerm, setSearchTerm] = useState('');

	//Account for settings
	const showTutorial = useSelector((state: RootState) => state.settings.showTutorial);
	const showInternal = useSelector((state: RootState) => state.settings.showInternal);

	const itemsByCategory = useMemo(() => {
		let filteredEffects = effects;

		if (!showTutorial) {
			filteredEffects = filteredEffects.filter(effect => !effect.tags.includes('tutorial'));
		}

		if (!showInternal) {
			filteredEffects = filteredEffects.filter(effect => !effect.tags.includes('hidden'));
		}

		// Filter by search term if present
		if (searchTerm) {
			filteredEffects = filteredEffects.filter(effect => 
				effect.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
				effect.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Separate effects by type
		const cornerstones = filteredEffects.filter(effect => effect.type === 'Cornerstone');
		const perks = filteredEffects.filter(effect => effect.type === 'Perk');
		const generalEffects = filteredEffects.filter(effect => effect.type === 'Effect');

		return {
			cornerstones: {
				stormforged: cornerstones.filter(c => c.tier === 'Mythic'),
				legendary: cornerstones.filter(c => c.tier === 'Legendary'),
				epic: cornerstones.filter(c => c.tier === 'Epic')
			},
			perks,
			effects: generalEffects
		};
	}, [effects, showTutorial, showInternal, searchTerm]);

	const totalResults = Object.values(itemsByCategory.cornerstones).reduce((acc, cornerstones) => acc + cornerstones.length, 0) 
		+ itemsByCategory.perks.length 
		+ itemsByCategory.effects.length;

	const hasCornerstones = Object.values(itemsByCategory.cornerstones).some(category => category.length > 0);

	return (
		<div className='flex flex-col overflow-y-auto max-h-full bg-slate-900 text-white'>
			<div className='flex flex-row items-center justify-between px-4 sm:px-8 py-4 bg-slate-800 border-b border-slate-700'>
				<h1 className='text-2xl font-semibold text-slate-50'>Cornerstones, Perks, and Effects</h1>
				<div className='relative max-w-md w-full ml-8'>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search all items..."
						className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
					/>
					<div className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>
						{searchTerm ? `${totalResults} results` : ''}
					</div>
				</div>
			</div>

			<div className='flex flex-col gap-8 p-4 sm:p-8'>
				{/* Cornerstones Section */}
				{hasCornerstones && (
					<Collapsible defaultOpen>
						<CollapsibleTrigger className='w-full items-start flex flex-col gap-2 group hover:opacity-80 transition-opacity'>
							<div className='flex flex-row items-center gap-3'>
								<h2 className='text-2xl font-semibold text-slate-50'>Cornerstones</h2>
								<div className='text-2xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
									<KeyboardArrowDown />
								</div>
							</div>
							<hr className='w-full border-slate-700' />
						</CollapsibleTrigger>
						<CollapsibleContent className='flex flex-col gap-8 mt-4'>
							{/* Stormforged */}
							{itemsByCategory.cornerstones.stormforged.length > 0 && (
								<Collapsible defaultOpen>
									<CollapsibleTrigger className='w-full items-start flex flex-col gap-2 group hover:opacity-80 transition-opacity'>
										<div className='flex flex-row items-center gap-3'>
											<h3 className='text-xl font-semibold text-perk-stormforged'>{categoryDescriptions.stormforged.title}</h3>
											<div className='text-xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
												<KeyboardArrowDown />
											</div>
										</div>
										<p className='text-slate-400 text-sm'>{categoryDescriptions.stormforged.description}</p>
									</CollapsibleTrigger>
									<CollapsibleContent className='mt-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
											{itemsByCategory.cornerstones.stormforged.map((cornerstone, index) => (
												<CornerstoneComponent key={index} cornerstone={cornerstone} />
											))}
										</div>
									</CollapsibleContent>
								</Collapsible>
							)}

							{/* Legendary */}
							{itemsByCategory.cornerstones.legendary.length > 0 && (
								<Collapsible defaultOpen>
									<CollapsibleTrigger className='w-full items-start flex flex-col gap-2 group hover:opacity-80 transition-opacity'>
										<div className='flex flex-row items-center gap-3'>
											<h3 className='text-xl font-semibold text-perk-orange'>{categoryDescriptions.legendary.title}</h3>
											<div className='text-xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
												<KeyboardArrowDown />
											</div>
										</div>
										<p className='text-slate-400 text-sm'>{categoryDescriptions.legendary.description}</p>
									</CollapsibleTrigger>
									<CollapsibleContent className='mt-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
											{itemsByCategory.cornerstones.legendary.map((cornerstone, index) => (
												<CornerstoneComponent key={index} cornerstone={cornerstone} />
											))}
										</div>
									</CollapsibleContent>
								</Collapsible>
							)}

							{/* Epic */}
							{itemsByCategory.cornerstones.epic.length > 0 && (
								<Collapsible defaultOpen>
									<CollapsibleTrigger className='w-full items-start flex flex-col gap-2 group hover:opacity-80 transition-opacity'>
										<div className='flex flex-row items-center gap-3'>
											<h3 className='text-xl font-semibold text-perk-purple'>{categoryDescriptions.epic.title}</h3>
											<div className='text-xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
												<KeyboardArrowDown />
											</div>
										</div>
										<p className='text-slate-400 text-sm'>{categoryDescriptions.epic.description}</p>
									</CollapsibleTrigger>
									<CollapsibleContent className='mt-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
											{itemsByCategory.cornerstones.epic.map((cornerstone, index) => (
												<CornerstoneComponent key={index} cornerstone={cornerstone} />
											))}
										</div>
									</CollapsibleContent>
								</Collapsible>
							)}
						</CollapsibleContent>
					</Collapsible>
				)}

				{/* Perks Section */}
				{itemsByCategory.perks.length > 0 && (
					<Collapsible defaultOpen>
						<CollapsibleTrigger className='w-full items-start flex flex-col gap-2 group hover:opacity-80 transition-opacity'>
							<div className='flex flex-row items-center gap-3'>
								<h2 className='text-2xl font-semibold text-slate-50'>{categoryDescriptions.perks.title}</h2>
								<div className='text-2xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
									<KeyboardArrowDown />
								</div>
							</div>
							<p className='text-slate-400 text-sm'>{categoryDescriptions.perks.description}</p>
							<hr className='w-full border-slate-700' />
						</CollapsibleTrigger>
						<CollapsibleContent className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
							{itemsByCategory.perks.map((perk, index) => (
								<CornerstoneComponent key={index} cornerstone={perk} />
							))}
						</CollapsibleContent>
					</Collapsible>
				)}

				{/* Effects Section */}
				{itemsByCategory.effects.length > 0 && (
					<Collapsible defaultOpen>
						<CollapsibleTrigger className='w-full items-start flex flex-col gap-2 group hover:opacity-80 transition-opacity'>
							<div className='flex flex-row items-center gap-3'>
								<h2 className='text-2xl font-semibold text-slate-50'>{categoryDescriptions.effects.title}</h2>
								<div className='text-2xl text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180'>
									<KeyboardArrowDown />
								</div>
							</div>
							<p className='text-slate-400 text-sm'>{categoryDescriptions.effects.description}</p>
							<hr className='w-full border-slate-700' />
						</CollapsibleTrigger>
						<CollapsibleContent className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
							{/* Effects will be implemented later */}
						</CollapsibleContent>
					</Collapsible>
				)}
			</div>
		</div>
	);
};

export default CornerstonesPage;
