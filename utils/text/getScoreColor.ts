export function getScoreColor(score: number): string
{
	// Cap at 7
	const normalizedScore = Math.min(score, 7) / 7;

	// Define color codes for light green to medium-dark green
	const startColor = [144, 238, 144]; // Light green (RGB)
	const endColor = [0, 128, 0]; // Medium-dark green (RGB)

	const interpolate = (start: number, end: number, fraction: number) => 
		Math.round(start + (end - start) * fraction);

	const r = interpolate(startColor[0], endColor[0], normalizedScore);
	const g = interpolate(startColor[1], endColor[1], normalizedScore);
	const b = interpolate(startColor[2], endColor[2], normalizedScore);

	return `rgb(${r}, ${g}, ${b})`;
}
