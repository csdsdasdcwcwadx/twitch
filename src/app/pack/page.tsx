import { getpacks } from "@/utils/api";
import PackFront from "@/components/pages/pack/Front";

export default async function PackPage() {    
    const data = await getpacks();
    return <PackFront packData={data}/>;
}