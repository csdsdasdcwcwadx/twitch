'use client';

import Image from "next/image";
import { ImagePath } from "@/utils/util";
import { I_Item } from "@/utils/interface";

interface I_props {
    item: I_Item;
    clasName?: string;
}

export default function ImageHandler ({item, clasName}: I_props) {
    return (
        process.env.NEXT_PUBLIC_ENV === "prod" ? 
            <img src={ImagePath + item.image} alt={item.name} className={`object-cover rounded overflow-hidden ${clasName}`} sizes="100"/> :
            <Image src={ImagePath + item.image} alt={item.name} className={`object-cover rounded overflow-hidden ${clasName}`} fill sizes="100"/>
    )
}