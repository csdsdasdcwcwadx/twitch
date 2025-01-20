'use client';
import { setCheckStatus, setcheck, getbacks } from "@/utils/api"
import { useEffect, useRef, useState, useMemo } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { Input, Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import { I_CheckPage, I_UserCheck } from "@/utils/interface";
import { Header } from "@/components/common/Header";
import Image from "next/image";
import searchIcon from "@/icon/search.png";
import closeIcon from "@/icon/close.png";

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
        return displayCheckUser.filter(userCheck => userCheck.user.name.toLowerCase().includes(query.toLowerCase()));
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
                        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 w-[500px] relative">
                            <Image className="absolute top-[10px] right-[10px] cursor-pointer" src={closeIcon} alt="close" onClick={() => setOpenCheckDialog(false)}/>
                            {
                                showCheckInfo && (
                                    <>
                                        <DialogTitle className="font-bold text-center text-xl">{!checkItem ? '請輸入設定的簽到驗證' : '結束簽到'}</DialogTitle>
                                        {!checkItem && <Input name="full_name" className="pl-1.5 border border-solid border-black outline-none rounded" ref={passcodeRef} type="text"/> }
                                        <div className="text-center">
                                            <Button className="text-white rounded-md py-2.5 px-5 bg-gray-700" onClick={async () => {
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
                                            }}>確認結束簽到</Button>
                                        </div>
                                    </>
                                )
                            }
                            {
                               displayCheckUser.length ? (
                                    <section className="">
                                        <div className="flex relative">
                                            <Image src={searchIcon} alt="search" className="h-5 w-5 absolute left-3 bottom-4"/>
                                            <Input
                                                placeholder="搜尋簽到用戶"
                                                onChange={(event) => setQuery(event.target.value)}
                                                className="mb-2.5 ml-2.5 pl-7 border-b border-solid border-slate-500 outline-none w-11/12 pb-1"
                                            />
                                        </div>
                                        <div className="max-h-60 overflow-auto">
                                        {
                                            filterUserCheck.map((userCheck) => (
                                                <aside key={userCheck.user.id} className="py-2.5 px-3.5 hover:bg-slate-100 rounded flex items-center cursor-auto">
                                                    <figure className="relative w-9 h-9 mr-2">
                                                        <Image src={`https://static-cdn.jtvnw.net${userCheck.user.profile_image}`} alt={userCheck.user.name} sizes="100" fill/>
                                                    </figure>
                                                    <span>{userCheck.user.name}</span>
                                                </aside>
                                            ))
                                        }
                                        </div>
                                    </section>
                               ) : ""
                            }
                        </DialogPanel>
                    </div>
                </Dialog>
            </main>
        </>
    )
}