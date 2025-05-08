import { getRedemption } from "@/utils/api";
import ExchangeBack from "@/components/pages/exchange/Back";

export default async function ExchangePage() {    
    const result = await getRedemption(); // Server Side fetch
    if (result.payload) return <ExchangeBack exchangeData={result.payload}/>;
}