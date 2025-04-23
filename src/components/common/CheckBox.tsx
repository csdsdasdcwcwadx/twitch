"use client";

import { memo } from "react";
import { Checkbox, Field, Label } from '@headlessui/react'

interface I_props {
    title: string;
    value: boolean;
    className?: string;
    onChange: (flag: boolean) => void;
}

function CheckBox ({title, value, className = "", onChange}: I_props) {
    return (
        <Field className={`flex items-center ${className}`}>
            <Checkbox
                checked={value}
                onChange={onChange}
                className="group flex size-4 items-center justify-center rounded border border-coverground mr-2 cursor-pointer"
            >
                <span className="invisible group-data-[checked]:visible w-[100%] h-[100%] flex items-center justify-center">
                    <svg className="w-3 h-3 text-coverground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </span>
            </Checkbox>
            <Label>{title}</Label>
        </Field>
    )
}

export default memo(CheckBox);