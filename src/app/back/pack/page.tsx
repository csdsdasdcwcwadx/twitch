import { getbackpacks } from "@/utils/api";
import PackBack from "@/components/pages/pack/Back";

export default async function PackPage() {    
    const data = await getbackpacks();
    return <PackBack packData={data}/>;
}