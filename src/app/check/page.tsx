'use client';

import { getchecks } from "@/utils/api"
import { useEffect, useState } from "react";

export default function Check () {
    useEffect(() => {
        (async function () {
            const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
            const userID = urlParams.get("userID");
            try {
                const result = await getchecks(userID!);
                console.log(result);
            } catch(e) {
                console.log(e)
            }
        })()
    }, [])

    return (
        <main>
            <button>
                check
            </button>
            <table width="500">
                <caption>簽到表</caption>
                <tbody>
                    <tr></tr>
                </tbody>
            </table>
        </main>
    )
}