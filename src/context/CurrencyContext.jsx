import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("crypto-currency") || "usd";
  });

  const changeCurrency = (value) => {
    setCurrency(value);
    localStorage.setItem("crypto-currency", value);
  };

  // Rate kasar (bisa diganti API real nanti)
  const rates = {
    usd: 1,
    idr: 16000, // contoh rate
  };

  const formatPrice = (priceInUsd) => {
    if (!priceInUsd && priceInUsd !== 0) return "-";
    const value = priceInUsd * (rates[currency] || 1);

    if (currency === "idr") {
      return (
        "Rp " + value.toLocaleString("id-ID", { maximumFractionDigits: 0 })
      );
    }
    return "$" + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
