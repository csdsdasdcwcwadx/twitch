'use client';

import { memo, useEffect, useState, useRef} from "react"
import { initOpaySocket } from "@/utils/util";
import Image from "next/image";
import headIcon from "@/icon/head.gif";
import { io } from "socket.io-client";

interface I_WSMessage {
    DonateNickName: string;
    DonateAmount: string;
    DonateMsg: string;
    sound?: string;
}

function Display() {
    const [message, setMessage] = useState<I_WSMessage | null>(null);
    const [messageQueue, setMessageQueue] = useState<I_WSMessage[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const event = {
            "data": {
                "lstDonate": [
                    {
                        "donateid": "14012074",
                        "name": "XXX",
                        "amount": 100,
                        "msg": "這是一筆贊助測試～"
                    }
                ],
                "settings": {
                    "BgColor": "#FFFFFF",
                    "FontAnimate": "Wobble",
                    "MsgTemplate": "&#22909;&#38283;&#21235; &#35613;&#35613; {name} wow {amount} !!",
                    "AlertSound": "/Upload/Broadcaster/2205931/alertSound_20210626122807.mp3",
                    "AlertSec": 15,
                    "AlertStyle": 0,
                    "TTSStatus": 1,
                    "TTSVolume": 34,
                    "AlertSoundVolume": 31,
                    "FontSize": 32
                }
            }
        }
        const alertSocket = io(`http://localhost:4000/socket/alert`); // 需要再修改
        const opaySocket = initOpaySocket(
            "https://socket.opay.tw/web/live/C4DB659FF82BAB591BA43075C2A5B0D7",
            "/web/live/C4DB659FF82BAB591BA43075C2A5B0D7",
        );
        opaySocket.on("notify", () => {
            for (let i = 0; i < event.data.lstDonate.length; i++) {
                const currentContent = event.data.lstDonate[i];
                const message = {
                    DonateNickName: currentContent.name,
                    DonateAmount: currentContent.amount.toString(),
                    DonateMsg: currentContent.msg,
                    sound: event.data.settings.AlertSound,
                }
                setMessageQueue(queue => [...queue, message]);
            }
        });
        alertSocket.on("notify", (event) => {
            const message = JSON.parse(event.data) as I_WSMessage;
            setMessageQueue(queue => [...queue, message]);
        });

        return () => {
            opaySocket.disconnect();
            alertSocket.disconnect();
        }
    }, [])

    useEffect(() => {
        if (!timerRef.current && messageQueue.length > 0) {
            timerRef.current = setTimeout(() => {
                setMessageQueue(prevQueue => {
                    if (prevQueue.length === 0) return prevQueue;
                    const [first, ...rest] = prevQueue;
                    setMessage(first);
                    timerRef.current = null;
                    return rest;
                })
            }, 5000);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, [messageQueue])
    
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