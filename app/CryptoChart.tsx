"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ApexCharts from "apexcharts";
import styles from "./CryptoChart.module.css";

// Динамический импорт для Next.js
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Candle = {
  x: Date;
  y: [number, number, number, number]; // [open, high, low, close]
};

interface CryptoChartProps {
  name: string;
  symbol: string;
  change: string;
  currentPrice: number;
}

export const CryptoChart = ({
  name,
  symbol,
  change,
  currentPrice: initialPrice,
}: CryptoChartProps) => {
  const [series, setSeries] = useState<{ data: Candle[] }>({ data: [] });
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const isPositive = parseFloat(change) >= 0;

  async function fetchData() {
    try {
      // Получаем свечи за последние 100 минут
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`
      );
      const raw = await res.json();

      const candles: Candle[] = raw.map((c: any) => ({
        x: new Date(c[0]),
        y: [
          parseFloat(c[1]), // open
          parseFloat(c[2]), // high
          parseFloat(c[3]), // low
          parseFloat(c[4]), // close
        ],
      }));

      setSeries({ data: candles });
      setCurrentPrice(parseFloat(raw[raw.length - 1][4])); // последний close
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // обновляем каждые 10 секунд
    return () => clearInterval(interval);
  }, [symbol]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "candlestick",
      height: 250,
      background: "transparent",
      toolbar: {
        show: true,
        tools: {
          download: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: "zoom",
      },
      animations: {
        enabled: true,
        speed: 300,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#00ff88",
          downward: "#ff4444",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#666",
          fontSize: "10px",
        },
        datetimeUTC: false,
      },
    },
    yaxis: {
      opposite: true, // шкала справа
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: "#666",
          fontSize: "10px",
        },
        formatter: (value) => value.toFixed(2),
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      x: {
        format: "HH:mm",
      },
    },
    grid: {
      borderColor: "#333",
      strokeDashArray: 4,
    },
    annotations: {
      yaxis: [
        currentPrice
          ? {
              y: currentPrice,
              borderColor: "#ff6b4a",
              strokeDashArray: 5,
              label: {
                borderColor: "rgba(255, 107, 74, 0.6)",
                style: {
                  color: "#fff",
                  background: "rgba(255, 107, 74, 0.6)",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: {
                    left: 8,
                    right: 8,
                    top: 4,
                    bottom: 4,
                  },
                },
                text: `$${currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: currentPrice < 1 ? 6 : 2,
                })}`,
              },
            }
          : {},
      ],
    },
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
            maximumFractionDigits: currentPrice < 1 ? 6 : 2,
          })}
        </div>
      </div>

      <div className={styles.chartContainer}>
        {series.data.length > 0 && (
          <ReactApexChart
            options={options}
            series={[series]}
            type="candlestick"
            height={250}
          />
        )}
      </div>
    </div>
  );
};
