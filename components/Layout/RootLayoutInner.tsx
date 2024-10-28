'use client';

import { store } from '@/redux/store';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import NavDropdown from '../NavDropdown';
import SettingsDropdown from '../SettingsDropdown';
import { TooltipProvider } from '../ui/tooltip';
import SearchOverlay from '../Search/SearchOverlay';

const RootLayoutInner = ({ children }: { children: ReactNode }) =>
{
	return (
		<TooltipProvider>
			<Provider store={store}>
				<body className='h-dvh w-dvw overflow-hidden'>
					<div className='w-full flex flex-row items-center justify-between min-h-12 bg-slate-800 px-4'>
						<NavDropdown />
						<div className='flex flex-row items-center'>
							<p className='text-xl text-color-tan'>Against The Storm Explorer</p>
							<sup className='text-perk-orange'>V2</sup>
						</div>
						<SettingsDropdown />
					</div>
					<SearchOverlay />
					{children}
				</body>
			</Provider>
		</TooltipProvider>
	);
};

export default RootLayoutInner;
