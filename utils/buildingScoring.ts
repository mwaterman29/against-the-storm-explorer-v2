import { ProductionBuilding } from '@/types/DraftAssistant/ProductionBuilding';
import { species } from '@/data/species';
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

// Helper function to get complex food configuration
function getComplexFoodConfiguration(foodName: string): ItemScoringMetadata {
	// Count how many species need this food
	const speciesNeedingFood = species.filter(s => s.needs.includes(foodName)).length;
	
	const perSpeciesPerTierRule: ScoringRule = (context, building, recipe) => {
		if (!recipe) return { scored: false, scoreDelta: 0 };
		
		// Only apply for species that are actually in the settlement
		const relevantSpecies = species
			.filter(s => s.needs.includes(foodName))
			.filter(s => context.species.includes(s.name))
			.length;
			
		const scoreDelta = relevantSpecies * (recipe.tier + 1); // +1 because tier is 0-based
		return {
			scored: true,
			scoreDelta,
			reasoning: `${relevantSpecies} species that need ${foodName}`
		};
	};

	const chainCompletionRule: ScoringRule = (context, building, recipe) => {
		if (!recipe) return { scored: false, scoreDelta: 0 };
		
		const { completedChains: currentChains } = findProductionChainsWithTiers(context.biomeResources, context.existingBuildings);
		const { completedChains: newChains } = findProductionChainsWithTiers(
			context.biomeResources,
			[...context.existingBuildings, building.id]
		);
		
		if (newChains.includes(recipe.output) && !currentChains.includes(recipe.output)) {
			return {
				scored: true,
				scoreDelta: 2,
				reasoning: `Completes production chain for ${foodName}`
			};
		}
		
		return { scored: false, scoreDelta: 0 };
	};

	return {
		category: 'complex_food' as const,
		baseScores: [2, 1, 1, 1], // Base +2 for any complex food
		tierReasons: [
			`Base complex food bonus`,
			`Base complex food bonus`,
			`Base complex food bonus`,
			`Base complex food bonus`
		],
		scoringRules: [
			perSpeciesPerTierRule,
			chainCompletionRule
		]
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
		newChains: string[];
		improvedChains: Record<string, number>; // resource -> new tier
	};
	reasoning: string[]; // Array of reasons contributing to the score
}

// Base scores for buildings - these are preliminary and will need tuning
export const buildingBaseScores: Record<string, number> = {
	'Crude Workstation': 5,
	'Makeshift Post': 4,
	'Field Kitchen': 4
	// ... add more buildings
};

// Metadata for items - this is a starting point and will need to be expanded
export const itemMetadata: Record<string, ItemScoringMetadata> = 
{
    Planks: {
        category: 'building_materials',
        baseScores: [0, 0, 3, 6],
        tierReasons: ['', '', '5:2 is an efficient ratio; planks are the most important building material', '3:2 is unparalleled efficiency for the most important building material'],
        scoringRules: [],
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
			newChains: [],
			improvedChains: {}
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
	const { completedChains: currentChains } = findProductionChainsWithTiers(context.biomeResources, context.existingBuildings);
	const { completedChains: newChains, completedChainsWithTiers } = findProductionChainsWithTiers(context.biomeResources, [
		...context.existingBuildings,
		building.id
	]);

	// Calculate new and improved chains
	result.metadata.newChains = newChains.filter(chain => !currentChains.includes(chain));

	// Add scoring based on recipes and their tiers
	for (const recipe of building.produces)
	{
		const itemData = itemMetadata[recipe.output];
		if (!itemData) continue;

		// Base score for the recipe tier
		const tierScore = itemData.baseScores[recipe.tier] || 0;
		if (tierScore > 0)
		{
			result.breakdowns.tierBonus += tierScore;
			result.reasoning.push(`${recipe.output} Tier ${recipe.tier}: ${itemData.tierReasons[recipe.tier]} (+${tierScore})`);
		}

		// Apply all scoring rules
		for (const rule of itemData.scoringRules)
		{
			const ruleResult = rule(context, building, recipe);
			if (ruleResult.scored)
			{
				//Apply
			}
		}
	}

	// Calculate total
	result.totalScore = Object.values(result.breakdowns).reduce((a, b) => a + b, 0);

	return result;
}
