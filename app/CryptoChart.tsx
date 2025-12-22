"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import styles from "./CryptoChart.module.css";

interface CryptoChartProps {
  name: string;
  data: Array<{ time: string; price: number }>;
  currentPrice: number;
  change: string;
  symbol: string;
}

export const CryptoChart = ({
  name,
  data,
  currentPrice: initialPrice,
  change,
  symbol,
}: CryptoChartProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const isPositive = parseFloat(change) >= 0;

  // Обновление цены каждые 5 секунд
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        );
        const data = await response.json();
        if (data.price) {
          setCurrentPrice(parseFloat(data.price));
        }
      } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
      }
    };

    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  // Вычисляем диапазон цен для красивого отображения
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  // Применяем zoom
  const displayData = data.slice(-Math.floor(data.length / zoomLevel));

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.5, 1));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{payload[0].payload.time}</p>
          <p className={styles.tooltipValue}>
            $
            {payload[0].value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  // Кастомная метка с фоном для текущей цены
  const PriceLabel = (props: any) => {
    const { viewBox } = props;
    const priceText = `$${currentPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: currentPrice < 1 ? 6 : 2,
    })}`;

    return (
      <g>
        <rect
          x={viewBox.width - 70}
          y={viewBox.y - 18}
          width={65}
          height={16}
          fill="rgba(255, 107, 74, 0.6)"
          rx={3}
        />
        <text
          x={viewBox.width - 37.5}
          y={viewBox.y - 8}
          fill="#fff"
          fontSize={10}
          fontWeight="bold"
          textAnchor="middle"
        >
          {priceText}
        </text>
      </g>
    );
  };

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartInfo}>
          <div className={styles.chartName}>{name}</div>
          <div
            className={`${styles.changePercent} ${
              isPositive ? styles.positive : styles.negative
            }`}
          >
            {isPositive ? "+" : ""}
            {change}%
          </div>
        </div>
        <div className={styles.currentPrice}>
          $
          {currentPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={displayData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient
                id={`gradient-${name}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#00ff88" : "#ff4444"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#00ff88" : "#ff4444"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#666"
              tick={{ fontSize: 10 }}
              interval={Math.floor(displayData.length / 8)}
            />
            <YAxis
              stroke="#666"
              tick={{ fontSize: 10 }}
              domain={[minPrice - padding, maxPrice + padding]}
              tickFormatter={(value) => value.toFixed(2)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Линия текущей цены */}
            <ReferenceLine
              y={currentPrice}
              stroke="#ff6b4a"
              strokeDasharray="3 3"
              strokeWidth={2}
              label={<PriceLabel />}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#00ff88" : "#ff4444"}
              strokeWidth={2}
              dot={false}
              fill={`url(#gradient-${name})`}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartControls}>
        <button
          type="button"
          onClick={handleZoomOut}
          className={styles.zoomButton}
          disabled={zoomLevel <= 1}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 11h6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <span className={styles.zoomLevel}>{Math.round(zoomLevel * 100)}%</span>
        <button
          type="button"
          onClick={handleZoomIn}
          className={styles.zoomButton}
          disabled={zoomLevel >= 4}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            <path d="M11 8v6M8 11h6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};
