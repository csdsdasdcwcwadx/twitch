import { getpacks } from "@/utils/api";
import PackClient from "@/components/pages/pack/Front";

export default async function PackPage() {    
    const data = await getpacks();
    return <PackClient packData={data}/>;
}