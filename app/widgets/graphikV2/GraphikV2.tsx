"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  type IChartApi,
  type CandlestickData,
  type UTCTimestamp,
} from "lightweight-charts";
import { useModal } from "@hooks/useModal";
import { CoinNotificationModal } from "../modals/CoinNotificationModal";
import { BellIcon } from "@/public/img";
import { useSocket } from "@/app/shared/components/client-socket-connection/ClientSocketConnection";
import styles from "./GraphikV2.module.css";

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: "1м", value: "1m" },
  { label: "5м", value: "5m" },
  { label: "15м", value: "15m" },
  { label: "1ч", value: "1h" },
  { label: "4ч", value: "4h" },
  { label: "1д", value: "1d" },
];

interface GraphikV2Props {
  symbol?: string;
  name?: string;
  currentPrice?: number;
  change?: string;
  chartHeight?: string;
}

export const GraphikV2 = ({
  symbol: propSymbol = "SOLUSDT",
  name: propName,
  currentPrice: propCurrentPrice,
  change: propChange,
  chartHeight: propChartHeight,
}: GraphikV2Props = {}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const handleResizeRef = useRef<(() => void) | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const candlesDataRef = useRef<CandlestickData<UTCTimestamp>[]>([]);
  const isLoadingMoreRef = useRef<boolean>(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  const { subscribeToCandle, getHistoricalKlines } = useSocket();

  const [timeframe, setTimeframe] = useState<Timeframe>("1h");
  const [currentPrice, setCurrentPrice] = useState<number | null>(
    propCurrentPrice || null
  );
  const [priceChange, setPriceChange] = useState<number>(
    propChange ? parseFloat(propChange) : 0
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartReady, setChartReady] = useState(false);
  const initialPropsSetRef = useRef<boolean>(false);
  const previousPriceRef = useRef<number | null>(null);
  const [isPriceUp, setIsPriceUp] = useState<boolean | null>(null);

  const { openModal } = useModal();

  const symbol = propSymbol;
  const displayName = propName || symbol.replace("USDT", "/USDT");

  const handleNotificationSettings = () => {
    openModal(
      `coin-notification-${symbol}`,
      CoinNotificationModal as React.ComponentType<any>,
      {
        symbol,
        name: propName,
      },
      {
        size: "md",
      }
    );
  };

  // Обновление цены и изменения из пропсов только при первой загрузке
  // После этого цена обновляется только через WebSocket
  useEffect(() => {
    if (!initialPropsSetRef.current && chartReady) {
      if (propCurrentPrice !== undefined && currentPrice === null) {
        setCurrentPrice(propCurrentPrice);
      }
      if (propChange !== undefined) {
        setPriceChange(parseFloat(propChange));
      }
      initialPropsSetRef.current = true;
    }
  }, [chartReady, propCurrentPrice, propChange, currentPrice]);

  // Инициализация графика
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    const timer = setTimeout(() => {
      if (!chartContainerRef.current || chartRef.current) return;

      const containerWidth = chartContainerRef.current.clientWidth;

      if (containerWidth === 0) {
        setError("Контейнер не имеет ширины");
        setLoading(false);
        return;
      }

      // Высота контейнера или минимальная высота 400px
      const containerHeight = Math.max(
        chartContainerRef.current.clientHeight || 400,
        400
      );

      const chartOptions = {
        layout: {
          textColor: "white",
          background: { type: ColorType.Solid as const, color: "black" },
        },
        width: containerWidth,
        height: containerHeight,
        grid: {
          vertLines: { color: "rgba(42, 46, 57, 0.5)" },
          horzLines: { color: "rgba(42, 46, 57, 0.5)" },
        },
        rightPriceScale: {
          borderColor: "rgba(197, 203, 206, 0.4)",
        },
        timeScale: {
          borderColor: "rgba(197, 203, 206, 0.4)",
          timeVisible: true,
          secondsVisible: false,
        },
      };

      const chart = createChart(chartContainerRef.current, chartOptions);

      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;
      setChartReady(true);

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          const containerWidth = chartContainerRef.current.clientWidth;
          // Используем фактическую высоту контейнера или минимальную высоту
          const containerHeight = Math.max(
            chartContainerRef.current.clientHeight || 400,
            280 // Минимальная высота для самых компактных графиков
          );
          chartRef.current.applyOptions({
            width: containerWidth,
            height: containerHeight,
          });
        }
      };

      handleResizeRef.current = handleResize;
      window.addEventListener("resize", handleResize);

      // Используем ResizeObserver для отслеживания изменения размера контейнера
      if (chartContainerRef.current && typeof ResizeObserver !== "undefined") {
        const resizeObserver = new ResizeObserver(() => {
          handleResize();
        });
        resizeObserver.observe(chartContainerRef.current);
        resizeObserverRef.current = resizeObserver;
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (handleResizeRef.current) {
        window.removeEventListener("resize", handleResizeRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        setChartReady(false);
      }
    };
  }, []);

  // Загрузка исторических данных через Socket.IO
  useEffect(() => {
    if (!chartReady || !candlestickSeriesRef.current || !symbol) return;

    const fetchHistoricalData = async () => {
      setLoading(true);
      setError(null);

      try {
        const limit = timeframe === "1m" ? 500 : timeframe === "5m" ? 300 : 200;
        const response = await getHistoricalKlines(symbol, timeframe, limit);

        if (!response.data || response.data.length === 0) {
          throw new Error("Получены пустые данные");
        }

        const candles: CandlestickData<UTCTimestamp>[] = response.data.map(
          (item) => ({
            time: item.time as UTCTimestamp,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          })
        );

        // Проверяем, что candlestickSeriesRef еще существует перед вызовом setData
        if (candlestickSeriesRef.current) {
          candlestickSeriesRef.current.setData(candles);
        }
        candlesDataRef.current = candles;
        isLoadingMoreRef.current = false; // Сбрасываем флаг загрузки

        const lastCandle = candles[candles.length - 1];
        const firstCandle = candles[0];

        // Обновляем цену из загруженных данных (будет перезаписана WebSocket при подключении)
        setCurrentPrice(lastCandle.close);
        previousPriceRef.current = lastCandle.close;
        setIsPriceUp(null); // Сбрасываем направление при загрузке новых данных

        // Обновляем изменение только если оно не было передано через пропсы
        if (propChange === undefined) {
          const change =
            ((lastCandle.close - firstCandle.open) / firstCandle.open) * 100;
          setPriceChange(change);
        }

        chartRef.current?.timeScale().fitContent();
        setLoading(false);
      } catch (err) {
        console.error("Error fetching historical data:", err);
        setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [timeframe, chartReady, symbol, propCurrentPrice, propChange, getHistoricalKlines]);

  // Обновление размера графика при изменении высоты
  useEffect(() => {
    if (!chartReady || !chartRef.current || !chartContainerRef.current) return;

    const updateChartSize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const containerWidth = chartContainerRef.current.clientWidth;
        const containerHeight = Math.max(
          chartContainerRef.current.clientHeight || 400,
          280
        );
        chartRef.current.applyOptions({
          width: containerWidth,
          height: containerHeight,
        });
      }
    };

    // Небольшая задержка для применения CSS переменной
    const timer = setTimeout(updateChartSize, 100);
    return () => clearTimeout(timer);
  }, [chartReady, propChartHeight]);

  // Загрузка предыдущих данных при прокрутке к началу
  useEffect(() => {
    if (!chartReady || !candlestickSeriesRef.current || !symbol) return;

    const timeScale = chartRef.current?.timeScale();
    if (!timeScale) return;

    const loadMoreData = async (endTime: number) => {
      if (isLoadingMoreRef.current) return;
      isLoadingMoreRef.current = true;

      try {
        // Получаем текущий видимый диапазон перед загрузкой данных
        const currentVisibleRange = timeScale.getVisibleLogicalRange();
        const currentFrom = currentVisibleRange?.from ?? 0;
        const currentTo = currentVisibleRange?.to ?? 0;

        const limit = timeframe === "1m" ? 500 : timeframe === "5m" ? 300 : 200;

        const response = await getHistoricalKlines(
          symbol,
          timeframe,
          limit,
          endTime * 1000
        );

        if (!response.data || response.data.length === 0) {
          isLoadingMoreRef.current = false;
          return;
        }

        const newCandles: CandlestickData<UTCTimestamp>[] = response.data.map(
          (item) => ({
            time: item.time as UTCTimestamp,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          })
        );

        // Фильтруем дубликаты и объединяем с существующими данными
        const existingTimes = new Set(
          candlesDataRef.current.map((c) => c.time)
        );
        const uniqueNewCandles = newCandles.filter(
          (c) => !existingTimes.has(c.time)
        );

        if (uniqueNewCandles.length > 0) {
          // Сортируем по времени и объединяем
          const allCandles = [
            ...uniqueNewCandles,
            ...candlesDataRef.current,
          ].sort((a, b) => (a.time as number) - (b.time as number));

          candlesDataRef.current = allCandles;

          // Проверяем, что candlestickSeriesRef еще существует перед вызовом setData
          if (candlestickSeriesRef.current) {
            candlestickSeriesRef.current.setData(allCandles);
          }

          // Восстанавливаем позицию прокрутки после добавления данных
          // Вычисляем новый from с учетом добавленных данных
          const addedBars = uniqueNewCandles.length;
          const newFrom = currentFrom + addedBars;
          const rangeSize = currentTo - currentFrom;
          const newTo = newFrom + rangeSize;

          // Устанавливаем видимый диапазон с небольшой задержкой
          setTimeout(() => {
            if (chartRef.current) {
              const ts = chartRef.current.timeScale();
              ts.setVisibleLogicalRange({
                from: newFrom,
                to: newTo,
              });
            }
          }, 50);

          // Обновляем цену изменения, если нужно
          if (propChange === undefined && allCandles.length > 0) {
            const firstCandle = allCandles[0];
            const lastCandle = allCandles[allCandles.length - 1];
            const change =
              ((lastCandle.close - firstCandle.open) / firstCandle.open) * 100;
            setPriceChange(change);
          }
        }

        isLoadingMoreRef.current = false;
      } catch (err) {
        console.error("Error loading more data:", err);
        isLoadingMoreRef.current = false;
      }
    };

    let lastCheckTime = 0;
    const DEBOUNCE_DELAY = 500; // Задержка между проверками в мс

    timeScale.subscribeVisibleLogicalRangeChange((logicalRange) => {
      if (!logicalRange || !candlesDataRef.current.length) return;

      // Защита от слишком частых проверок
      const now = Date.now();
      if (now - lastCheckTime < DEBOUNCE_DELAY) return;
      lastCheckTime = now;

      // Если видимая область близка к началу данных (первые 10 баров)
      // загружаем предыдущие данные
      if (
        logicalRange.from !== null &&
        logicalRange.from < 10 &&
        !isLoadingMoreRef.current
      ) {
        const firstCandleTime = candlesDataRef.current[0].time as number;
        if (firstCandleTime) {
          // Загружаем данные с временем до первой свечи
          loadMoreData(firstCandleTime - 1);
        }
      }
    });
  }, [timeframe, chartReady, symbol, propChange, getHistoricalKlines]);

  // Подписка на обновления свечей через Socket.IO
  useEffect(() => {
    if (!chartReady || !candlestickSeriesRef.current || !symbol) return;

    // Отписываемся от предыдущей подписки
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Подписываемся на обновления свечей
    const unsubscribe = subscribeToCandle(symbol, timeframe, (data) => {
      if (!candlestickSeriesRef.current) return;

      const candleTime = data.time as UTCTimestamp;
      const candle: CandlestickData<UTCTimestamp> = {
        time: candleTime,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
      };

      // Обновляем свечу на графике
      candlestickSeriesRef.current.update(candle);

      // Обновляем данные в рефе
      if (candlesDataRef.current.length > 0) {
        const lastCandle =
          candlesDataRef.current[candlesDataRef.current.length - 1];
        if (lastCandle.time === candleTime) {
          // Если это та же свеча, обновляем её
          candlesDataRef.current[candlesDataRef.current.length - 1] = candle;
        } else {
          // Если новая свеча, добавляем её
          candlesDataRef.current = [...candlesDataRef.current, candle];
        }
      }

      // Обновляем направление изменения цены
      if (previousPriceRef.current !== null) {
        setIsPriceUp(candle.close > previousPriceRef.current);
      }
      previousPriceRef.current = candle.close;

      // Всегда обновляем текущую цену при получении данных через WebSocket
      // Это гарантирует, что цена в шапке синхронизирована с графиком
      setCurrentPrice(candle.close);

      // Обновляем процент изменения при получении новых данных
      if (propChange === undefined && candlesDataRef.current.length > 0) {
        const firstCandle = candlesDataRef.current[0];
        const change =
          ((candle.close - firstCandle.open) / firstCandle.open) * 100;
        setPriceChange(change);
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [timeframe, chartReady, symbol, propChange, subscribeToCandle]);

  const handleTimeframeChange = (newTimeframe: Timeframe) => {
    setTimeframe(newTimeframe);
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.priceInfo}>
          <div className={styles.symbol}>{displayName}</div>
          <div
            className={styles.price}
            style={{
              color:
                isPriceUp === null
                  ? "#ffffff"
                  : isPriceUp
                    ? "#26a69a"
                    : "#ef5350",
            }}
          >
            {currentPrice !== null ? (
              <>
                $
                {currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: currentPrice < 1 ? 6 : 2,
                })}
                <span
                  className={`${styles.priceChange} ${priceChange >= 0 ? styles.positive : styles.negative
                    }`}
                >
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}%
                </span>
              </>
            ) : (
              "—"
            )}
          </div>
        </div>

        <div className={styles.timeframeControls}>
          <div className={styles.timeframeSelector}>
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                type="button"
                onClick={() => handleTimeframeChange(tf.value)}
                className={`${styles.timeframeButton} ${timeframe === tf.value ? styles.active : ""
                  }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.notificationButton}
            onClick={handleNotificationSettings}
            aria-label="Настройки уведомлений"
            title="Настройки уведомлений"
          >
            <BellIcon width="18" height="18" />
          </button>
        </div>
      </div>

      <div ref={chartContainerRef} className={styles.chartContainer}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(30, 30, 30, 0.9)",
              zIndex: 10,
            }}
          >
            <div className={styles.loading}>Загрузка графика...</div>
          </div>
        )}
      </div>
    </div>
  );
};
