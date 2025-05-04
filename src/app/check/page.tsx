import { getchecks } from "@/utils/api";
import CheckClient from "@/components/pages/check/Front";

export default async function CheckPage() {    
    const data = await getchecks(); // Server Side fetch
    return <CheckClient checkData={data}/>;
}