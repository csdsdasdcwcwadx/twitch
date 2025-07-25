import { getRedemption } from "@/utils/api";
import SharedExchangePage from "@/components/pages/exchange/SharedExchangePage";

export default async function ExchangePage() {    
    const result = await getRedemption(); // Server Side fetch
    if (result.payload) return <SharedExchangePage exchangeData={result.payload} isAdmin={false}/>;
}