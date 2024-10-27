import { formatName } from "./formatName";

function extractSpriteName(input: string): string 
{
    const match = input.match(/<sprite name="\[.*?\]\s*(.*?)">/);
    return match ? match[1] : '';
}

function interpolateSprites(text: string): React.ReactNode 
{
    const parts = text.split(/(<sprite name="\[.*?\].*?">)/g);
    return parts.map((part, index) => {
        if (part.startsWith('<sprite')) {
            const extractedName = extractSpriteName(part);
            const formattedName = formatName(extractedName);
            const imgSrc = `/img/${formattedName}.png`;
            return <img className='h-6 w-6 aspect-square' key={index} src={imgSrc} alt={formattedName} style={{ display: 'inline', verticalAlign: 'middle' }} />;
        }
        return part;
    });
}

export { interpolateSprites };