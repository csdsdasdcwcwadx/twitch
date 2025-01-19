import Image from "next/image";
import twitchIcon from "@/icon/twitch.png";
import { I_User } from "@/utils/interface";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Fragment } from "react";
import { logout } from "@/utils/api";

interface I_props {
    userinfo?: I_User
}

const displayItems = [
    {type: "pack", text: "前往背包", icon: ""},
    {type: "logout", text: "登出", icon: ""},
]

export function Header({ userinfo }: I_props) {
    return (
        <header className="h-20 flex items-center justify-between mx-2.5">
            {
                userinfo && (
                    <>
                        <figure className="h-16 w-16 cursor-pointer transform">
                            <Image src={twitchIcon} alt="twitch"/>
                        </figure>
                        <div className="flex items-center mr-7">
                            <Menu>
                                <figcaption className="mr-3">{userinfo.name}，您好</figcaption>
                                <MenuButton>
                                    <figure className="h-16 relative w-16 cursor-pointer">
                                        <Image src={`https://static-cdn.jtvnw.net${userinfo.profile_image}`} alt={userinfo.name}  sizes="100" fill/>
                                    </figure>
                                </MenuButton>
                                <MenuItems anchor="bottom end" className="text-center bg-gray-700 mt-1 rounded-lg p-2 z-10">
                                    {
                                        displayItems.map((item, ind) => {
                                            return (
                                                <Fragment key={item.text}>
                                                    <MenuItem>
                                                        <div 
                                                            className="py-2.5 px-3.5 text-slate-200 cursor-pointer hover:bg-gray-500 rounded-lg"
                                                            onClick={async () => {
                                                                switch(item.type) {
                                                                    case "pack":
                                                                        break;
                                                                    case "logout":
                                                                        const result = await logout();
                                                                        if (result.status) {
                                                                            window.location.href = result.href;
                                                                        }
                                                                        break;
                                                                }
                                                            }}
                                                        >
                                                            {item.text}
                                                        </div>
                                                    </MenuItem>
                                                    {
                                                        displayItems.length - 1 !== ind && <i className="my-2 h-px bg-white/5 border-b block"/>
                                                    }
                                                </Fragment>
                                            )
                                        })
                                    }
                                </MenuItems>
                            </Menu>
                        </div>
                    </>
                )
            }
        </header>
    )
}