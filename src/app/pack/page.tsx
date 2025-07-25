import { getpacks } from "@/utils/api";
import SharedPackPage from "@/components/pages/pack/SharedPackPage";

export default async function PackPage() {    
    const result = await getpacks();
    if (result.payload) return <SharedPackPage packData={result.payload} isAdmin={false}/>;
}