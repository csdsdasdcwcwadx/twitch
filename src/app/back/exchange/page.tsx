import { getRedemption } from "@/utils/api";
import ExchangeBack from "@/components/pages/exchange/Back";

export default async function ExchangePage() {    
    const data = await getRedemption(); // Server Side fetch
    return <ExchangeBack exchangeData={data}/>;
}