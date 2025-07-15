import { memo } from "react";
import { E_Item_Types } from "@/utils/interface";
import { ItemTypes } from "@/utils/util";
import "./styles/SideBar.scss";

interface I_props {
    setCurrentType: (category: E_Item_Types) => void;
}

const Sidebar = ({ setCurrentType }: I_props) => {
    return (
        <div className="sidebar pc:w-[30%] relative">
            <figure className="absolute w-full h-full right-[0]">
                <div className="side-head"></div>
                <div className="side-body"></div>
                <div className="side-tail"></div>
            </figure>
            {/* <h2 className="text-xl text-topcovercolor font-bold mb-4 mobile:text-center">Categories</h2> */}
            <i className="top-[6%]"/>
            <ul className="mobile:flex mobile:justify-around absolute top-[15%] left-[50%]">
                {ItemTypes.map((category) => (
                    <li key={category} className="text-lg mobile:text-center mobile:flex-auto mb-2 text-topcovercolor cursor-pointer hover:bg-hoverground p-3 text-center hover:text-coverground rounded-lg" onClick={() => setCurrentType(category)}>
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default memo(Sidebar);