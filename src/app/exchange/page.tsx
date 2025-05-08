import { getRedemption } from "@/utils/api";
import ExchangeFront from "@/components/pages/exchange/Front";

export default async function ExchangePage() {    
    const result = await getRedemption(); // Server Side fetch
    if (result.payload) return <ExchangeFront exchangeData={result.payload}/>;
}