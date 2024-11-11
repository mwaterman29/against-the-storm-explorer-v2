import { ItemUsage } from './ItemUsage';

interface GladeReward
{
	effect: string;
	chance: number;
}

interface GladeDifficulty
{
	difficultyClass: string;
	gladeSolveOptions: GladeSolveOption[];
}

interface GladeSolveOption
{
	name: string | null;
	decisionTag: string | null;
	workingEffects: string[];
	options1: ItemUsage[];
	options2: ItemUsage[];
}

interface GladeEvent
{
	id: string;
	label: string;
	difficulties: GladeDifficulty[];
	rewardTableNames: string[];
	workingEffects: string[];
	threats: string[];
	workerSlots: number;
	totalTime: number;
	difficulty: string;
}

export type { GladeEvent, GladeReward, GladeDifficulty, GladeSolveOption };