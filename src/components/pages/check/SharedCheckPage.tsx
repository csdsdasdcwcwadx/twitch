"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Input } from '@headlessui/react';
// import QRCode from 'qrcode';

import searchIcon from "@/icon/search.png";
import { twitchIconDomain, setMonth } from "@/utils/util";
import { I_CheckPage, I_UserCheck, I_Check } from "@/utils/interface";
import { setCheckStatus, setcheck, getchecks, setUserCheck, createOrder } from "@/utils/api";

import CustomDialog from "@/components/common/CustomDialog";
import CustomButton from "@/components/common/CustomButton";
import CommonPage from "@/components/common/CommonPage";
import CalendarTool from "@/components/pages/check/CalendarTool";
import InputBox, { E_RegexType } from "@/components/common/InputBox";
import Inform from "@/components/pages/check/Inform";

interface I_props {
    checkData: I_CheckPage;
    isAdmin: boolean;
}

export default function SharedTemplate({ checkData, isAdmin = false }: I_props) {
    const [checkPageData, setCheckPageData] = useState<I_CheckPage>(checkData);
    const [openCheckDialog, setOpenCheckDialog] = useState(false);
    const [showCheckInfo, setShowCheckInfo] = useState(true);
    const [displayCheckUser, setDisplayCheckUser] = useState<I_UserCheck[]>([]);
    const [passcode, setPasscode] = useState("");
    const [query, setQuery] = useState('');
    const [checkInput, setCheckInput] = useState<I_Check | null>(null);

    const CalendarEventsData = useMemo(() => {
        const today = new Date().toISOString().split("T")[0];
        let isTodayChecking = false;

        if (isAdmin) {
            const returnData = checkPageData.getChecks.map((check) => {
                const date = new Date(Number(check.created_at)).toISOString().split("T")[0];
                if (today === date && check.streaming) isTodayChecking = true;
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
            if (!isTodayChecking) returnData.push({
                title: '設定開放簽到',
                start: today,
                extendedProps: {
                    show: true,
                    userChecks: [],
                },
                className: 'cursor-pointer',
            });
            return returnData;
        } else {
            return checkPageData.getChecks.map((check) => {
                const date = new Date(Number(check.created_at));
                const className = ['cursor-pointer'];
                if (!check.streaming) {
                    className.push('bg-rose-700');
                    className.push('border-rose-700');
                }
                return {
                    title: check.userChecks[0] && check.userChecks[0].checked ? "已簽到" : check.streaming ? "開放簽到中" : "簽到結束",
                    start: date.toISOString().split("T")[0], // FullCalendar 接受 ISO 格式日期
                    extendedProps: {
                        check,
                    },
                    className: className.join(' '),
                };
            });
        }
    }, [checkPageData, isAdmin])

    const checkItem = useMemo(() => {
        return checkPageData.getChecks.find((check) => check.streaming);
    }, [checkPageData])

    const filterUserCheck = useMemo(() => {
        if (query === "") return displayCheckUser;
        return displayCheckUser.filter(userCheck => userCheck.user.name.toLowerCase().includes(query.toLowerCase()));
    }, [displayCheckUser, query])

    return (
        <CommonPage>
            <button onClick={async () => {
                const formHtml = await createOrder();
                const container = document.createElement('div');
                container.innerHTML = formHtml;
                document.body.appendChild(container);
                const form = document.getElementById('_form_aiochk') as HTMLFormElement;
                form.submit();
            }}>
                點我
            </button>
            <div className="flex justify-center mobile:flex-col">
                <Inform/>
                <CalendarTool
                    onEventClick={info => {
                        if (isAdmin) {
                            const { show } = info.event.extendedProps;
                            const userChecks = info.event.extendedProps.userChecks as I_UserCheck[];
                            setOpenCheckDialog(true);
                            setShowCheckInfo(show);
                            setDisplayCheckUser(userChecks);
                        }

                        if (!isAdmin) {
                            const checks = info.event.extendedProps as I_Check;
                            if (!checks) return;
                            if (!checks.userChecks) return;
                            if(checks.userChecks[0] && checks.userChecks[0].checked) return;
                            if (!checks.streaming) return;
                            setCheckInput(checks); // 根據需要處理點擊事件
                        }
                    }}
                    onDatesSet={async (arg) => {
                        const title = arg.view.title;
                        const year = title.split(" ")[1];
                        const month = setMonth(title.split(" ")[0]);

                        const result = await getchecks(year, month);
                        if (result.payload) setCheckPageData(result.payload);
                    }}
                    events={CalendarEventsData}
                    className="m-10 flex-[1]"
                />
            </div>
            {
                isAdmin ? <CustomDialog open={openCheckDialog} close={setOpenCheckDialog} title={!checkItem ? "請輸入設定的簽到驗證" : ""}>
                    {
                        showCheckInfo && (
                            <>
                                {!checkItem && <InputBox title="" placeholder="" type={E_RegexType.NAME} maxlength={10} onChange={setPasscode}/>}
                                <div className="text-center mt-3">
                                    <CustomButton 
                                        onClick={async () => {
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
                                        }}
                                        text={!checkItem ? "設定簽到" : "結束簽到"}
                                    />
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
                </CustomDialog> : <CustomDialog open={Boolean(checkInput)} close={() => setCheckInput(null)} title="請輸入簽到驗證">
                    <InputBox title="" placeholder="" type={E_RegexType.NAME} maxlength={10} onChange={setPasscode}/>
                    <div className="text-center mt-3">
                        <CustomButton
                            className="mr-3"
                            text="簽到"
                            onClick={async () => {
                                const setCheckResult = await setUserCheck(checkInput?.id || "", true, passcode);
                                alert(setCheckResult.message);
                                if (setCheckResult.status) {
                                    const result = await getchecks();
                                    if (result.payload) setCheckPageData(result.payload);
                                    setCheckInput(null);
                                };
                            }}
                        />
                        <CustomButton 
                            onClick={() => setCheckInput(null)}
                            text="取消"
                        />
                    </div>
                </CustomDialog>
            }
        </CommonPage>
    )
}
