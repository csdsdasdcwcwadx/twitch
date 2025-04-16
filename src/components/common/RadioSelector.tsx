import { Field, Label, Radio, RadioGroup } from '@headlessui/react'
import { Fragment, useState } from "react";

interface I_props {
    className?: string;
    options: Array<{
        name: string;
        value: string | number;
    }>
    onChange: (value: string | number) => void;
    seleted: string | number;
}

export default function RadioSelector ({ className, options, onChange, seleted }: I_props) {

    return (
        <RadioGroup value={seleted} onChange={onChange} className={`flex gap-4 ${className}`}>
        {
            options.map(option => (
                <Field key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <Radio
                        value={option.value}
                        className="group flex size-4 items-center justify-center rounded-full border border-coverground data-[checked]:bg-background"
                    >
                        <span className="invisible size-2 rounded-full bg-coverground group-data-[checked]:visible" />
                    </Radio>
                    <Label className="text-sm cursor-pointer" onClick={() => onChange(option.value)}>{option.name}</Label>
                </Field>
            ))
        }
        </RadioGroup>
    )
}