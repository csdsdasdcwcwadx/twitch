"use client";

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { memo } from 'react';
import Image from 'next/image';
import closeIcon from "@/icon/close.png";

interface I_props {
    open: boolean;
    close: (flag: boolean) => void;
    title: string;
    children: React.ReactNode;
}

function CustomDialog ({open, close, title, children}: I_props) {
    return (
        <Dialog open={open} onClose={() => close(false)}>
            <div className="fixed inset-0 flex w-screen mr-3 items-center justify-center p-4 bg-black bg-opacity-60 z-10 text-[#111827]">
                <DialogPanel className="max-w-lg border bg-[white] p-12 w-[500px] relative mobile:w-[80%]">
                <Image className="absolute top-[10px] right-[10px] cursor-pointer" src={closeIcon} alt="close" onClick={() => close(false)}/>
                <DialogTitle className="font-bold text-center text-xl mb-5">{title}</DialogTitle>
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default memo(CustomDialog);