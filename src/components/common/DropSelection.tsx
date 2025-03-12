'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

interface I_props<T> {
    selections: Array<T>;
    setSelected: (select: T) => void;
    selected: T;
    className: string;
    disableOptions?: Array<T>;
}

export default function DropSelection<T extends string | number> ({ selections, setSelected, selected, className, disableOptions = [] }: I_props<T>) {
    return (
        <div className={className}>
            <span className="text-sm pl-1">選擇種類</span>
            <Listbox value={selected} onChange={setSelected}>
                <ListboxButton className="w-[100%] pt-1 pb-1 pl-3 border border-solid border-slate-500 outline-none w-11/12 rounded text-left">{selected}</ListboxButton>
                <ListboxOptions anchor="bottom" className="z-20 w-[var(--button-width)] rounded-xl border border-white/5 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none bg-coverground text-topcovercolor">
                {
                    selections.map(select => {
                        if (disableOptions.includes(select)) return;
                        return (
                            <ListboxOption key={select} value={select} className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                {select}
                            </ListboxOption>
                        )
                    })
                }
                </ListboxOptions>
            </Listbox>
        </div>
    )
}