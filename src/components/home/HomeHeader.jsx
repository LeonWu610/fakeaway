import React from "react";

export default function HomeHeader({ address = "望京 SOHO" }) {
  return (
    <header
      className="w-full flex flex-row items-center justify-between px-4"
      style={{ backgroundColor: "#F5A623", height: "52px" }}
    >
      {/* Left side: title and pickup mode */}
      <div className="flex flex-row items-center gap-2">
        <span className="text-black font-bold text-base leading-none">首页</span>
        <span className="text-black text-sm leading-none">|</span>
        <span className="text-black text-sm leading-none">自取</span>
      </div>

      {/* Right side: location pill and avatar */}
      <div className="flex flex-row items-center gap-2">
        {/* Location pill */}
        <div className="flex flex-row items-center bg-white bg-opacity-30 rounded-full px-3 py-1">
          <span className="text-black text-sm font-medium leading-none">
            {address}
          </span>
          <span className="text-black text-sm font-medium leading-none ml-1">
            &gt;
          </span>
        </div>

        {/* Avatar circle */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#E8E8E8" }}
        >
          {/* Simple person icon using dots/shapes */}
          <div className="flex flex-col items-center gap-px">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#999" }}
            />
            <div
              className="w-4 h-1.5 rounded-sm"
              style={{ backgroundColor: "#999" }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
