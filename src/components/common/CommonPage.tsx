import React, { memo } from "react";
import Image from "next/image";

import fireworkIcon from "@/icon/firework.png";

interface I_props {
    children: React.ReactNode;
    className?: string;
}

function CommonPage ({ children, className }: I_props) {
    return (
        <main className={`m-auto pc:max-w-[1500px] ${className && className}`}>
            <Image
                src={fireworkIcon}
                alt="firework"
                className="w-[150px] h-[150px] fixed z-[-1] opacity-[.8] left-[20%]"
            />
            <Image
                src={fireworkIcon}
                alt="firework"
                className="w-[150px] h-[150px] fixed z-[-1] opacity-[.8] right-[20%] top-[60%]"
            />
            { children }
        </main>
    )
}

export default memo(CommonPage);