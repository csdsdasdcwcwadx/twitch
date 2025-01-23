'use client';

import { getchecks, setUserCheck } from "@/utils/api"
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from '@headlessui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { I_CheckPage, I_Check } from "@/utils/interface";
import CustomDialog from "@/components/common/CustomDialog";

export default function Check () {
    const [checkPageData, setCheckPageData] = useState<I_CheckPage>({
        getChecks: [],
    });
    const [checkInput, setCheckInput] = useState<I_Check | null>(null);
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

    const CalendarEventsData = useMemo(() => {
        const returnData = checkPageData.getChecks.map((check) => {
            const date = new Date(Number(check.created_at));
            const className = ['cursor-pointer'];
            if (!check.streaming) {
                className.push('bg-rose-700');
                className.push('border-rose-700');
            }
            return {
                title: check.userChecks[0] && check.userChecks[0].checked ? "已簽到" : check.streaming ? "開放簽到中" : "簽到結束",
                start: date.toISOString().split("T")[0], // FullCalendar 接受 ISO 格式日期
                extendedProps: check,
                className: className.join(' '),
            };
        });

        return returnData;
    }, [checkPageData])

    return (
        <main>
            <section className="calendar-container w-9/12 m-auto mt-3">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={CalendarEventsData}
                    eventClick={(info) => {
                        const checks = info.event.extendedProps as I_Check;
                        if (!checks) return;
                        if(checks.userChecks[0] && checks.userChecks[0].checked) return;
                        if (!checks.streaming) return;
                        setCheckInput(checks); // 根據需要處理點擊事件
                    }}
                    headerToolbar={{
                        left: '',  // 移除左側按鈕
                        center: 'title',  // 顯示標題
                        right: '',  // 移除右側按鈕
                    }}
                />
            </section>
            <CustomDialog open={Boolean(checkInput)} close={() => setCheckInput(null)} title="請輸入簽到驗證">
                <Input name="full_name" className="mt-5 w-full pl-1.5 border border-solid border-foreground outline-none rounded" ref={passcodeRef} type="text"/>
                <div className="text-center mt-3">
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
            </CustomDialog>
        </main>
    )
}