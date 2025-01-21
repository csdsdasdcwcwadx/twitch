'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { login } from "@/utils/api";

export default function PageRequest () {
    const pathname = usePathname();

    useEffect(() => {
        if (process.env.ENV !== "prod") {
            (async function() {
                try {
                    const data = await login(pathname);
                    if (data.href) {
                        window.location.href = data.href;
                    }
                } catch (e: unknown) {
                    console.log(e)
                }
            })()
        }
    }, [pathname])

    return <></>
}