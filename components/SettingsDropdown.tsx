'use client';

import { setDifficulty, setShowInternal, setShowTutorial } from '@/redux/settingsSlice';
import { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { Switch } from './ui/switch';

import ExpandMore from '@material-symbols/svg-400/outlined/keyboard_arrow_down.svg';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useState } from 'react';

const difficultyOptions = ['Settler', 'Pioneer', 'Veteran', 'Viceroy', ...Array.from({ length: 20 }, (_, i) => `Prestige ${i + 1}`)];

const SettingsDropdown = () =>
{
	const dispatch = useDispatch();
	const showTutorial = useSelector((state: RootState) => state.settings.showTutorial);
	const showInternal = useSelector((state: RootState) => state.settings.showInternal);
	const difficulty = useSelector((state: RootState) => state.settings.difficulty);

	const [open, setOpen] = useState(false);

	return (
		<div>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button className='rounded-b-none'>
						Settings
						<ExpandMore className='text-xl' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' sideOffset={0} className='bg-slate-900 text-slate-50 border-0 rounded-tr-none'>
					<div className='flex flex-row p-2 items-center gap-2'>
						<span>Show Tutorial</span>
						<Switch
							checked={showTutorial}
							onCheckedChange={value => dispatch(setShowTutorial(value))}
							className={`${showTutorial ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11`}
						>
							<span className={`${showTutorial ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`} />
						</Switch>
					</div>
					<div className='flex flex-row p-2 items-center gap-2'>
						<span>Show Internal</span>
						<Switch
							checked={showInternal}
							onCheckedChange={value => dispatch(setShowInternal(value))}
							className={`${showInternal ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11`}
						>
							<span className={`${showInternal ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`} />
						</Switch>
					</div>
					<div className='flex flex-row p-2 items-center gap-2'>
						<span>Difficulty</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className=''>{difficultyOptions[difficulty]}</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								{difficultyOptions.map((option, index) => (
									<DropdownMenuItem key={index} onSelect={() => dispatch(setDifficulty(index))}>
										{option}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default SettingsDropdown;
