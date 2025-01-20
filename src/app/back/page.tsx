'use client';
import { setCheckStatus, setcheck, getbacks } from "@/utils/api"
import { useEffect, useRef, useState, useMemo } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { Input, Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import { I_CheckPage, I_UserCheck } from "@/utils/interface";
import { Header } from "@/components/common/Header";

export default function Back() {
    const [checkPageData, setCheckPageData] = useState<I_CheckPage>({
        getChecks: [],
        getUsers: null,
    });
    const [openCheckDialog, setOpenCheckDialog] = useState(false);
    const [showCheckInfo, setShowCheckInfo] = useState(true);
    const [displayCheckUser, setDisplayCheckUser] = useState<I_UserCheck[]>([]);
    const passcodeRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        (async function () {
            try {
                const result = await getbacks();
                setCheckPageData(result);
            } catch(e) {
                console.log(e)
            }
        })()
    }, [])

    const checkItem = useMemo(() => {
        return checkPageData.getChecks.find((check) => check.streaming);
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
                    show: check.streaming,
                    userChecks: check.userChecks,
                },
                className: className.join(' '),
            };
        });
        if (!hasToday) returnData.push({
            title: '設定開放簽到',
            start: today,
            extendedProps: {
                show: true,
                userChecks: [],
            },
            className: 'cursor-pointer',
        })
        return returnData;
    }, [checkPageData])

    const filterUserCheck = useMemo(() => {
        if (query === "") return displayCheckUser;
        return displayCheckUser.filter(userCheck => userCheck.user.name.includes(query))
    }, [displayCheckUser, query])

    return (
        <>
            <Header userinfo={checkPageData.getUsers!}/>
            <main>
                <section className="calendar-container w-9/12 m-auto">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={CalendarEventsData}
                        eventClick={(info) => {
                            const { show } = info.event.extendedProps;
                            const userChecks = info.event.extendedProps.userChecks as I_UserCheck[];
                            setOpenCheckDialog(true);
                            setShowCheckInfo(show);
                            setDisplayCheckUser(userChecks);
                        }}
                    />
                </section>
                <Dialog open={openCheckDialog} onClose={() => setOpenCheckDialog(false)} className="relative z-50">
                    <div className="fixed inset-0 flex w-screen mr-3 items-center justify-center p-4 bg-black bg-opacity-60">
                        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                            {
                                showCheckInfo && (
                                    <>
                                        <DialogTitle className="font-bold text-center">{!checkItem ? '請輸入設定的簽到驗證' : '結束簽到'}</DialogTitle>
                                        {!checkItem && <Input name="full_name" className="pl-1.5 border border-solid border-black outline-none rounded" ref={passcodeRef} type="text"/> }
                                        <div className="text-center">
                                            <Button className="mr-3" onClick={async () => {
                                                if (!checkItem) {
                                                    const result = await setcheck(passcodeRef.current?.value || "");
                                                    if (passcodeRef.current) passcodeRef.current.value = "";
                                                    if (result.status) {
                                                        const checkResult = await getbacks();
                                                        setCheckPageData(checkResult);
                                                        setOpenCheckDialog(false);
                                                    }
                                                } else {
                                                    const result = await setCheckStatus(checkItem.id, false);
                                                    if (result.status) {
                                                        const checkResult = await getbacks();
                                                        setCheckPageData(checkResult);
                                                        setOpenCheckDialog(false);
                                                    }
                                                }
                                            }}>確認</Button>
                                            <Button onClick={() => setOpenCheckDialog(false)}>取消</Button>
                                        </div>
                                    </>
                                )
                            }
                            {
                               displayCheckUser.length && (
                                    <section>
                                        <Input onChange={(event) => setQuery(event.target.value)} className="pl-1.5 border-b border-solid border-black outline-none"/>
                                        {
                                            filterUserCheck.map((userCheck) => (
                                                <option key={userCheck.user.id} className="py-2.5 px-3.5 text-slate-200 hover:bg-gray-500 rounded-lg">
                                                    {userCheck.user.name}
                                                </option>
                                            ))
                                        }
                                    </section>
                               )
                            }
                        </DialogPanel>
                    </div>
                </Dialog>
            </main>
        </>
    )
}