"use client";

import { setCheckStatus, setcheck, getchecks } from "@/utils/api"
import { useState, useMemo } from "react";
import { Input } from '@headlessui/react';
import { I_CheckPage, I_UserCheck } from "@/utils/interface";
import Image from "next/image";
import searchIcon from "@/icon/search.png";
import { twitchIconDomain, setMonth } from "@/utils/util";
import CustomDialog from "@/components/common/CustomDialog";
import CustomButton from "@/components/common/CustomButton";
import CalendarTool from "@/components/pages/check/CalendarTool";
import InputBox, { E_RegexType } from "@/components/common/InputBox";
import Inform from "@/components/pages/check/Inform";

interface I_props {
    checkData: I_CheckPage;
}

export default function Check({ checkData }: I_props) {
    const [checkPageData, setCheckPageData] = useState<I_CheckPage>(checkData);
    const [openCheckDialog, setOpenCheckDialog] = useState(false);
    const [showCheckInfo, setShowCheckInfo] = useState(true);
    const [displayCheckUser, setDisplayCheckUser] = useState<I_UserCheck[]>([]);
    const [passcode, setPasscode] = useState("");
    const [query, setQuery] = useState('');

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
        <main>
            <div className="flex justify-center mobile:flex-col">
                <Inform/>
                <CalendarTool
                    onEventClick={info => {
                        const { show } = info.event.extendedProps;
                        const userChecks = info.event.extendedProps.userChecks as I_UserCheck[];
                        setOpenCheckDialog(true);
                        setShowCheckInfo(show);
                        setDisplayCheckUser(userChecks);
                    }}
                    events={CalendarEventsData}
                    onDatesSet={async (arg) => {
                        const title = arg.view.title;
                        const year = title.split(" ")[1];
                        const month = setMonth(title.split(" ")[0]);

                        const result = await getchecks(year, month);
                        if (result.payload) setCheckPageData(result.payload);
                    }}
                    className="m-10"
                />
            </div>
            <CustomDialog open={openCheckDialog} close={setOpenCheckDialog} title={!checkItem ? "請輸入設定的簽到驗證" : ""}>
                {
                    showCheckInfo && (
                        <>
                            {!checkItem && <InputBox title="" placeholder="" type={E_RegexType.NAME} maxlength={10} onChange={setPasscode}/>}
                            <div className="text-center mt-3">
                                <CustomButton onClick={async () => {
                                    if (!checkItem) {
                                        const result = await setcheck(passcode);
                                        if (result.status) {
                                            const checkResult = await getchecks();
                                            if (checkResult.payload) setCheckPageData(checkResult.payload);
                                            setOpenCheckDialog(false);
                                        }
                                    } else {
                                        const result = await setCheckStatus(checkItem.id, false);
                                        if (result.status) {
                                            const checkResult = await getchecks();
                                            if (checkResult.payload) setCheckPageData(checkResult.payload);
                                            setOpenCheckDialog(false);
                                        }
                                    }
                                }} text={!checkItem ? "設定簽到" : "結束簽到"}/>
                            </div>
                        </>
                    )
                }
                <section>
                    <div className="flex relative">
                        <Image src={searchIcon} alt="search" className="h-5 w-5 absolute left-3"/>
                        <Input
                            placeholder="搜尋簽到用戶"
                            onChange={(event) => setQuery(event.target.value)}
                            className="mb-2.5 ml-2.5 pl-7 border-b border-solid border-slate-500 outline-none w-11/12 pb-1 bg-white"
                        />
                    </div>
                    <div className="max-h-60 overflow-auto">
                    {
                        displayCheckUser.length ? filterUserCheck.map((userCheck) => (
                            <aside key={userCheck.user.id} className="py-2.5 px-3.5 hover:bg-slate-100 rounded flex items-center cursor-auto">
                                <figure className="relative w-9 h-9 mr-2">
                                    <Image src={`${twitchIconDomain}${userCheck.user.profile_image}`} alt={userCheck.user.name} sizes="100" fill/>
                                </figure>
                                <span>{userCheck.user.name}</span>
                            </aside>
                        )) : <span className="block text-center mt-2">沒有簽到用戶</span>
                    }
                    </div>
                </section>
            </CustomDialog>
        </main>
    )
}