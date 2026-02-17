import { productionBuildings as buildings } from '@/data/productionBuildings';
import { species } from '@/data/species';

import { ProductionBuilding } from '@/types/DraftAssistant/ProductionBuilding';

import { findProductionChainsWithTiers } from './findProductionChainsWithTiers';

// Types for scoring system
export interface ScoringContext
{
	species: string[];
	waterTypes: string[]; // 'storm', 'clearance', 'drizzle'
	biomeResources: Set<string>;
	existingBuildings: string[];
	difficulty: number;
	pickNumber: number;
}

export interface ScoringRuleResult
{
	scored: boolean;
	scoreDelta: number;
	reasoning?: string;
}

export type ScoringRule = (context: ScoringContext, building: ProductionBuilding, recipe?: { output: string; tier: number }) => ScoringRuleResult;

export interface ItemScoringMetadata
{
	category: 'building_materials' | 'food' | 'luxury' | 'fuel' | 'metal' | 'container' | 'pack' | 'tools' | 'complex_food';
	baseScores: number[]; // Array of 4 numbers for tier 0-3
	tierReasons: string[]; // Array of 4 strings explaining the score for each tier
	scoringRules: ScoringRule[];
}

// Common scoring rules that can be reused
const perSpeciesPerTierRule =
	(foodName: string): ScoringRule =>
	(context, building, recipe) =>
	{
		if (!recipe) return { scored: false, scoreDelta: 0 };

		// Only apply for species that are actually in the settlement
		const relevantSpecies = species.filter(s => s.needs.includes(foodName)).filter(s => context.species.includes(s.name));

		// Check if chain is completed
		const { completedChains: currentChains } = findProductionChainsWithTiers(context.biomeResources, context.existingBuildings);
		const { completedChains: newChains } = findProductionChainsWithTiers(context.biomeResources, [...context.existingBuildings, building.id]);
		const isChainCompleted = currentChains.includes(foodName) || newChains.includes(foodName);

		// Calculate score: +1 per tier per species, halved if chain incomplete
		const baseScore = relevantSpecies.length * (recipe.tier + 1);
		const multiplier = isChainCompleted ? 1 : 0.5;
		const scoreDelta = baseScore * multiplier;

		// Format species list
		const speciesNames = relevantSpecies.map(s => s.name);
		let speciesText = '';
		if (speciesNames.length === 1)
		{
			speciesText = speciesNames[0];
		}
		else if (speciesNames.length === 2)
		{
			speciesText = `${speciesNames[0]} and ${speciesNames[1]}`;
		}
		else
		{
			speciesText = speciesNames.slice(0, -1).join(', ') + ', and ' + speciesNames[speciesNames.length - 1];
		}

		return {
			scored: true,
			scoreDelta,
			reasoning: `${speciesText} need${speciesNames.length === 1 ? 's' : ''} ${foodName}${!isChainCompleted ? ', halved because incomplete production chain' : ''} (+${scoreDelta})`
		};
	};

const chainCompletionRule =
	(foodName: string): ScoringRule =>
	(context, building, recipe) =>
	{
		if (!recipe) return { scored: false, scoreDelta: 0 };

		const { completedChains: currentChains } = findProductionChainsWithTiers(context.biomeResources, context.existingBuildings);
		const { completedChains: newChains } = findProductionChainsWithTiers(context.biomeResources, [...context.existingBuildings, building.id]);

		if (newChains.includes(recipe.output) && !currentChains.includes(recipe.output))
		{
			return {
				scored: true,
				scoreDelta: 2,
				reasoning: `Completes production chain for ${foodName} (+2)`
			};
		}

		return { scored: false, scoreDelta: 0 };
	};

// Helper function to get complex food configuration
function getComplexFoodConfiguration(foodName: string): ItemScoringMetadata
{
	return {
		category: 'complex_food' as const,
		baseScores: [2, 1, 1, 1], // Base scores that sum up per tier
		tierReasons: [`Base complex food bonus`, `Additional tier 1 bonus`, `Additional tier 2 bonus`, `Tier 3 Complex Food is extremely efficient`],
		scoringRules: [perSpeciesPerTierRule(foodName), chainCompletionRule(foodName)]
	};
}

export interface BuildingScoreResult
{
	totalScore: number;
	breakdowns: {
		baseScore: number;
		tierBonus: number;
		speciesBonus: number;
		waterBonus: number;
		chainCompletionBonus: number;
		difficultyPenalty: number;
	};
	metadata: {
		buildingRecipes: {
			name: string;
			tier: number;
			isNew: boolean;
			isImproved: boolean;
			isIncomplete: boolean;
			oldTier?: number;
		}[];
		otherChains: {
			name: string;
			tier: number;
			source: string;
			oldTier?: number;
		}[];
	};
	reasoning: string[];
}

// Base scores for buildings - these are preliminary and will need tuning
export const buildingBaseScores: Record<string, number> = {
	'Crude Workstation': 5,
	'Makeshift Post': 4,
	'Field Kitchen': 4
	// ... add more buildings
};

// Metadata for items - this is a starting point and will need to be expanded
export const itemMetadata: Record<string, ItemScoringMetadata> = {
	Planks: {
		category: 'building_materials',
		baseScores: [0, 0, 3, 6],
		tierReasons: [
			'',
			'',
			'5:2 is an efficient ratio; planks are the most important building material',
			'3:2 is unparalleled efficiency for the most important building material'
		],
		scoringRules: []
	},
	Porridge: {
		...getComplexFoodConfiguration('Porridge')
	}
};

export function calculateBuildingScore(building: ProductionBuilding, context: ScoringContext): BuildingScoreResult
{
	const result: BuildingScoreResult = {
		totalScore: 0,
		breakdowns: {
			baseScore: 0,
			tierBonus: 0,
			speciesBonus: 0,
			waterBonus: 0,
			chainCompletionBonus: 0,
			difficultyPenalty: 0
		},
		metadata: {
			buildingRecipes: [],
			otherChains: []
		},
		reasoning: []
	};

	// Start with base score
	result.breakdowns.baseScore = buildingBaseScores[building.id] || 0;
	if (result.breakdowns.baseScore > 0)
	{
		result.reasoning.push(`Base building score: +${result.breakdowns.baseScore}`);
	}

	// Calculate production chain differences
	const { completedChains: currentChains, completedChainsWithTiers: currentTiers } = findProductionChainsWithTiers(
		context.biomeResources,
		context.existingBuildings
	);
	const { completedChains: newChains, completedChainsWithTiers: newTiers } = findProductionChainsWithTiers(context.biomeResources, [
		...context.existingBuildings,
		building.id
	]);

	// Get all recipes from this building
	const buildingRecipes = new Set(building.produces.map(r => r.output));

	// Track building recipes
	for (const recipe of building.produces)
	{
		const isNew = !currentTiers.hasOwnProperty(recipe.output);
		const oldTier = currentTiers[recipe.output];
		const isImproved = !isNew && recipe.tier > (oldTier || 0);
		const isIncomplete = !newChains.includes(recipe.output);

		result.metadata.buildingRecipes.push({
			name: recipe.output,
			tier: recipe.tier,
			isNew,
			isImproved,
			isIncomplete,
			oldTier: isImproved ? oldTier : undefined
		});
	}

	// Track other chains that were completed/improved
	const otherCompletedChains = newChains.filter(chain => !buildingRecipes.has(chain)).filter(chain => !currentChains.includes(chain));

	for (const chain of otherCompletedChains)
	{
		const oldTier = currentTiers[chain];
		const newTier = newTiers[chain];

		result.metadata.otherChains.push({
			name: chain,
			tier: newTier,
			source: context.existingBuildings.find(b => buildings.find(building => building.id === b)?.produces.some(r => r.output === chain)) || 'Unknown',
			oldTier
		});
	}

	// Add scoring based on recipes and their tiers
	for (const recipe of building.produces)
	{
		const itemData = itemMetadata[recipe.output];
		if (!itemData) continue;

		// Calculate base score by summing up to the current tier
		let tierScore = 0;
		const existingTier = currentTiers[recipe.output] || -1;
		const newTier = recipe.tier;

		// If this is a new chain or improved tier, calculate the score difference
		if (existingTier < newTier)
		{
			// For complex foods, sum up all tiers and show only highest tier reason
			if (itemData.category === 'complex_food')
			{
				// Sum up all tier scores
				for (let t = 0; t <= newTier; t++)
				{
					tierScore += itemData.baseScores[t] || 0;
				}
				// Only show the highest tier reason
				result.reasoning.push(`${recipe.output} ${itemData.tierReasons[newTier]} (+${tierScore})`);
			}
			else
			{
				// For other items, just use the highest tier score
				tierScore = itemData.baseScores[newTier] || 0;
				if (tierScore > 0)
				{
					result.reasoning.push(`${recipe.output} ${itemData.tierReasons[newTier]} (+${tierScore})`);
				}
			}
			result.breakdowns.tierBonus += tierScore;
		}

		// Apply all scoring rules
		for (const rule of itemData.scoringRules)
		{
			const ruleResult = rule(context, building, recipe);
			if (ruleResult.scored)
			{
				// Add to appropriate breakdown category based on rule type
				if (ruleResult.reasoning?.includes('species that need'))
				{
					result.breakdowns.speciesBonus += ruleResult.scoreDelta;
				}
				else if (ruleResult.reasoning?.includes('Completes production chain'))
				{
					result.breakdowns.chainCompletionBonus += ruleResult.scoreDelta;
				}
				else
				{
					result.breakdowns.tierBonus += ruleResult.scoreDelta;
				}

				if (ruleResult.reasoning)
				{
					result.reasoning.push(ruleResult.reasoning);
				}
			}
		}
	}

	// Calculate total
	result.totalScore = Object.values(result.breakdowns).reduce((a, b) => a + b, 0);

	return result;
}
