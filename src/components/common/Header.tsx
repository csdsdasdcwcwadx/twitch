"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation'
import twitchIcon from "@/icon/twitch.png";
import { I_User } from "@/utils/interface";
import { Menu, MenuButton, MenuItem, MenuItems, Dialog, DialogPanel } from '@headlessui/react'
import { Fragment, useState } from "react";
import { domainEnv, twitchIconDomain } from "@/utils/util";

interface I_props {
    userinfo?: I_User
}

interface I_MobileDialogProps {
    menuOpen: boolean;
    setMenuOpen: (param: boolean) => void;
    userinfo?: I_User;
}

const displayItems = [
    {type: "pack", text: "前往背包", icon: ""},
    {type: "logout", text: "登出", icon: ""},
    {type: "logout", text: "功能1", icon: ""},
    {type: "logout", text: "功能2", icon: ""},
]

export function Header({ userinfo }: I_props) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="h-20 flex items-center justify-between mx-2.5 mobile:justify-center">
                {
                    userinfo && (
                        <>
                            <figure className="h-16 w-16 cursor-pointer transform">
                                <Image src={twitchIcon} alt="twitch" onClick={() => setMenuOpen(true)}/>
                            </figure>
                            <div className="flex items-center mr-7 mobile:hidden">
                                <Menu>
                                    <figcaption className="mr-3 mobile:hidden">{userinfo.name}，您好</figcaption>
                                    <MenuButton>
                                        <figure className="h-16 relative w-16 cursor-pointer">
                                            <Image 
                                                src={`${twitchIconDomain}${userinfo.profile_image}`} 
                                                alt={userinfo.name} 
                                                sizes="100" 
                                                fill
                                            />
                                        </figure>
                                    </MenuButton>
                                    <MenuAllItems/>
                                </Menu>
                            </div>
                        </>
                    )
                }
            </header>
            <MobileDialog menuOpen={menuOpen} setMenuOpen={setMenuOpen} userinfo={userinfo}/>
        </>
    )
}

function MobileDialog({menuOpen, setMenuOpen, userinfo}: I_MobileDialogProps) {
    const router = useRouter();
    const handleItemsClick = (item: { type: string, text: string, icon: string }) => {
        switch(item.type) {
            case "pack":
                router.push('/pack');
                break;
            case "logout":
                window.location.href = `${domainEnv}/twitch/member/logout`;
                break;
        }
    }

    return <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} className="pc:hidden">
        <div className="fixed inset-0 flex w-screen mr-3 items-center justify-center bg-black bg-opacity-60 z-10 overflow-y-auto overflow-x-hidden">
            <DialogPanel className={`w-screen w-[500px] absolute top-0 left-0 bg-coverground h-[50%] animate-expand`}>
                {
                    userinfo && (
                        <div className="flex ml-5">
                            <figure className="h-16 relative w-16 cursor-pointer">
                                <Image 
                                    src={`https://static-cdn.jtvnw.net${userinfo.profile_image}`} 
                                    alt={userinfo.name} 
                                    sizes="100" 
                                    fill
                                />
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

function MenuAllItems() {
    const router = useRouter();
    const handleItemsClick = (item: { type: string, text: string, icon: string }) => {
        switch(item.type) {
            case "pack":
                router.push('/pack');
                break;
            case "logout":
                window.location.href = `${domainEnv}/twitch/member/logout`;
                break;
        }
    }
    
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