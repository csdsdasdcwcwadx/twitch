import { memo } from "react";
import { E_Item_Types } from "@/utils/interface";
import { ItemTypes } from "@/utils/util";

interface I_props {
    setCurrentType: (category: E_Item_Types) => void;
}

const Sidebar = ({ setCurrentType }: I_props) => {
    return (
        <div className="pc:w-1/5 bg-coverground p-4 overflow-x-auto">
            <h2 className="text-xl text-topcovercolor font-bold mb-4 mobile:text-center">Categories</h2>
            <ul className="mobile:flex mobile:justify-around">
                {ItemTypes.map((category) => (
                    <li key={category} className="mobile:text-center mobile:flex-auto mb-2 text-topcovercolor cursor-pointer hover:bg-hoverground p-3" onClick={() => setCurrentType(category)}>
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default memo(Sidebar);