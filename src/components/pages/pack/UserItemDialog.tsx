import { useState, useMemo, useEffect, Fragment, memo } from "react";
import Image from "next/image";

import { Input, Button } from "@headlessui/react";
import { twitchIconDomain, pagesize } from "@/utils/util";
import { I_Item, I_BackPackPage, I_User } from "@/utils/interface";
import { getbackpacks, addUserItem } from "@/utils/api";

import searchIcon from "@/icon/search.png";
import arrowdownIcon from "@/icon/arrow-down.png";
import arrowupIcon from "@/icon/arrow-up.png";
import plusIcon from "@/icon/plus.png";
import minusIcon from "@/icon/minus.png";

import CustomDialog from "@/components/common/CustomDialog";

interface I_props {
    selectedItem: I_Item | null;
    setSelectedItem: (flag: I_Item | null) => void;
    data: I_BackPackPage;
    setData: (data: I_BackPackPage) => void;
    page: number;
}

function UserItemDialog ({ selectedItem, setSelectedItem, data, setData, page }: I_props) {
    const [query, setQuery] = useState('');
    const [openUser, setOpenUser] = useState<I_User | null>(null);
    const [value, setValue] = useState(0);

    const filterUserCheck = useMemo(() => {
        if (query === "") return data.getAllUsers;
        return data.getAllUsers.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    }, [data, query])

    useEffect(() => {
        if (!selectedItem) {
            setValue(0);
            setOpenUser(null);
        }
    }, [selectedItem])

    const increase = () => setValue((prev) => prev + 1);
    const decrease = () => setValue((prev) => Math.max(0, prev - 1)); // 避免負數

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
            setValue(newValue);
        }
    };

    const currentUserItem = useMemo(() => {
        if (!selectedItem?.userItems) return [];
        return selectedItem?.userItems?.filter(useritem => useritem.user.id === openUser?.id);
    }, [openUser, selectedItem])

    useEffect(() => {
        if (currentUserItem.length && currentUserItem[0].amount) {
            setValue(currentUserItem[0].amount);
        }
    }, [currentUserItem])

    return (
        <CustomDialog open={Boolean(selectedItem)} close={() => setSelectedItem(null)} title="道具設定">
            <section className="mt-5">
                <div className="flex relative">
                    <Image src={searchIcon} alt="search" className="h-5 w-5 absolute left-3"/>
                    <Input
                        placeholder="搜尋持有用戶"
                        onChange={(event) => setQuery(event.target.value)}
                        className="mb-2.5 ml-2.5 pl-7 border-b border-solid border-slate-500 outline-none w-11/12 pb-1"
                    />
                </div>
                <div className="max-h-60 overflow-auto">
                {
                    data.getAllUsers.length ? filterUserCheck.map((user) => {
                        const currentUser = user.id === openUser?.id;

                        return (
                            <Fragment key={user.id}>
                                <aside className="py-2.5 px-3.5 hover:bg-slate-100 rounded flex items-center cursor-pointer relative" onClick={() => {
                                    if (currentUser) setOpenUser(null);
                                    else setOpenUser(user);
                                }}>
                                    <figure className="relative w-9 h-9 mr-2">
                                        <Image src={`${twitchIconDomain}${user.profile_image}`} alt={user.name} sizes="100" fill/>
                                    </figure>
                                    <span>{user.name}</span>
                                    <i className="absolute block w-[20px] h-[20px] right-[30px]">
                                        <Image src={currentUser ? arrowupIcon : arrowdownIcon} alt="arrow-down" className="absolute"/>
                                    </i>
                                </aside>
                                {
                                    currentUser ? <div className="px-3.5 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center">
                                                <i className="block w-[30px] h-[30px] cursor-pointer" onClick={decrease}>
                                                    <Image src={minusIcon} alt="arrow-down" className="absolute"/>
                                                </i>
                                                <Input value={value} type="number" className="text-lg outline-none px-2 border-slate-500 w-[50px] text-center" onChange={handleChange}/>
                                                <i className="block w-[30px] h-[30px] cursor-pointer"  onClick={increase}>
                                                    <Image src={plusIcon} alt="arrow-down" className="absolute"/>
                                                </i>
                                            </div>
                                            <Button onClick={async () => {
                                                const result = await addUserItem(user.id, selectedItem?.id || "", value);
                                                if (result.status) {
                                                    const result = await getbackpacks(page, pagesize);
                                                    setData(result);
                                                    setSelectedItem(null);
                                                }
                                            }} className="m-auto block bg-coverground text-topcovercolor rounded p-[10px] mt-3">送出</Button>
                                        </div>
                                        <div className="mr-5">{`數量 : ${currentUserItem.length && currentUserItem[0].amount}`}</div>
                                    </div> : <></>
                                }
                            </Fragment>
                        )
                    }) : <span className="block text-center mt-2">沒有持有用戶</span>
                }
                </div>
            </section>
        </CustomDialog>
    )
}

export default memo(UserItemDialog);