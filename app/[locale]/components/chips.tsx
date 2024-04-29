import React from "react";


interface Props{
    heading:string
}

export const Chip:React.FC<Props> = ({heading}) => {
    return(
        <div className="bg-[#00A0EA]/[10%] text-[#00A0EA] border border-[#00A0EA] text-xs rounded-lg px-2 py-1">
        {heading}
        </div>
    )
}