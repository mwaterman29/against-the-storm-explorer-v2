import { productionBuildings } from "@/data/productionBuildings";

export function findProductionChainsWithTiers(
	baseResources: Set<string>,
	blueprintsOwned: string[]
): { completedChains: string[]; completedChainsWithTiers: Record<string, number> }
{
	const availableResources = new Set(baseResources);
	const itemTiers: Record<string, number> = {};
	let previousLength = 0;

	// Filter buildings to only include those owned
	const ownedBuildings = productionBuildings.filter(building => blueprintsOwned.includes(building.id));

	/*
	start with a set of all available resources 
	cache length

	for all recipes not in the set, check their ingredients, if any member of req first and second is in the available resources, then add it to the set

	compare new length against cached length
	if same, end
	otherwise, repeat 

	available resources is always the union of tree and deposit resources, excluding secondary for due to quantity limitations
	*/
	do
	{
		previousLength = availableResources.size;

		for (const building of ownedBuildings)
		{
			for (const recipe of building.produces)
			{
				if (
					!availableResources.has(recipe.output) &&
					(recipe.ingredientsFirst.length === 0 || recipe.ingredientsFirst.some(ingredient => availableResources.has(ingredient))) &&
					(recipe.ingredientsSecond.length === 0 || recipe.ingredientsSecond.some(ingredient => availableResources.has(ingredient)))
				)
				{
					availableResources.add(recipe.output);
				}

				//Update tier if necessary
				if (!itemTiers[recipe.output] || itemTiers[recipe.output] < recipe.tier)
				{
					itemTiers[recipe.output] = recipe.tier;
				}
			}
		}
	} while (availableResources.size > previousLength);

	const completedChains = Array.from(availableResources).filter(resource => !baseResources.has(resource));

	return { completedChains, completedChainsWithTiers: itemTiers };
}