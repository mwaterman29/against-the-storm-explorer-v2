import { uuid } from '@/utils/uuid';
import StarFilled from '@material-symbols/svg-400/outlined/star-fill.svg';
import Star from '@material-symbols/svg-400/outlined/star.svg';

const TierSpan = ({ tier }: { tier: number }) =>
{
	return (
		<span className='flex flex-row items-center'>
			({[...Array(3)].map((_, i) => (i < tier ? <StarFilled key={uuid()} /> : <Star key={uuid()} />))})
		</span>
	);
};

export default TierSpan;
