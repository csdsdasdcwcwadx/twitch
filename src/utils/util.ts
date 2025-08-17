import { E_Item_Types, E_AddressType } from "./interface";
import { io } from "socket.io-client";

export const redirectPath = process.env.NEXT_PUBLIC_ENV === "prod" ? "/twitch" : "/api";
export const domainEnv = `${process.env.NEXT_PUBLIC_SERVER_HOST}${redirectPath}`;

export const twitchIconDomain = "https://static-cdn.jtvnw.net";
export const ImagePath = `${redirectPath}/item/images/`;

export const ItemTypes = Object.values(E_Item_Types);

export const setMonth = (month: string) => {
    switch (month) {
        case "January":
            return '1';
        case "February":
            return '2';
        case "March":
            return '3';
        case "April":
            return '4';
        case "May":
            return '5';
        case "June":
            return '6';
        case "July":
            return '7';
        case "August":
            return '8';
        case "September":
            return '9';
        case "October":
            return '10';
        case "November":
            return '11';
        case "December":
            return '12';
        default:
            return '';
    }
};

export const isServerSide = typeof window === "undefined";
export const getServerCookies = async () => {
    const { cookies } = await import("next/headers"); // 這裡改成動態 import
    const cookieStore = await cookies();
    return cookieStore.getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");
};

export const pagesize = 6;

export const addressParser = (address_type: E_AddressType) => {
    switch (address_type) {
        case E_AddressType.PA:
            return "家庭地址";
        case E_AddressType.POST:
            return "郵局";
        case E_AddressType.SEVEN:
            return "7-11";
    }    
};

export const addressFilter = (address?: string) => {
    if (!address) return null;
    const address_type = parseInt(address.split(":::")[0]) as unknown as E_AddressType;
    const address_value = address.split(":::")[1];
    const returnAddress: {
        type: E_AddressType,
        value: string[],
    } = {
        type: address_type,
        value: [],
    };

    switch (address_type) {
        case E_AddressType.PA:
            const postcal_PA = address_value.split("---")[0];
            const address_PA = address_value.split("---")[1];
            returnAddress.value.push(postcal_PA);
            returnAddress.value.push(address_PA);
            break;
        case E_AddressType.POST:
        case E_AddressType.SEVEN:
            returnAddress.value.push(address_value);
            break;
    }
    return returnAddress;
};

export const initSocket = () => {
    const socket = io("https://socket.opay.tw/web/live/C4DB659FF82BAB591BA43075C2A5B0D7", {
        path: "/socket.io",
        transports: ["websocket", "polling"], // 支援 fallback
        reconnection: true, // 自動重連
    });

        // 當前端 socket.io 連上 server
    socket.on("connect", () => {
        console.log("✅ Connected:", socket?.id);

        // 加入 namespace
        const ns = "/web/live/C4DB659FF82BAB591BA43075C2A5B0D7";
        socket?.emit("join", { namespace: ns }); 
        // ⚠️ 注意：emit 的 event name / payload 要符合 server 實作，這裡我舉例
    });

    socket.on("disconnect", () => {
        console.log("❌ Disconnected");
    });
    return socket;
};