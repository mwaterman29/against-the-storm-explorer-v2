import React from 'react';
import { formatName } from './formatName';
import StarFilled from '@material-symbols/svg-400/outlined/star-fill.svg';
import Star from '@material-symbols/svg-400/outlined/star.svg';
import { randomUUID } from 'crypto';
import { uuid } from '../uuid';

function extractSpriteName(input: string): string
{
	const match = input.match(/<sprite name="\[.*?\]\s*(.*?)">/);
	return match ? match[1] : '';
}

const patterns: Array<{ pattern: RegExp; replacer: (match: string, index: number) => React.ReactNode }> = [
	{
		pattern: /\(<sprite name=grade(\d)>\)/g,
		replacer: (match, index) =>
		{
			const gradeStr = match.match(/grade(\d)/)![1];
			const grade = parseInt(gradeStr, 10);
			return (
				<span className='flex flex-row items-center' key={index}>
					(
                    {[...Array(3)].map((_, i) => (i < grade ? <StarFilled key={uuid()} /> : <Star key={uuid()} />))}
                    )
				</span>
			);
		}
	},
	{
		pattern: /<sprite name=".*?">/g,
		replacer: (match, index) =>
		{
			const extractedName = extractSpriteName(match);
			const formattedName = formatName(extractedName);
			const imgSrc = `/img/${formattedName}.png`;
			return (
				<img className='h-6 w-6 aspect-square' key={uuid()} src={imgSrc} alt={formattedName} style={{ display: 'inline', verticalAlign: 'middle' }} />
			);
		}
	}
];

function interpolateSprites(text: string): React.ReactNode
{
	let result: Array<string | React.ReactNode> = [text];

	patterns.forEach(({ pattern, replacer }) =>
	{
		let newResult: Array<string | React.ReactNode> = [];

		result.forEach(segment =>
		{
			if (typeof segment === 'string')
			{
				let lastIndex = 0;
				segment.replace(pattern, (match, ...args) =>
				{
					const offset = args[args.length - 2];
					newResult.push(segment.slice(lastIndex, offset));
					newResult.push(replacer(match, newResult.length));
					lastIndex = offset + match.length;
					return match;
				});
				newResult.push(segment.slice(lastIndex));
			}
			else
			{
				newResult.push(segment);
			}
		});

		result = newResult;
	});

	return <div className='flex flex-wrap gap-1'>{result}</div>;
}

export { interpolateSprites };
