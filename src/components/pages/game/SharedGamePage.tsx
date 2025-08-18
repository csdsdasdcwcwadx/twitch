'use client';

import { useEffect, useState } from "react";
import { E_WS_Type, I_WS_Data } from "@/utils/interface";
import CommonPage from "@/components/common/CommonPage";
import { io, Socket } from "socket.io-client";

export default function SharedTemplate () {
    const [value, setValue] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const gameSocket = io(`http://localhost:4000/socket/game`); // 需要再修改

        gameSocket.on("notify", (message: I_WS_Data) => {
            switch (message.type) {
                case E_WS_Type.ACTION:
                    break;
                case E_WS_Type.MESSAGE:
                    break;
            }
        });
        setSocket(gameSocket);
        return () => {
            gameSocket.disconnect();
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
                    socket?.emit(value);
                }}
            >
                點我
            </button>
            <button
                onClick={() => socket?.disconnect()}
            >
                斷線
            </button>
        </CommonPage>
    )
}