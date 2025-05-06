import { getchecks } from "@/utils/api";
import CheckFront from "@/components/pages/check/Front";

export default async function CheckPage() {    
    const data = await getchecks(); // Server Side fetch
    return <CheckFront checkData={data}/>;
}