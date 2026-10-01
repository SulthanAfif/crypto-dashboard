import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Watchlist() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("crypto-watchlist")) || [];
    setList(saved);
  }, []);

  const remove = (id) => {
    const updated = list.filter((c) => c.id !== id);
    localStorage.setItem("crypto-watchlist", JSON.stringify(updated));
    setList(updated);
  };

  if (list.length === 0) {
    return (
      <div className="empty">
        <p>Watchlist masih kosong.</p>
        <p>Tambahkan coin dari halaman detail.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">Watchlist</h1>

      <div className="watchlist-grid">
        {list.map((coin) => (
          <div key={coin.id} className="watchlist-card">
            <Link to={`/coin/${coin.id}`} className="watchlist-info">
              <img src={coin.image} alt={coin.name} />
              <div>
                <div className="name">{coin.name}</div>
                <div className="symbol">{coin.symbol?.toUpperCase()}</div>
              </div>
            </Link>
            <button
              onClick={() => remove(coin.id)}
              className="remove-btn"
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;
