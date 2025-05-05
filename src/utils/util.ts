import { E_Item_Types } from "./interface";

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
}

export const isServerSide = typeof window === "undefined";
export const getServerCookies = async () => {
    const { cookies } = await import("next/headers"); // 這裡改成動態 import
    const cookieStore = await cookies();
    return cookieStore.getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");
};

export const pagesize = 12;