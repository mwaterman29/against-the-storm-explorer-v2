import { BlueprintDifferences } from "@/types/DraftAssistant/BlueprintDifferences";
import { findProductionChainsWithTiers } from "./findProductionChainsWithTiers";

export function calculateDifferences(
	baseResources: Set<string>,
	currentBlueprints: string[],
	newBuilding: any
): BlueprintDifferences
{
	const updatedBlueprints = [...currentBlueprints, newBuilding.id];
	const { completedChainsWithTiers: currentTiers } = findProductionChainsWithTiers(baseResources, currentBlueprints);
	const { completedChainsWithTiers: newTiers } = findProductionChainsWithTiers(baseResources, updatedBlueprints);

	const newResources = Object.keys(newTiers).filter(resource => !(resource in currentTiers));
	const improvedTiers: Record<string, number> = {};

	for (const resource in newTiers)
	{
		if (currentTiers[resource] !== undefined && newTiers[resource] > currentTiers[resource])
		{
			improvedTiers[resource] = newTiers[resource];
		}
	}

	return { newResources, improvedTiers };
}
