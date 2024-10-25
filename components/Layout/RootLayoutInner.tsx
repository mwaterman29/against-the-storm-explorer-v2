'use client';

import { store } from "@/redux/store"
import { ReactNode } from "react"
import { Provider } from "react-redux"
import NavDropdown from "../NavDropdown";
import SettingsDropdown from "../SettingsDropdown";

const RootLayoutInner = ({ children }: {children: ReactNode}) => {
    return (
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
                {children}
            </body>
        </Provider>
    )
}

export default RootLayoutInner