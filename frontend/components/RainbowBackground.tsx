"use client";

import React from "react";

export default function RainbowBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
            {/* Blue Red Green Yellow Gradient Mesh */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,#3B82F6_0deg,#EF4444_90deg,#22C55E_180deg,#EAB308_270deg,#3B82F6_360deg)] opacity-30 blur-[120px] animate-spin-slow" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" />

            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
        </div>
    );
}
