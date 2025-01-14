'use client'
import { setcheck } from "@/utils/api";

function SetChecks () {
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