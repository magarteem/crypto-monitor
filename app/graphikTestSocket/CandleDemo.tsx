"use client";

import { useEffect } from "react";
import { useCandleSocket } from "./useCandleSocket";

export const CandleDemo = () => {
    const { connected, lastCandle, subscribe, unsubscribe, requestPoolStats, poolStats } =
        useCandleSocket({ url: "http://localhost:4000" });

    useEffect(() => {
        subscribe({ symbol: "BTCUSDT", timeframe: "1m" });
        subscribe({ symbol: "ETHUSDT", timeframe: "15m" });
        requestPoolStats();

        return () => {
            unsubscribe({ symbol: "BTCUSDT", timeframe: "1m" });
            unsubscribe({ symbol: "ETHUSDT", timeframe: "15m" });
        };
    }, [subscribe, unsubscribe, requestPoolStats]);

    return (
        <div>
            <div>connected: {String(connected)}</div>
            <pre>{lastCandle ? JSON.stringify(lastCandle, null, 2) : "no data yet"}</pre>
            <pre>{poolStats ? JSON.stringify(poolStats, null, 2) : "no stats yet"}</pre>
        </div>
    );
}