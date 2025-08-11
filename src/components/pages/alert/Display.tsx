'use client';

import { memo, useEffect, useState } from "react"
import { domainEnv } from "@/utils/util";
import Image from "next/image";
import D01icon from "@/icon/D01.gif";

interface I_WSMessage {
    DonateNickName: string;
    DonateAmount: string;
    DonateMsg: string;
}

let timer: NodeJS.Timeout | null = null;
function Display() {
    const [message, setMessage] = useState<I_WSMessage | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${domainEnv}/socket/alert`);
        ws.onopen = () => console.log("連線成功");
        ws.onclose = () => console.log("關閉連線");
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data) as I_WSMessage;
            if (timer) clearTimeout(timer);

            setMessage(message)
            timer = setTimeout(() => {
                setMessage(null);
            }, 5000)
        };

        return () => {
            ws.close();
        }
    }, [])
    
    return (
        <div id="divAlert" className="font-[Open_Sans] relative text-center">
            <div id="wrap" className={`table m-auto${message ? '' : ' hidden'}`}>
                <div className="table-row">
                    <Image src={D01icon} alt="donate" className="m-auto"/>
                </div>
                <div className="table-row">
                    <div className="table-cell p-5 text-center">
                        <div id="divAlertMsg" className="text-[50px] font-extrabold text-[#d48e26] text-center">
                            非常感謝
                            <span className="highlight">
                            {
                                message?.DonateNickName.split('').map((word, index) => {
                                    return <span key={index} className="animated-letter wiggle">{word}</span>
                                })
                            }
                            </span>
                            贊助 
                            <span className="highlight">
                            {
                                message?.DonateAmount.split('').map((word, index) => {
                                    return <span key={index} className="animated-letter wiggle">{word}</span>
                                })
                            }
                            </span> 元!!
                        </div>
                        <div id="divUserMsg" className="text-[28px] font-semibold text-[#d0d426] text-center break-words">
                            {message?.DonateMsg}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Display);