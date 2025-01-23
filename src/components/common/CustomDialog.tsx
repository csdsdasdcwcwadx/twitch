"use client";

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { memo } from 'react';

interface I_props {
    open: boolean;
    close: (flag: boolean) => void;
    title: string;
    children: React.ReactNode;
}

function CustomDialog ({open, close, title, children}: I_props) {
    return (
        <Dialog open={open} onClose={() => close(false)}>
            <div className="fixed inset-0 flex w-screen mr-3 items-center justify-center p-4 bg-black bg-opacity-60 z-10">
                <DialogPanel className="max-w-lg border bg-background p-12 w-[500px] relative mobile:w-[80%]">
                    <DialogTitle className="font-bold text-center text-xl">{title}</DialogTitle>
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default memo(CustomDialog);