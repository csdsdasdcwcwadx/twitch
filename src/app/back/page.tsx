'use client';
import { getchecks, setCheckStatus, setcheck } from "@/utils/api"
import { useEffect, useRef, useState, useMemo } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { Input, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

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
    const [openCheckDialog, setOpenCheckDialog] = useState(false);
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

    const checkItem = useMemo(() => {
        return checkPageData.getChecks.find((check: Check) => check.streaming);
    }, [checkPageData])

    const CalendarEventsData = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        let hasToday = false;

        const returnData = checkPageData.getChecks.map((check) => {
            const date = new Date(Number(check.created_at)).toISOString().split("T")[0];
            if (today === date) hasToday = true;
            const className = ['cursor-pointer'];
            if (!check.streaming) {
                className.push('bg-rose-700');
                className.push('border-rose-700');
            }

            return {
                title: check.streaming ? "開放簽到中" : "簽到結束",
                start: date, // FullCalendar 接受 ISO 格式日期
                extendedProps: {
                    clickable: check.streaming
                },
                className: className.join(' '),
            };
        });
        if (!hasToday) returnData.push({
            title: '設定開放簽到',
            start: today,
            extendedProps: {
                clickable: true,
            },
            className: 'cursor-pointer',
        })
        return returnData;
    }, [checkPageData])

    return (
        <div>
            <div className="calendar-container w-9/12 m-auto">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={CalendarEventsData}
                    eventClick={(info) => {
                        const { clickable } = info.event.extendedProps;
                        if (clickable) setOpenCheckDialog(true);
                    }}
                    // dateClick={handleDateClick}
                />
            </div>
            <Dialog open={openCheckDialog} onClose={() => setOpenCheckDialog(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen mr-3 items-center justify-center p-4 bg-black bg-opacity-60">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                        {
                            !checkItem ? <>
                                <DialogTitle className="font-bold text-center">請輸入設定的簽到驗證</DialogTitle>
                                <Input name="full_name" className="pl-1.5 border border-solid border-black outline-none rounded" ref={passcodeRef} type="text"/>
                                <div className="text-center">
                                    <button className="mr-3" onClick={async () => {
                                        const result = await setcheck(passcodeRef.current?.value || "");
                                        if (passcodeRef.current) passcodeRef.current.value = "";
                                        if (result.status) {
                                            const checkResult = await getchecks();
                                            setCheckPageData(checkResult);
                                            setOpenCheckDialog(false);
                                        }
                                    }}>確認</button>
                                    <button onClick={() => setOpenCheckDialog(false)}>取消</button>
                                </div>
                            </> : <>
                                <DialogTitle className="font-bold text-center">結束簽到</DialogTitle>
                                <div className="text-center">
                                    <button className="mr-3" onClick={async () => {
                                            const result = await setCheckStatus(checkItem.id, false);
                                            if (result.status) {
                                                const checkResult = await getchecks();
                                                setCheckPageData(checkResult);
                                                setOpenCheckDialog(false);
                                            }
                                        }}>確認
                                    </button>
                                    <button onClick={() => setOpenCheckDialog(false)}>取消</button>
                                </div>
                            </>
                        }
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}