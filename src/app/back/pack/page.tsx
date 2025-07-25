import { getbackpacks } from "@/utils/api";
import SharedPackPage from "@/components/pages/pack/SharedPackPage";

export default async function PackPage() {    
    const result = await getbackpacks();
    if (result.payload) return <SharedPackPage packData={result.payload} isAdmin={true}/>;
}