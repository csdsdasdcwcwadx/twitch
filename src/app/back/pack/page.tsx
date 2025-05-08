import { getbackpacks } from "@/utils/api";
import PackBack from "@/components/pages/pack/Back";

export default async function PackPage() {    
    const result = await getbackpacks();
    if (result.payload) return <PackBack packData={result.payload}/>;
}