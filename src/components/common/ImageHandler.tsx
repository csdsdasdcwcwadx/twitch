'use client';

import Image from "next/image";
import { ImagePath } from "@/utils/util";
import { I_Item } from "@/utils/interface";

interface I_props {
    item: I_Item;
    className?: string;
}

export default function ImageHandler ({item, className}: I_props) {
    return <img src={ImagePath + item.image} alt={item.name} className={`absolute inset-0 w-full h-full object-cover rounded overflow-hidden ${className}`} sizes="100"/>
}