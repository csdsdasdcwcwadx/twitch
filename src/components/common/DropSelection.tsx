'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import Image from "next/image";
import arrowdownIcon from "@/icon/arrow-down.png";

interface I_props<T> {
    selections: Array<T>;
    setSelected: (select: T) => void;
    selected: T;
    className: string;
    disableOptions?: Array<T>;
}

export default function DropSelection<T extends string | number> ({ selections, setSelected, selected, className, disableOptions = [] }: I_props<T>) {
    return (
        <div className={className + ' relative'}>
            <span className="text-sm pl-1">選擇種類</span>
            <Listbox value={selected} onChange={setSelected}>
                <i className="absolute block w-[15px] h-[15px] right-[10px] top-[32px]">
                    <Image src={arrowdownIcon} alt="arrow-down" className="absolute"/>
                </i>
                <ListboxButton className="text-sm w-[100%] pt-1 pb-1 pl-3 border border-solid border-slate-500 outline-none w-11/12 rounded text-left">{selected}</ListboxButton>
                <ListboxOptions anchor="bottom" className="z-20 w-[var(--button-width)] rounded-xl border border-white/5 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none bg-coverground text-topcovercolor">
                {
                    selections.map(select => {
                        if (disableOptions.includes(select)) return;
                        return (
                            <ListboxOption key={select} value={select} className="text-sm group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10 cursor-pointer">
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