import { getUsers } from "@/utils/api";
import Client from './Client';

export default async function Header () {
    const result = await getUsers();
    if (result.payload) return <Client userinfo={result.payload.getUsers}/>;

    return null;
}