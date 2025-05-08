import { getpacks } from "@/utils/api";
import PackFront from "@/components/pages/pack/Front";

export default async function PackPage() {    
    const result = await getpacks();
    if (result.payload) return <PackFront packData={result.payload}/>;
}