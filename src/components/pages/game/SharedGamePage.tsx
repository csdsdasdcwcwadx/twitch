'use client';

import { useEffect, useState } from "react";
import { domainEnv } from "@/utils/util";
import { E_WS_Type, I_WS_Data } from "@/utils/interface";
import CommonPage from "@/components/common/CommonPage"

export default function SharedTemplate () {
    const [value, setValue] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${domainEnv}/socket/game`);
        ws.onopen = () => console.log("✅ 連線成功");
        ws.onclose = () => console.log("關閉連線");
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data) as I_WS_Data;

            switch (message.type) {
                case E_WS_Type.ACTION:
                    break;
                case E_WS_Type.MESSAGE:
                    break;
            }
        };
        setSocket(ws);

        return () => {
            ws.close();
        }
    }, [])

    return (
        <CommonPage>
            <input
                type="text"
                onChange={(e) => setValue(e.target.value)}
                value={value}
            />
            <button
                onClick={() => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send(value);
                    } else {
                        console.warn("⚠️ WebSocket 尚未連線");
                    }
                }}
            >
                點我
            </button>
            <button
                onClick={() => socket?.close(1000, 'this connection is closed')}
            >
                斷線
            </button>
        </CommonPage>
    )
}