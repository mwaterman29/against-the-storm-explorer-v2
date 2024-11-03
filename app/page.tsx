import HomeSearchTrigger from '@/components/Search/HomeSearchTrigger';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const homeLinks = [
	{
		title: 'Glade Events',
		description: "A list of all Glade Events, including their rewards, requirements, and strategies.",
		//image: '/images/glade-events.jpg',
		textClass: 'text-perk-purple',
		borderClass: 'border-perk-purple',
		href: '/glade-events'
	},
	{
		title: 'Recipe Browser',
		description: "An interactive graph for recipes, including a production-chain planner and blueprint draft assistant.",
		textClass: 'text-perk-orange',
		borderClass: 'border-perk-orange',
		href: '/recipes'
	},
	{
		title: 'Cornerstones',
		description: "A list of all Cornerstones, including their effects, sources, and synergies.",
		textClass: 'text-decoration-yellow',
		borderClass: 'border-decoration-yellow',
		href: '/cornerstones'
	},
	{
		title: 'Blueprint Draft Assistant',
		description: "Draft Assistant for Blueprints",
		textClass: 'text-decoration-yellow',
		borderClass: 'border-decoration-yellow',
		href: '/blueprint-help'
	}
]

const HomePage = () =>
{
	return (
		<div className='flex flex-col items-center'>
			<div className='w-full max-w-[1200px] flex flex-col items-center gap-4 p-4'>
				<p className='text-2xl'>A data driven, opinionated compendium for learning about and improving at Against the Storm</p>
				<HomeSearchTrigger />
				<div className='max-w-[1200px] grid grid-cols-3 gap-4'>
					{homeLinks.map((link, index) => {
						return (
							<a key={index} className={cn('group flex flex-col items-start gap-2 p-4 border hover:border-2 hover:p-[15px] rounded-md', link.borderClass)} href={link.href}>
								<p className={cn('text-2xl font-bold`', link.textClass)}>{link.title}</p>
								<p className=''>{link.description}</p>
							</a>
						)
					})}
				</div>
			</div>
		</div>
	)
};

export default HomePage;
