import { BlueprintDifferences } from "@/types/DraftAssistant/BlueprintDifferences";
import { ProductionBuilding } from "@/types/DraftAssistant/ProductionBuilding";

// Define scoring constants
const BASE_SCORE_NEW_RECIPE = 3;
const SCORE_PER_STAR_NEW_RECIPE = 1;
const SCORE_NEW_BUILDING_MAT = 2;
const SCORE_EXTRA_BUILDING_MAT_BEFORE_PICK_3 = 1;
const SCORE_COMPLEX_FOOD = 2;
const SCORE_PER_STAR_COMPLEX_FOOD_PER_SPECIES = 1;
const SCORE_EXTRA_COMPLETED_CHAIN_COMPLEX_FOOD = 2;
const SCORE_LUXURY_PER_STAR = 1;
const SCORE_LUXURY_COMPLETED_CHAIN_PER_SPECIES = 4;
const SCORE_PACKS_BUILDING_MATS_IF_FROGS = 1;
const SCORE_REDUCTION_ABOVE_P10 = 0.25;
const SCORE_LUX_NO_TRADE_GOODS_RECIPE = 1;
const SCORE_LUX_COMPLETABLE = 1;
const SCORE_LUX_NON_NEEDED = 1;
const SCORE_LUX_EXTRA_SCROLLS_RECIPE = 1;
const SCORE_TRADE_GOODS_PER_STAR = 2;
const SCORE_TRADE_GOODS_NO_TRADE_GOODS = 1;
const SCORE_TRADE_GOODS_COMPLETABLE = 1;
const SCORE_PROVISIONS = 3;
const SCORE_CROPS_PER_STAR = 2;
const SCORE_CROPS_NO_OTHER_PACK_RECIPE = 1;
const SCORE_CROPS_FARM_BUILDING = 1;
const SCORE_TOOLS = 5;
const SCORE_TOOLS_PER_STAR_IF_METAL_RECIPE = 3;
const SCORE_TOOLS_PER_STAR_IF_PLANKS_RECIPE = 1;

const itemCategoryMapping = {
  buildingMats: ['Planks', 'Bricks', 'Fabric'],
  complexFood: ['Biscuits', 'Pickled Goods', 'Pie', 'Skewers', 'Jerky', 'Porridge'],
  luxury: ['Wine', 'Incense', 'Ale', 'Tea', ],
  clothing: ['Coats', 'Boots'],
  fuel: ['Coal', 'Oil', 'Sea Marrow', ],
  metal: ['Copper Bars', 'Copper Ore', 'Crystalized Dew'],
  containers: ['Barrels', 'Pottery', 'Waterskins'],
  packs: ['Pack of Crops', 'Pack of Provisions', 'Pack of Building Materials', 'Pack of Trade Goods', 'Pack of Luxury Goods'],
  crafting: [],
  misc: ['Resin']
}

// Function to calculate the score for a building
function calculateBuildingScore(building: ProductionBuilding, index: number, differences: BlueprintDifferences, currentResources: Set<string>): number {
  let score = 0;

  // Example logic for scoring based on the criteria
  // New Recipe
  differences.newResources.forEach(resource => {
    if (!currentResources.has(resource)) {
      score += BASE_SCORE_NEW_RECIPE;
      score += differences.improvedTiers[resource] * SCORE_PER_STAR_NEW_RECIPE;
    }
  });

  // Building Mats
  if (itemCategories.buildingMats.has(building.id)) {
    score += SCORE_NEW_BUILDING_MAT;
    if (index < 3) score += SCORE_EXTRA_BUILDING_MAT_BEFORE_PICK_3;
  }

  // Complex Food
  if (itemCategories.complexFood.has(building.id)) {
    score += SCORE_COMPLEX_FOOD;
    score += differences.improvedTiers[building.id] * SCORE_PER_STAR_COMPLEX_FOOD_PER_SPECIES;
    // Assume some logic to determine completed production chains
    if (/* check for completed production chain */) {
      score += SCORE_EXTRA_COMPLETED_CHAIN_COMPLEX_FOOD;
    }
  }

  // Luxury
  if (itemCategories.luxury.has(building.id)) {
    score += SCORE_LUXURY_PER_STAR * differences.improvedTiers[building.id];
    if (/* check for completed production chain */) {
      score += SCORE_LUXURY_COMPLETED_CHAIN_PER_SPECIES;
    }
  }

  // Additional scoring logic for other categories...

  // Apply reduction if above pick 10
  if (index > 10) {
    score *= (1 - SCORE_REDUCTION_ABOVE_P10);
  }

  return score;
}