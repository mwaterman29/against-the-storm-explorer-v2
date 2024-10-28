'use client';

import { setIsOverlayOpen } from "@/redux/interactionSlice";
import { store } from "@/redux/store";

const HomeSearchTrigger = () => {
    return (
        <div className="w-full">
            <div
            className="w-full p-4 bg-slate-800 text-slate-50 border-0 rounded-md cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                store.dispatch(setIsOverlayOpen(true));
            }}
            >
                <p>Search</p>
            </div>
        </div>
    )
}

export default HomeSearchTrigger;