'use client'

import Home from '@material-symbols/svg-400/outlined/home.svg';
import ExpandMore from '@material-symbols/svg-400/outlined/keyboard_arrow_down.svg';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import Link from 'next/link';
import { Button } from './ui/button';
import { useState } from 'react';

const NavOptions = [
	{
		name: 'Home',
		href: '/',
		icon: Home
	},
    {
        name: 'Recipe Browser',
        href: '/recipes',
        icon: Home
    },
    {
        name: 'Glade Events',
        href: '/glade-events',
        icon: Home
    },
    {
        name: 'Buildings',
        href: '/buildings',
        icon: Home
    },
    {
        name: 'Cornerstones',
        href: '/cornerstones',
        icon: Home
    },
    {
        name: 'Orders',
        href: '/orders',
        icon: Home
    }
];

const NavDropdown = () =>
{
    const [open, setOpen] = useState(false);

	return <div>
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button className='rounded-bl-none'>
                    Menu
                    <ExpandMore className='text-xl' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' sideOffset={0} className='bg-slate-900 text-slate-50 border-0 rounded-tl-none'>
                {NavOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                        <Link href={option.href} className='flex flex-row p-2 items-center gap-2' key={index}>
                            <Icon className='text-2xl' />
                            {option.name}
                        </Link>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    </div>;
};

export default NavDropdown;