import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

export const metadata: Metadata = {
	title: 'Against The Storm Explorer',
	description: 'Generated by create next app'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>)
{
	return (
		<html lang='en'>
			<body className='h-dvh w-dvw overflow-hidden'>
				<div className='w-full flex flex-row items-center justify-between min-h-12 bg-slate-700 px-4'>
					<div>
						nav here
					</div>
					<div className='flex flex-row items-center'>
						<p className='text-xl'>Against The Storm Explorer</p>
						<sup>V2</sup>
					</div>
					<div>
						settings here``
					</div>
				</div>
				{children}
			</body>
		</html>
	);
}
