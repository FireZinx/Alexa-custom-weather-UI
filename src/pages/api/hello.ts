import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = (req.query.symbol as string) || "INTC";

  try {
    const YahooFinance = require("yahoo-finance2").default;
    const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
    const quote = await yahooFinance.quote(symbol);
    res.status(200).json({
      symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      percent: quote.regularMarketChangePercent,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}