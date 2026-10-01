import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useCurrency } from "../context/CurrencyContext";
import Loading from "../components/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

function CoinDetail() {
  const { id } = useParams();
  const { formatPrice } = useCurrency();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [days, setDays] = useState(7);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [coinRes, chartRes] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/${id}`),
          fetch(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
          ),
        ]);

        if (!coinRes.ok) throw new Error("Coin tidak ditemukan");

        const coinData = await coinRes.json();
        const chartJson = await chartRes.json();

        setCoin(coinData);

        const prices = chartJson.prices || [];
        const isUp =
          prices.length > 1 && prices[prices.length - 1][1] >= prices[0][1];

        setChartData({
          labels: prices.map((p) => {
            const date = new Date(p[0]);
            if (days === 1) {
              return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });
            }
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }),
          datasets: [
            {
              label: "Price (USD)",
              data: prices.map((p) => p[1]),
              borderColor: isUp ? "#4ade80" : "#f87171",
              backgroundColor: isUp
                ? "rgba(74, 222, 128, 0.08)"
                : "rgba(248, 113, 113, 0.08)",
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              borderWidth: 2,
            },
          ],
        });

        const saved =
          JSON.parse(localStorage.getItem("crypto-watchlist")) || [];
        setIsWatchlisted(saved.some((c) => c.id === id));
      } catch (err) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, days]);

  const toggleWatchlist = () => {
    if (!coin) return;
    const saved = JSON.parse(localStorage.getItem("crypto-watchlist")) || [];

    if (isWatchlisted) {
      const updated = saved.filter((c) => c.id !== id);
      localStorage.setItem("crypto-watchlist", JSON.stringify(updated));
      setIsWatchlisted(false);
    } else {
      const item = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image?.small,
      };
      localStorage.setItem(
        "crypto-watchlist",
        JSON.stringify([...saved, item])
      );
      setIsWatchlisted(true);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="error">{error}</p>;
  if (!coin) return null;

  const price = coin.market_data?.current_price?.usd;
  const change = coin.market_data?.price_change_percentage_24h;
  const isPositive = (change || 0) >= 0;

  return (
    <div className="coin-detail">
      <Link to="/" className="back-btn">
        Back to Market
      </Link>

      <div className="detail-header">
        <div className="coin-title">
          <img src={coin.image?.large} alt={coin.name} />
          <div>
            <h1>
              {coin.name}{" "}
              <span className="symbol">{coin.symbol?.toUpperCase()}</span>
            </h1>
            <p className="rank">Rank #{coin.market_cap_rank || "-"}</p>
          </div>
        </div>

        <button
          className={`watch-btn ${isWatchlisted ? "active" : ""}`}
          onClick={toggleWatchlist}
          type="button"
        >
          {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
        </button>
      </div>

      <div className="price-section">
        <h2>{formatPrice(price)}</h2>
        <span className={isPositive ? "positive" : "negative"}>
          {isPositive ? "+" : ""}
          {(change || 0).toFixed(2)}% (24h)
        </span>
      </div>

      <div className="chart-controls">
        {[
          { value: 1, label: "24H" },
          { value: 7, label: "7D" },
          { value: 30, label: "30D" },
          { value: 90, label: "90D" },
        ].map((item) => (
          <button
            key={item.value}
            className={days === item.value ? "active" : ""}
            onClick={() => setDays(item.value)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="chart-container">
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  mode: "index",
                  intersect: false,
                  backgroundColor: "#18181b",
                  titleColor: "#fafafa",
                  bodyColor: "#a1a1aa",
                  borderColor: "#27272a",
                  borderWidth: 1,
                },
              },
              scales: {
                x: {
                  ticks: { color: "#71717a", maxTicksLimit: 8 },
                  grid: { display: false },
                },
                y: {
                  ticks: {
                    color: "#71717a",
                    callback: (value) => "$" + Number(value).toLocaleString(),
                  },
                  grid: { color: "#27272a" },
                },
              },
              interaction: {
                mode: "index",
                intersect: false,
              },
            }}
          />
        ) : (
          <p className="empty">Loading chart...</p>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">Market Cap</span>
          <span className="value">
            {formatPrice(coin.market_data?.market_cap?.usd)}
          </span>
        </div>
        <div className="stat-card">
          <span className="label">24h Volume</span>
          <span className="value">
            {formatPrice(coin.market_data?.total_volume?.usd)}
          </span>
        </div>
        <div className="stat-card">
          <span className="label">Circulating Supply</span>
          <span className="value">
            {coin.market_data?.circulating_supply?.toLocaleString() || "-"}{" "}
            {coin.symbol?.toUpperCase()}
          </span>
        </div>
        <div className="stat-card">
          <span className="label">All-Time High</span>
          <span className="value">
            {formatPrice(coin.market_data?.ath?.usd)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CoinDetail;
