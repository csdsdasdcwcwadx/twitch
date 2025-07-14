"use client";

import { memo, MouseEventHandler } from 'react';
import { Button } from '@headlessui/react';

interface I_props {
    onClick: MouseEventHandler<HTMLButtonElement>;
    text: string;
}

function CustomButton ({text, onClick}: I_props) {
    return <Button onClick={onClick} className="text-button-font-color rounded-md py-2.5 px-5 bg-coverground font-bold">{text}</Button>
}

export default memo(CustomButton);