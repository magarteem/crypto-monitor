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
}

export default function GraphikV2Wrapper({
  chartHeight,
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
        } as React.CSSProperties
      }
    >
      <GraphikV2 {...props} chartHeight={chartHeight} />
    </div>
  );
}
