import { Button } from './ui/button';

const SpeciesRow = ({ species, onPick }: { species: any; onPick: (species: any) => void }) => {
    return (
        <div className='flex flex-row items-center gap-2 w-full'>
            <img className='w-12 h-12' src={`/img/${species.name}.png`} />
            <p className='w-full'>{species.name}</p>
            <Button className='justify-self-end' onClick={() => onPick(species.name)}>
                Select
            </Button>
        </div>
    );
};

export default SpeciesRow;