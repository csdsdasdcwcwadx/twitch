'use client';

import { memo, useEffect, useState } from "react"
import { initOpaySocket } from "@/utils/util";
import Image from "next/image";
import headIcon from "@/icon/head.gif";
import { io } from "socket.io-client";

interface I_WSMessage {
    DonateNickName: string;
    DonateAmount: string;
    DonateMsg: string;
}

let timer: NodeJS.Timeout | null = null;
function Display() {
    const [message, setMessage] = useState<I_WSMessage | null>(null);

    useEffect(() => {
        const alertSocket = io(`http://localhost:4000/socket/alert`); // 需要再修改
        const opaySocket = initOpaySocket(
            "https://socket.opay.tw/web/live/C4DB659FF82BAB591BA43075C2A5B0D7",
            "/web/live/C4DB659FF82BAB591BA43075C2A5B0D7",
        );
        opaySocket.on("notify", (message) => {
            console.log(message);
        });
        alertSocket.on("notify", (data) => {
        //     const message = JSON.parse(event.data) as I_WSMessage;
            if (timer) clearTimeout(timer);

        //     setMessage(message)
            timer = setTimeout(() => {
                setMessage(null);
            }, 10000)
            console.log("🚨 Alert:", data);
        });

        return () => {
            opaySocket.disconnect();
            alertSocket.disconnect();
        }
    }, [])
    
    return (
        <div id="divAlert" className="font-[Open_Sans] relative text-center">
            <div id="wrap" className={`table m-auto${message ? '' : ' hidden'}`}>
                <div className="table-row">
                    <Image src={headIcon} alt="donate" className="m-auto"/>
                </div>
                <div className="table-row">
                    <div className="table-cell p-5 text-center">
                        <div id="divAlertMsg" className="text-[50px] font-extrabold text-[#d48e26] text-center">
                            非常感謝
                            <span className="highlight">
                            {
                                message?.DonateNickName.split('').map((word, index) => {
                                    return <span key={index} className="animated-letter wiggle text-[#32C3A6]">{word}</span>
                                })
                            }
                            </span>
                            贊助 
                            <span className="highlight">
                            {
                                message?.DonateAmount.split('').map((word, index) => {
                                    return <span key={index} className="animated-letter wiggle text-[#32C3A6]">{word}</span>
                                })
                            }
                            </span> 元!!
                        </div>
                        <div id="divUserMsg" className="text-[32px] font-semibold text-[#d0d426] text-center break-words text-[#d0d426]">
                            {message?.DonateMsg}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Display);