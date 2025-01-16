'use client';

import { getchecks, setUserCheck } from "@/utils/api"
import { useEffect, useRef, useState } from "react";
import { getMonthCalendar } from "@/utils/util";

const today = new Date();

type Check = {
    id: string;
    streaming: boolean;
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

export default function Check () {
    const [checkPageData, setCheckPageData] = useState<I_CheckPage>({
        getChecks: [],
    });
    const [checkInput, setCheckInput] = useState<Check | null>(null);
    const passcodeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async function () {
            try {
                const result = await getchecks();
                setCheckPageData(result);
            } catch(e) {
                console.log(e)
            }
        })()
    }, [])

    return (
        <main>
            <table width="500">
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
                                                    { 
                                                        checks && (
                                                            <>
                                                                <div 
                                                                    onClick={() => !checks.userChecks[0].checked && setCheckInput(checks)} 
                                                                    className="absolute text-xs right-0">
                                                                    { checks.streaming ? "直播中" : "直播結束" }
                                                                </div>
                                                                <div key={index} className="absolute text-xs right-0 top-12">
                                                                    {
                                                                        checks.userChecks[0].checked ? '已簽到' : checks.streaming ?  '尚未簽到' : '未簽到'
                                                                    }
                                                                </div> 
                                                            </>
                                                        )
                                                    }
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
            {
                checkInput && <div>
                    <input type="text" className="border border-solid mr-3 border-black" ref={passcodeRef}/>
                    <button className="mr-3" onClick={async () => {
                        const setCheckResult = await setUserCheck(checkInput?.id || "", true, passcodeRef.current?.value || "");
                        alert(setCheckResult.message);
                        if (setCheckResult.status) {
                            const result = await getchecks();
                            setCheckPageData(result);
                            setCheckInput(null);
                        };
                    }}>簽到</button>
                    <button onClick={() => setCheckInput(null)}>取消</button>
                </div>
            }
        </main>
    )
}