import { getbackchecks } from "@/utils/api";
import CheckServer from "@/components/pages/check/Back";

export default async function CheckPage() {    
    const data = await getbackchecks(); // Server Side fetch
    return <CheckServer checkData={data}/>;
}