import { getchecks } from "@/utils/api";
import CheckBack from "@/components/pages/check/Back";

export default async function CheckPage() {    
    const result = await getchecks(); // Server Side fetch
    if (result.payload) return <CheckBack checkData={result.payload}/>;
}