
import fs from 'fs';
import path from 'path';
import { patterns } from './patterns';

function deleteMatchingImages(imgFolderPath: string): void
{
	const files = fs.readdirSync(imgFolderPath);
	files.forEach(file =>
	{
		const fileName = path.parse(file).name;
		for (const pattern of patterns)
		{
			if (pattern.test(fileName))
			{
				fs.unlinkSync(path.join(imgFolderPath, file));
				break;
			}
		}
	});
}

export { deleteMatchingImages };