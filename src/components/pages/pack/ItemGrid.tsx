import { I_Item } from "@/utils/interface";
import { Button } from "@headlessui/react";
import ImageHandler from "@/components/common/ImageHandler";
import { memo } from "react";

interface I_props {
    items: I_Item[];
    setOpenDialog: (flag: I_Item | null) => void;
    setOpenItemSettingDialog?: (flag: I_Item | null) => void;
}

function ItemGrid ({ items, setOpenDialog, setOpenItemSettingDialog }: I_props) {
    return (
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 mobile:grid-cols-1">
            {items.map((item) => {
                if (!item.userItems?.length && !setOpenItemSettingDialog) return;
                return (
                    <div
                        key={item.id}
                        className="cursor-pointer min-h-[350px] pc:min-h-[250px]"
                        onClick={() => setOpenDialog(item)}
                    >
                        <div className="aspect-1 bg-[#9C7358] p-4 rounded-[30px]">
                            <div className="aspect-1 bg-[#eff5ae] p-5 relative rounded-[25px] shadow-[5px_5px_rgba(55,55,55,0.5)]">
                                <figure className="relative h-16 cursor-pointer transform h-[50%] rounded-t-[25px]">
                                    {
                                        item.image ? <ImageHandler item={item} clasName="rounded-t-[25px]"/> : <></>
                                    }
                                </figure>
                                <div className="bg-[#f2cd88] h-[50%] p-3">
                                    <h3 className="text-lg font-semibold mobile:text-center mobile:text-3xl">{item.name}</h3>
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
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default memo(ItemGrid);