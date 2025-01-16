'use client';
// import SetChecks from "@/components/pages/back/button"
import { getMonthCalendar } from "@/utils/util";
import { getchecks, setCheckStatus, setcheck } from "@/utils/api"
import { useEffect, useRef, useState } from "react";

const today = new Date();

type Check = {
    id: string;
    streaming: boolean;
    passcode: string;
    created_at: string;
    userChecks: UserCheck[];
}

type UserCheck = {
    user_id: string;
    check_id: string;
    checked: boolean;
    created_at: string;
}

type I_CheckPage = {
    getChecks: Check[];
}

export default function Back() {
    const [checkPageData, setCheckPageData] = useState<I_CheckPage>({
        getChecks: [],
    });
    const [checkItem, setCheckItem] = useState<Check | null>(null);
    const passcodeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async function () {
            try {
                const result = await getchecks();
                const open = result.getChecks.find((check: any) => check.streaming);
                if (open) setCheckItem(open);
                setCheckPageData(result);
            } catch(e) {
                console.log(e)
            }
        })()
    }, [])

    return (
        <div>
            <div>
                {
                    !checkItem ? (
                        <>
                            <input type="input" className="border border-solid mr-3 border-black" ref={passcodeRef}/>
                            <button onClick={async () => {
                                const result = await setcheck(passcodeRef.current?.value || "");
                                if (passcodeRef.current) passcodeRef.current.value = "";
                                if (result.status) setCheckItem(result.checkinfo[0]);
                            }}>設定簽到表</button>
                        </>
                    ) : <button onClick={async () => {
                        const result = await setCheckStatus(checkItem.id, false);
                        if (result.status) setCheckItem(null);
                    }}>簽到結束</button>
                }
            </div>
            <table width="500" className="mt-6">
                <caption>簽到表</caption>
                <tbody>
                    {
                        getMonthCalendar(today.getFullYear(), today.getMonth() + 1).map((week, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        week.map((day, weekIndex) => {
                                            const checks = checkPageData.getChecks.find(check => {
                                                const currentDay = new Date(Number(check.created_at)).getDate();
                                                return `${currentDay}` === day;
                                            })
                                            return (
                                                <td key={`${weekIndex}${index}`} className={`text-right ${checks ? 'cursor-pointer ' : ''}py-2 align-top h-20 relative`}>
                                                    <div>{day}</div>
                                                    {/* { 
                                                        checks && (
                                                            <>
                                                                <div 
                                                                    className="absolute text-xs right-0">
                                                                    { checks.streaming ? "直播中" : "直播結束" }
                                                                </div>
                                                                <div className="absolute text-xs right-0 top-12">
                                                                    {
                                                                        checks.userChecks[0].checked ? '已簽到' : checks.streaming ?  '尚未簽到' : '未簽到'
                                                                    }
                                                                </div> 
                                                            </>
                                                        )
                                                    } */}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}