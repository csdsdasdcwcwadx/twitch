import { memo, useEffect, useRef, useState } from "react";

interface I_props {
    show: boolean
    top: number;
    left: number;
    children: React.ReactNode;
    className?: string;
}

function BubbleBox({top, left, show, children, className}: I_props) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [adjustLeft, setAdjustLeft] = useState(left);
    const [adjustTop, setAdjustTop] = useState(top);
  
    useEffect(() => {
        if (boxRef.current && show) {
            const box = boxRef.current;
            const rect = box.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight

            // 如果超出螢幕右邊，就往左移動 bubble 寬度
            if (left + rect.width + 10 > screenWidth) {
                setAdjustLeft(left - rect.width);
            } else {
                setAdjustLeft(left + 3);
            }

            if (top + rect.height > screenHeight) {
                setAdjustTop(top - rect.height);
            } else {
                setAdjustTop(top + 3);
            }
        }
    }, [left, show, top]);

    return (
        <div
            ref={boxRef}
            className={"fixed bg-[#fff] z-[10] p-2 shadow-2xl rounded-[5px] border border-solid border-[#8A8787] " + className}
            style={{
                top: `${adjustTop}px`,
                left: `${adjustLeft}px`,
                display: show ? "" : "none",
            }}
        >
            {children}
        </div>
    )
}

export default memo(BubbleBox);