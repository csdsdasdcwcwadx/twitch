'use client';

import { useEffect } from "react";
import { getRedemption } from "@/utils/api";

export default function Exchange () {
    useEffect(() => {
        (async function () {
            try {
                const result = await getRedemption();
                console.log(result)
            } catch(e) {
                console.log(e)
            }
        })()
    }, [])

    return (
        <div>
            exchange
        </div>
    )
}