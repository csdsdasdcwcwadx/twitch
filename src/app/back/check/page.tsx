import { getbackchecks } from "@/utils/api";
import CheckBack from "@/components/pages/check/Back";

export default async function CheckPage() {    
    const data = await getbackchecks(); // Server Side fetch
    return <CheckBack checkData={data}/>;
}