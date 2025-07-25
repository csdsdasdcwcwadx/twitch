import { getchecks } from "@/utils/api";
import SharedCheckPage from "@/components/pages/check/SharedCheckPage";

export default async function CheckPage() {    
    const result = await getchecks(); // Server Side fetch
    if (result.payload) return <SharedCheckPage checkData={result.payload} isAdmin={false}/>;
}