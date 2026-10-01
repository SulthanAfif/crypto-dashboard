import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import Loading from "../components/Loading";

function Home() {
  const { formatPrice } = useCurrency();
  const [coins, setCoins] = useState([]);
  const [global, setGlobal] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [filter, setFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 25;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const [marketRes, trendingRes, globalRes] = await Promise.all([
        fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
          { signal: controller.signal }
        ),
        fetch("https://api.coingecko.com/api/v3/search/trending", {
          signal: controller.signal,
        }),
        fetch("https://api.coingecko.com/api/v3/global", {
          signal: controller.signal,
        }),
      ]);

      clearTimeout(timeoutId);

      if (!marketRes.ok) {
        throw new Error(`Error ${marketRes.status}: Gagal mengambil data`);
      }

      const marketData = await marketRes.json();
      const trendingData = await trendingRes.json();
      const globalData = await globalRes.json();

      setCoins(Array.isArray(marketData) ? marketData : []);
      setTrending(trendingData.coins?.slice(0, 6) || []);
      setGlobal(globalData.data || null);
      setLastUpdated(new Date());
      setPage(1);
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timeout. Silakan coba lagi.");
      } else {
        setError(err.message || "Failed to fetch");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let list = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "gainers") {
      list = list
        .filter((c) => (c.price_change_percentage_24h || 0) > 0)
        .sort(
          (a, b) =>
            (b.price_change_percentage_24h || 0) -
            (a.price_change_percentage_24h || 0)
        );
    } else if (filter === "losers") {
      list = list
        .filter((c) => (c.price_change_percentage_24h || 0) < 0)
        .sort(
          (a, b) =>
            (a.price_change_percentage_24h || 0) -
            (b.price_change_percentage_24h || 0)
        );
    } else {
      list = [...list].sort((a, b) => {
        if (sortBy === "price") return (b.current_price || 0) - (a.current_price || 0);
        if (sortBy === "change")
          return (
            (b.price_change_percentage_24h || 0) -
            (a.price_change_percentage_24h || 0)
          );
        return (b.market_cap || 0) - (a.market_cap || 0);
      });
    }

    return list;
  }, [coins, search, filter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchData} className="retry-btn">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="section-title">Market Overview</h1>
        <button onClick={fetchData} className="refresh-btn">
          Refresh
        </button>
      </div>

      {lastUpdated && (
        <p className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {global && (
        <div className="global-stats">
          <div className="stat-box">
            <span className="label">Market Cap</span>
            <span className="value">
              ${((global.total_market_cap?.usd || 0) / 1e12).toFixed(2)}T
            </span>
          </div>
          <div className="stat-box">
            <span className="label">24h Volume</span>
            <span className="value">
              ${((global.total_volume?.usd || 0) / 1e9).toFixed(2)}B
            </span>
          </div>
          <div className="stat-box">
            <span className="label">BTC Dominance</span>
            <span className="value">
              {(global.market_cap_percentage?.btc || 0).toFixed(1)}%
            </span>
          </div>
          <div className="stat-box">
            <span className="label">Active Coins</span>
            <span className="value">{global.active_cryptocurrencies || "-"}</span>
          </div>
        </div>
      )}

      {trending.length > 0 && (
        <section className="trending-section">
          <h2>Trending</h2>
          <div className="trending-grid">
            {trending.map((item) => (
              <Link
                to={`/coin/${item.item.id}`}
                key={item.item.id}
                className="trending-card"
              >
                <img src={item.item.small} alt={item.item.name} />
                <div>
                  <div className="name">{item.item.name}</div>
                  <div className="symbol">{item.item.symbol}</div>
                </div>
                <span className="rank">#{item.item.market_cap_rank || "-"}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="controls">
        <input
          type="text"
          placeholder="Search coin..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />

        <div className="filter-tabs">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => {
              setFilter("all");
              setPage(1);
            }}
          >
            All
          </button>
          <button
            className={filter === "gainers" ? "active" : ""}
            onClick={() => {
              setFilter("gainers");
              setPage(1);
            }}
          >
            Gainers
          </button>
          <button
            className={filter === "losers" ? "active" : ""}
            onClick={() => {
              setFilter("losers");
              setPage(1);
            }}
          >
            Losers
          </button>
        </div>

        {filter === "all" && (
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="market_cap">Market Cap</option>
            <option value="price">Price</option>
            <option value="change">24h Change</option>
          </select>
        )}
      </div>

      <div className="table-wrapper">
        <table className="coin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                  No coins found
                </td>
              </tr>
            ) : (
              paginated.map((coin, index) => (
                <tr key={coin.id}>
                  <td>{(page - 1) * perPage + index + 1}</td>
                  <td>
                    <Link to={`/coin/${coin.id}`} className="coin-info">
                      <img src={coin.image} alt={coin.name} />
                      <div>
                        <span className="coin-name">{coin.name}</span>
                        <span className="coin-symbol">
                          {coin.symbol.toUpperCase()}
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td>{formatPrice(coin.current_price)}</td>
                  <td
                    className={
                      (coin.price_change_percentage_24h || 0) >= 0
                        ? "positive"
                        : "negative"
                    }
                  >
                    {(coin.price_change_percentage_24h || 0).toFixed(2)}%
                  </td>
                  <td>{formatPrice(coin.market_cap)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
