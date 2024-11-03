import { patterns } from "./patterns";

function getImgSrc(input: string): string
{
	patterns.forEach(pattern =>
	{
		input = input.replace(pattern, '');
	});
	return input.trim();
}

export { getImgSrc };
