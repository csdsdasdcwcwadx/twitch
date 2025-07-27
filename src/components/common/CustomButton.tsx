"use client";

import { memo, MouseEventHandler } from 'react';
import { Button } from '@headlessui/react';

interface I_props {
    onClick: MouseEventHandler<HTMLButtonElement>;
    text: string;
    className?: string;
}

function CustomButton ({ text, onClick, className }: I_props) {
    return <Button onClick={onClick} className={"text-topcovercolor rounded-md py-2.5 px-5 bg-coverground hover:bg-hoverground active:bg-[#CBAA98] " + className}>{text}</Button>
}

export default memo(CustomButton);