'use client';

import Image from "next/image";
import { ImagePath } from "@/utils/util";
import { I_Item } from "@/utils/interface";

interface I_props {
    item: I_Item
}

export default function ImageHandler ({item}: I_props) {
    return (
        process.env.NEXT_PUBLIC_ENV === "prod" ? 
            <img src={ImagePath + item.image} alt={item.name} className="object-cover rounded overflow-hidden" sizes="100"/> :
            <Image src={ImagePath + item.image} alt={item.name} className="object-cover rounded overflow-hidden" fill sizes="100"/>
    )
}