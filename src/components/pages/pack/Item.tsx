import { memo, useState } from "react";
import { I_Item } from "@/utils/interface";
import BubbleBox from "@/components/common/BubbleBox";
import ImageHandler from "@/components/common/ImageHandler";
import CustomButton from "@/components/common/CustomButton";

interface I_props {
    item: I_Item;
    setOpenDialog: (flag: I_Item | null) => void;
    setOpenItemSettingDialog?: (flag: I_Item | null) => void;
}

function Item ({item, setOpenDialog, setOpenItemSettingDialog}: I_props) {
    const [position, setPosition] = useState({display: false, top: 0, left: 0});
    return (
        <div
            className="cursor-pointer notebook p-5 rounded-[8px] mobile:aspect-1"
            onClick={() => setOpenDialog(item)}
            onMouseMove={e => setPosition({
                display: true,
                top: e.clientY,
                left: e.clientX,
            })}
            onMouseLeave={() => setPosition({
                display: false,
                top: 0,
                left: 0,
            })}
        >
            <figure className="relative h-16 cursor-pointer transform rounded-t-[6px] pc:h-[250px] mobile:h-[100%]">
                {
                    item.image ? <ImageHandler item={item} clasName="object-cover  border-[3px] border-solid border-[#cab886]"/> : <></>
                }
            </figure>
            <div className="flex flex-col mt-5">
                <h3 className="text-lg font-semibold text-center mobile:text-3xl">{item.name}</h3>
                {/* <p className="text-sm text-foreground text-lg mobile:text-center overflow-hidden pc:h-[47%]">{item.description}</p> */}
                {
                    setOpenItemSettingDialog ? <CustomButton 
                        className="mt-auto bottom-[1em]"
                        onClick={(event) => {
                            event.stopPropagation();
                            setOpenItemSettingDialog(item);
                        }}
                        text="設定道具"
                    /> : null
                }
            </div>
            <BubbleBox left={position.left} top={position.top} show={position.display} className="w-[110px]">
                <div>兌換數量 : {item.amount}</div>
                {item.userItems ? <div>持有數量 : {item.userItems[0]?.amount || 0}</div> : null}
            </BubbleBox>
        </div>
    )
}

export default memo(Item);