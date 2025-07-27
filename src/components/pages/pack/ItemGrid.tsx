import { I_Item } from "@/utils/interface";
import { memo } from "react";
import "./styles/ItemGrid.scss";
import Item from "./Item";

interface I_props {
    items: I_Item[];
    setOpenDialog: (flag: I_Item | null) => void;
    setOpenItemSettingDialog?: (flag: I_Item | null) => void;
}

function ItemGrid ({ items, setOpenDialog, setOpenItemSettingDialog }: I_props) {
    return (
        <div className="itemgrid grid grid-cols-[1fr_1fr_1fr] gap-4 mobile:grid-cols-1">
            {items.map((item) => {
                if (!item.userItems?.length && !setOpenItemSettingDialog) return;
                return <Item key={item.id} item={item} setOpenDialog={setOpenDialog} setOpenItemSettingDialog={setOpenItemSettingDialog}/>
            })}
        </div>
    );
}

export default memo(ItemGrid);