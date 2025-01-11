'use client'
import { setcheck, login } from "@/utils/api";
import { useEffect } from "react";

function SetChecks () {
    useEffect(() => {
        if (process.env.ENV !== "prod") {
            (async function() {
                try {
                    const data = await login('/back');
                    if (data.status === false) {
                        window.location.href = data.href;
                    }
                } catch (e: unknown) {
                    console.log(e)
                }
            })()
        }
    }, [])
    return (
        <div>
            <input type="input"/>
            <button onClick={async () => {
                const result = await setcheck('ddddd');
                console.log(result)
            }}>設定簽到表</button>
        </div>
    )
}

export default SetChecks;