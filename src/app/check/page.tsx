import { getchecks } from "@/utils/api";
import CheckFront from "@/components/pages/check/Front";

export default async function CheckPage() {    
    const result = await getchecks(); // Server Side fetch
    if (result.payload) return <CheckFront checkData={result.payload}/>;
}