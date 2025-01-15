'use client';

import { getchecks, setUserCheck } from "@/utils/api"
import { useEffect, useState } from "react";
import { getMonthCalendar } from "@/utils/util";

const today = new Date();

type Check = {
    id: string;
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

export default function Check () {
    const [currData, setCurrData] = useState<I_CheckPage>({
        getChecks: [],
    });

    useEffect(() => {
        (async function () {
            try {
                const result = await getchecks();
                setCurrData(result);
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
                                            const checks = currData.getChecks.find(check => {
                                                const currentDay = new Date(Number(check.created_at)).getDate();
                                                return `${currentDay}` === day;
                                            })
                                            return (
                                                <td key={`${weekIndex}${index}`} className="text-right cursor-pointer py-2 align-top h-20 relative">
                                                    <div>{day}</div>
                                                    { 
                                                        checks && <div onClick={async () => {
                                                            await setUserCheck(checks.id, true);
                                                        }} className="absolute text-xs right-0">直播</div> 
                                                    }
                                                    {
                                                        checks && (checks.userChecks.length ? checks.userChecks.map((check, index) => {
                                                            return (
                                                                <div key={index} className="absolute text-xs right-0 top-12">
                                                                    {
                                                                        check.checked ? '已簽到' : '尚未簽到'
                                                                    }
                                                                </div>
                                                            )
                                                        }) : <div className="absolute text-xs right-0 top-12">尚未簽到</div>)
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
        </main>
    )
}