import { I_Item } from "@/utils/interface";
import { Button } from "@headlessui/react";
import ImageHandler from "@/components/common/ImageHandler";
import { memo } from "react";

interface I_props {
    items: I_Item[];
    setOpenDialog: (flag: I_Item | null) => void;
    setOpenItemSettingDialog?: (flag: I_Item | null) => void;
}

function ItemGrid ({items, setOpenDialog, setOpenItemSettingDialog}: I_props) {
    return (
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 mobile:grid-cols-1">
            {items.map((item) => {
                if (!item.userItems?.length && !setOpenItemSettingDialog) return;
                return (
                    <div
                        key={item.id}
                        className="p-4 border rounded shadow cursor-pointer hover:bg-blue-50 min-h-[350px] pc:min-h-[250px] aspect-1 relative"
                        onClick={() => setOpenDialog(item)}
                    >
                        <figure className="relative h-16 cursor-pointer transform h-[50%] rounded">
                            {
                                item.image ? <ImageHandler item={item}/> : <></>
                            }
                        </figure>
                        <h3 className="text-lg font-semibold mt-3 mobile:text-center mobile:text-3xl">{item.name}</h3>
                        <p className="text-sm text-foreground text-lg mobile:text-center">{item.description}</p>
                        {
                            setOpenItemSettingDialog ? <Button 
                                className="bg-coverground text-topcovercolor w-[100%] mt-auto absolute w-[calc(100%-2em)] bottom-[1em] rounded"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setOpenItemSettingDialog(item);
                                }}
                            >設定道具</Button> : <div className="mobile:absolute bottom-[2rem]">
                                <div>兌換數量 : {item.amount}</div>
                                {item.userItems ? <div>持有數量 : {item.userItems[0]?.amount}</div> : null}
                            </div>
                        }
                    </div>
                )
            })}
        </div>
    );
}

export default memo(ItemGrid);