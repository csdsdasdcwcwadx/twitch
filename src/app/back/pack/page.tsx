import { getbackpacks } from "@/utils/api";
import PackServer from "@/components/pages/pack/Back";

export default async function PackPage() {    
    const data = await getbackpacks();
    return <PackServer packData={data}/>;
}