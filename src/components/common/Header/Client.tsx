"use client";

import { memo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation'
import twitchIcon from "@/icon/twitch.png";
import { I_User } from "@/utils/interface";
import { Menu, MenuButton, MenuItem, MenuItems, Dialog, DialogPanel } from '@headlessui/react'
import { Fragment, useState, useEffect } from "react";
import { domainEnv, twitchIconDomain } from "@/utils/util";
import { useUserStore } from "@/stores/userStore";

interface I_MobileDialogProps {
    menuOpen: boolean;
    setMenuOpen: (param: boolean) => void;
    handleItemsClick: (item: { type: string, text: string, icon: string }) => void;
    userinfo?: I_User;
}

interface I_MenuAllItemsProps {
    handleItemsClick: (item: { type: string, text: string, icon: string }) => void;
}

interface I_props {
    userinfo: I_User;
}

const displayItems = [
    {type: "check", text: "前往簽到頁", icon: ""},
    {type: "pack", text: "前往背包", icon: ""},
    {type: "exchange", text: "前往禮品兌換頁", icon: ""},
    {type: "logout", text: "登出", icon: ""},
]

function Client ({userinfo}: I_props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const setUser = useUserStore((state) => state.setUser);

    const handleItemsClick = (item: { type: string, text: string, icon: string }) => {
        const currentpage = pathname.split('/');
        const prefix = currentpage.length > 2 ? `/${currentpage[1]}` : '';
        switch(item.type) {
            case "exchange":
                router.push(`${prefix}/exchange`);
                break;
            case "pack":
                router.push(`${prefix}/pack`);
                break;
            case "logout":
                window.location.href = `${domainEnv}/member/logout`;
                break;
            case "check":
                router.push(`${prefix}/check`);
                break;
        }
        setMenuOpen(false);
    }

    useEffect(() => {
        setUser(userinfo);
    }, [setUser, userinfo])

    return (
        <>
            <header className="h-20 flex items-center justify-between mx-2.5 mobile:justify-center">
                {
                    userinfo && (
                        <>
                            <figure className="h-16 w-16 cursor-pointer transform mobile:hidden">
                                <Image src={twitchIcon} alt="twitch"/>
                            </figure>
                            <div className="flex items-center pc:mr-7">
                                <Menu>
                                    <figcaption className="mr-3 mobile:hidden">{userinfo.name}，您好</figcaption>
                                    <MenuButton>
                                        <figure className="h-16 relative w-16 cursor-pointer" onClick={() => setMenuOpen(true)}>
                                            <Image 
                                                src={`${twitchIconDomain}${userinfo.profile_image}`} 
                                                alt={userinfo.name} 
                                                sizes="100" 
                                                fill
                                            />
                                        </figure>
                                    </MenuButton>
                                    <MenuAllItems handleItemsClick={handleItemsClick}/>
                                </Menu>
                            </div>
                        </>
                    )
                }
            </header>
            <MobileDialog menuOpen={menuOpen} setMenuOpen={setMenuOpen} userinfo={userinfo} handleItemsClick={handleItemsClick}/>
        </>
    )
}

export default memo(Client);

function MobileDialog({ menuOpen, setMenuOpen, userinfo, handleItemsClick }: I_MobileDialogProps) {
    return <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} className="pc:hidden">
        <div className="fixed inset-0 flex w-screen mr-3 items-center justify-center bg-black bg-opacity-60 z-10 overflow-y-auto overflow-x-hidden">
            <DialogPanel className={`w-screen w-[500px] absolute top-0 left-0 bg-coverground h-[50%] animate-expand`}>
                {
                    userinfo && (
                        <div className="flex ml-5">
                            <figure className="h-16 relative w-16 cursor-pointer">
                                <Image src={twitchIcon} alt="twitch" sizes="100" fill/>
                            </figure>
                            <h2 className="text-topcovercolor p-5 text-2xl">{userinfo.name}，您好</h2>
                        </div>
                    )
                }
                <ul className="overflow-auto h-[70%] scrollbar">
                {
                    displayItems.map((item, index) => {
                        return (
                            <Fragment key={item.text}>
                                <li className="list-none py-3 px-10 text-topcovercolor cursor-pointer hover:bg-hoverground" onClick={async () => handleItemsClick(item)}>
                                    {item.text}
                                </li>
                                {
                                    displayItems.length - 1 !== index && <i className="w-[95%] m-auto h-px border-topcovercolor border-b block"/>
                                }
                            </Fragment>
                        )
                    })
                }
                </ul>
            </DialogPanel>
        </div>
    </Dialog>
}

function MenuAllItems({ handleItemsClick }: I_MenuAllItemsProps) {
    return <MenuItems anchor="bottom end" className="mobile:hidden text-center bg-coverground mt-1 rounded-lg p-2 z-10 w-32">
        {
            displayItems.map((item, ind) => {
                return (
                    <Fragment key={item.text}>
                        <MenuItem>
                            <li 
                                className="list-none py-2.5 px-3.5 text-topcovercolor cursor-pointer hover:bg-hoverground rounded-lg"
                                onClick={() => handleItemsClick(item)}
                            >
                                {item.text}
                            </li>
                        </MenuItem>
                        {
                            displayItems.length - 1 !== ind && <i className="my-2 h-px bg-topcovercolor border-b block"/>
                        }
                    </Fragment>
                )
            })
        }
    </MenuItems>
}