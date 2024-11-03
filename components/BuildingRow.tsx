import { Button } from './ui/button';

const BuildingRow = ({ building, onPick }: { building: any; onPick?: any }) =>
{
	return (
		<div className='flex flex-row items-center gap-2 w-full'>
			<img className='w-12 h-12' src={`/img/${building.id}.png`} />
			<p className='w-full'>{building.id}</p>
			{onPick && (
				<Button className='justify-self-end' onClick={() => onPick(building)}>
					Select
				</Button>
			)}
		</div>
	);
};

export default BuildingRow;
