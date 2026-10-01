import { useState, useEffect } from "react";
import { useCurrency } from "../context/CurrencyContext";

function Portfolio() {
  const { formatPrice } = useCurrency();
  const [holdings, setHoldings] = useState(() => {
    return JSON.parse(localStorage.getItem("crypto-portfolio")) || [];
  });
  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("crypto-portfolio", JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    if (holdings.length === 0) {
      setPrices({});
      return;
    }

    async function fetchPrices() {
      setLoading(true);
      try {
        const ids = holdings.map((h) => h.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        if (!res.ok) throw new Error("Failed to fetch prices");
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, [holdings]);

  const addHolding = (e) => {
    e.preventDefault();
    const id = coinId.trim().toLowerCase();
    const qty = Number(amount);
    if (!id || !qty || qty <= 0) return;

    const exists = holdings.find((h) => h.id === id);
    if (exists) {
      setHoldings(
        holdings.map((h) =>
          h.id === id ? { ...h, amount: h.amount + qty } : h
        )
      );
    } else {
      setHoldings([...holdings, { id, amount: qty }]);
    }

    setCoinId("");
    setAmount("");
  };

  const removeHolding = (id) => {
    setHoldings(holdings.filter((h) => h.id !== id));
  };

  const totalValue = holdings.reduce((sum, h) => {
    const price = prices[h.id]?.usd || 0;
    return sum + price * h.amount;
  }, 0);

  return (
    <div>
      <h1 className="section-title">Portfolio Tracker</h1>

      <form onSubmit={addHolding} className="portfolio-form">
        <input
          type="text"
          placeholder="Coin id (bitcoin, ethereum, solana)"
          value={coinId}
          onChange={(e) => setCoinId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="any"
          required
        />
        <button type="submit">Add</button>
      </form>

      {holdings.length === 0 ? (
        <p className="empty">Belum ada aset di portfolio.</p>
      ) : (
        <>
          <div className="portfolio-total">
            <span>Total Value</span>
            <strong>{loading ? "..." : formatPrice(totalValue)}</strong>
          </div>

          <div className="portfolio-list">
            {holdings.map((h) => {
              const price = prices[h.id]?.usd || 0;
              const value = price * h.amount;
              return (
                <div key={h.id} className="portfolio-item">
                  <div>
                    <div className="name">{h.id}</div>
                    <div className="amount">
                      {h.amount} · {formatPrice(price)} each
                    </div>
                  </div>
                  <div className="right">
                    <div className="value">{formatPrice(value)}</div>
                    <button onClick={() => removeHolding(h.id)} type="button">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Portfolio;
