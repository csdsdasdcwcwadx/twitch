"use client";

import { getchecks, setUserCheck } from "@/utils/api"
import { useMemo, useState } from "react";
import { Button } from '@headlessui/react';
import { I_CheckPage, I_Check } from "@/utils/interface";
import CustomDialog from "@/components/common/CustomDialog";
import { setMonth } from "@/utils/util";
import CalendarTool from "./CalendarTool";
import InputBox, { E_RegexType } from "@/components/common/InputBox";

interface I_props {
    checkData: I_CheckPage;
}

export default function Check ({ checkData }: I_props) {
    const [checkPageData, setCheckPageData] = useState<I_CheckPage>(checkData);
    const [checkInput, setCheckInput] = useState<I_Check | null>(null);
    const [passcode, setPasscode] = useState("");

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
            <h2 className="text-center text-fontColor mt-10 text-7xl tracking-[]">天天打卡送</h2>
            <CalendarTool
                onEventClick={info => {
                    const checks = info.event.extendedProps as I_Check;
                    if (!checks) return;
                    if(checks.userChecks[0] && checks.userChecks[0].checked) return;
                    if (!checks.streaming) return;
                    setCheckInput(checks); // 根據需要處理點擊事件
                }}
                onDatesSet={async (arg) => {
                    const title = arg.view.title;
                    const year = title.split(" ")[1];
                    const month = setMonth(title.split(" ")[0]);

                    const result = await getchecks(year, month);
                    if (result.payload) setCheckPageData(result.payload);
                }}
                events={CalendarEventsData}
            />
            <CustomDialog open={Boolean(checkInput)} close={() => setCheckInput(null)} title="請輸入簽到驗證">
                <InputBox title="" placeholder="" type={E_RegexType.NAME} maxlength={10} onChange={setPasscode}/>
                <div className="text-center mt-3">
                    <Button className="mr-3" onClick={async () => {
                        const setCheckResult = await setUserCheck(checkInput?.id || "", true, passcode);
                        alert(setCheckResult.message);
                        if (setCheckResult.status) {
                            const result = await getchecks();
                            if (result.payload) setCheckPageData(result.payload);
                            setCheckInput(null);
                        };
                    }}>簽到</Button>
                    <Button onClick={() => setCheckInput(null)}>取消</Button>
                </div>
            </CustomDialog>
        </main>
    )
}