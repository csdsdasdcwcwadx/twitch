import React, { memo } from "react";
import Image from "next/image";

import fireworkIcon from "@/icon/firework.png";
import kittyIcon from "@/icon/kitty.png";

import Sidder from "./Sidder";

interface I_props {
    children: React.ReactNode;
    className?: string;
}

function CommonPage ({ children, className = "" }: I_props) {
    const defaultClass = "w-[150px] h-[150px] fixed z-[-1] opacity-[.6]";

    return (
        <>
            <main className={`m-auto pc:max-w-[1500px] ${className}`}>
                <Image
                    src={fireworkIcon}
                    alt="firework"
                    className={defaultClass + " right-[5%] bottom-[15%]"}
                />
                <Image
                    src={fireworkIcon}
                    alt="firework"
                    className={defaultClass + " right-[10%] top-[5%]"}
                />
                <Image
                    src={kittyIcon}
                    alt="kitty"
                    className={defaultClass + " left-[10%] bottom-[10%] rotate-[30deg]"}
                />
                <Image
                    src={kittyIcon}
                    alt="kitty"
                    className={defaultClass + " right-[15%] top-[30%] rotate-[30deg]"}
                />
                <Image
                    src={fireworkIcon}
                    alt="firework"
                    className={defaultClass + " left-[20%] top-[15%] rotate-[30deg]"}
                />
                { children }
            </main>
            <Sidder/>
        </>
    )
}

export default memo(CommonPage);