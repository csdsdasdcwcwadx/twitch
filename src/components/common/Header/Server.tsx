import { headers } from 'next/headers';
import { getUsers } from "@/utils/api";
import Client from './Client';

export default async function Header () {
    const headersList = await headers();
    const fullUrl = headersList.get('referer') || "";

    const pathname = fullUrl.replace(process.env.NEXT_PUBLIC_SERVER_HOST || "", "");
    console.log(pathname)
    if (pathname === "/") return <></>

    const result = await getUsers();
    return <Client userinfo={result.getUsers}/>
}