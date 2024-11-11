import { cn } from '@/lib/utils';
import { setInputText, setIsOverlayOpen as setIsOverlayOpenRedux } from '@/redux/interactionSlice';
import { RootState } from '@/redux/store';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SearchOverlay = () =>
{
    //const [input, setInput] = useState('');
    const dispatch = useDispatch();

	const input = useSelector((state: RootState) => state.interaction.inputText);
	const setInput = (text: string) => dispatch(setInputText(text));

	const isOverlayOpen = useSelector((state: RootState) => state.interaction.isOverlayOpen);
	const setIsOverlayOpen = (isOpen: boolean) => dispatch(setIsOverlayOpenRedux(isOpen));

	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() =>
	{
		const handleKeyDown = (event: KeyboardEvent) =>
		{
			if (event.ctrlKey && event.key === 'p')
			{
				event.preventDefault();
				setIsOverlayOpen(true);
			}

            if(event.key === 'Escape')
            {
                if(input === '')
                {
                    setIsOverlayOpen(false);
                }
                else
                {
                    setInput('');
                }
            }
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() =>
	{
		if (isOverlayOpen && inputRef.current)
		{
			inputRef.current.focus();
		}
	}, [isOverlayOpen]);

	return (
		<div>
				<div
					className={cn("fixed inset-0 transition-colors duration-300 flex items-center justify-center bg-black z-50", (isOverlayOpen ? " bg-opacity-50 " : " bg-opacity-0 invisible"))}
					onClick={() => setIsOverlayOpen(false)}
				>
					<div
						className="bg-white p-4 rounded-md"
						onClick={(e) => e.stopPropagation()}
					>
						<input
							ref={inputRef}
							type="text"
							placeholder="Type to search..."
							className="border-b p-2 w-full focus:outline-none"
						/>
						<div className="mt-4 text-center text-gray-500">
							No results found.
						</div>
					</div>
				</div>
		</div>
	);
}

export default SearchOverlay;
