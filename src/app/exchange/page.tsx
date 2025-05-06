import { getRedemption } from "@/utils/api";
import ExchangeFront from "@/components/pages/exchange/Front";

export default async function ExchangePage() {    
    const data = await getRedemption(); // Server Side fetch
    return <ExchangeFront exchangeData={data}/>;
}