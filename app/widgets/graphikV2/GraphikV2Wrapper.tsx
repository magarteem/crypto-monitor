"use client";

import React from "react";
import dynamic from "next/dynamic";

const GraphikV2 = dynamic(
  () => import("./GraphikV2").then((mod) => ({ default: mod.GraphikV2 })),
  {
    ssr: false,
  }
);

interface GraphikV2WrapperProps {
  symbol?: string;
  name?: string;
  currentPrice?: number;
  change?: string;
  chartHeight?: string;
  onRemove?: (symbol: string) => void;
}

export default function GraphikV2Wrapper({
  chartHeight,
  symbol,
  onRemove,
  ...props
}: GraphikV2WrapperProps) {
  // Определяем размеры в зависимости от высоты графика
  const isCompact = chartHeight === "280px" || chartHeight === "320px";
  const isVeryCompact = chartHeight === "280px";
  const containerPadding = isVeryCompact ? "8px" : isCompact ? "10px" : "20px";
  const headerMargin = isVeryCompact ? "6px" : isCompact ? "8px" : "20px";
  const headerGap = isVeryCompact ? "4px" : isCompact ? "6px" : "16px";
  const symbolSize = isVeryCompact ? "14px" : isCompact ? "16px" : "24px";
  const priceSize = isVeryCompact ? "18px" : isCompact ? "22px" : "32px";
  const priceChangeSize = isVeryCompact ? "10px" : isCompact ? "12px" : "16px";
  const priceChangeMargin = isVeryCompact ? "6px" : isCompact ? "8px" : "12px";
  const timeframeGap = isVeryCompact ? "2px" : isCompact ? "3px" : "8px";
  const timeframePadding = isVeryCompact ? "2px" : isCompact ? "3px" : "4px";
  const timeframeButtonPadding = isVeryCompact ? "4px 6px" : isCompact ? "5px 8px" : "8px 16px";
  const timeframeButtonSize = isVeryCompact ? "10px" : isCompact ? "11px" : "14px";
  const priceGap = isVeryCompact ? "4px" : isCompact ? "6px" : "0px";

  return (
    <div
      style={
        {
          "--chart-height": chartHeight || "400px",
          "--container-padding": containerPadding,
          "--header-margin": headerMargin,
          "--header-gap": headerGap,
          "--symbol-size": symbolSize,
          "--price-size": priceSize,
          "--timeframe-gap": timeframeGap,
          "--timeframe-padding": timeframePadding,
          "--timeframe-button-padding": timeframeButtonPadding,
          "--timeframe-button-size": timeframeButtonSize,
          "--price-change-size": priceChangeSize,
          "--price-change-margin": priceChangeMargin,
          "--price-gap": priceGap,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          position: "relative",
        } as React.CSSProperties
      }
    >
      {onRemove && symbol && (
        <button
          type="button"
          onClick={() => onRemove(symbol)}
          className="remove-chart-button"
          title="Удалить график"
          aria-label="Удалить график"
        >
          ✕
        </button>
      )}
      <GraphikV2 {...props} symbol={symbol} chartHeight={chartHeight} />
      
      <style jsx>{`
        .remove-chart-button {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 10;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(128, 128, 128, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 0.6;
        }
        
        .remove-chart-button:hover {
          background: rgba(239, 83, 80, 0.8);
          border-color: rgba(239, 83, 80, 0.3);
          color: white;
          opacity: 1;
          box-shadow: 0 2px 6px rgba(239, 83, 80, 0.3);
        }
        
        .remove-chart-button:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
