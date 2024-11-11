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
	workingEffects: EffectSummary[];
	options1: ItemUsage[];
	options2: ItemUsage[];
}

interface EffectSummary 
{
	label: string;
	description: string;
}

interface GladeEvent
{
	id: string;
	label: string;
	difficulties: GladeDifficulty[];
	rewardTableNames: string[];
	workingEffects: EffectSummary[];
	threats: EffectSummary[];
	workerSlots: number;
	totalTime: number;
	difficulty: string;
}

export type { GladeEvent, GladeReward, GladeDifficulty, GladeSolveOption };