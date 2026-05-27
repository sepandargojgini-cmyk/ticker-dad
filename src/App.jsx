import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Cpu, 
  History, 
  DollarSign, 
  Plus, 
  Trash2, 
  Bell, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  CheckCircle, 
  ExternalLink,
  Info,
  DollarSign as MoneyIcon,
  ChevronRight,
  UserCheck,
  Star,
  RefreshCw,
  Award,
  Lock
} from 'lucide-react';

// API Configuration
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
const GEMINI_MODEL = "gemini-2.5-flash";

const PREBAKED_STOCKS = {
  AAPL: {
    ticker: "AAPL",
    companyName: "Apple Inc.",
    earnings: "Apple is like the ultimate luxury suburban lawn mower. It's expensive to buy, but everyone in the neighborhood wants one, and once you start using their ecosystem (iPhones, Apple Watch, iCloud), you are locked in. They generate massive piles of cash because they don't just sell you the hardware; they keep charging you 'rent' for services every month.",
    valuation: "Historically, it's priced like a top-of-the-line Weber Grill. You are paying a premium for the brand and reliability. It's rarely 'cheap,' but you're paying for a product that holds its value. Right now, it's trading at a premium, meaning you are paying extra for that shiny Apple logo.",
    risks: "Their biggest risk is that we've reached 'peak smartphone.' If people start keeping their old iPhones for 4 or 5 years instead of upgrading every 2, that massive cash machine slows down. Also, if governments force them to open up their App Store lockbox, they lose some of that lucrative toll-road revenue.",
    ai_exposure: "They aren't building giant hyper-intelligent robot armies, but they are sneaking AI into your pocket with 'Apple Intelligence.' Think of it as a smart helper that summarizes your spouse's long texts while you're driving. It’s practical, everyday AI designed to make you upgrade your phone.",
    historical_context: "Over the last decade, Apple has gone from a volatile tech stock to basically a consumer staple. It's currently sitting near its historical highs. It's like buying a house in the best school district—you almost never get it on clearance sale.",
    dad_take: "Look, Apple is a fortress. It's the kind of stock you buy, tuck away in the college fund drawer, and don't look at for ten years. Just don't expect it to double overnight. It's a reliable family station wagon, not a racing motorcycle."
  },
  NVDA: {
    ticker: "NVDA",
    companyName: "NVIDIA Corporation",
    earnings: "NVIDIA is currently the only store in town selling the high-end shovels for the AI Gold Rush. Every massive tech company (Microsoft, Google, Meta) is throwing billions of dollars at them to buy their microchips (GPUs). They are making money faster than a teenager with a fresh driver's license and unlimited gas money.",
    valuation: "It is priced like a high-performance Italian sports car. Sure, it goes incredibly fast, but if there's a single dent in the bumper (or a slight miss in sales growth), the repair bill will be astronomical. The price expects absolute perfection for the next five years.",
    risks: "What goes up must eventually find a cruise altitude. If Big Tech realizes they bought too many 'shovels' and don't actually know how to make money from the AI gold, they will stop ordering chips. Also, competitors like AMD and even their own customers are trying to build their own chips to cut NVIDIA out.",
    ai_exposure: "They are the beating heart of AI. Without NVIDIA, there are no smart chatbots, no automated driving, and no advanced image generators. They don't just have AI exposure; they practically own the infrastructure.",
    historical_context: "We have never seen a stock move like this in modern history. It has gone from a niche video game chipmaker to one of the most valuable companies on the planet. It is historically in uncharted territory—hyper-expensive compared to its 10-year average.",
    dad_take: "This is high-octane stuff. It could make you look like a genius at the neighborhood barbecue, or it could give you an ulcer. If you buy, treat it like toy money—do not risk the mortgage payment on it."
  },
  TSLA: {
    ticker: "TSLA",
    companyName: "Tesla, Inc.",
    earnings: "Tesla is a car company, a battery factory, and a robotics lab all rolled into one chaotic garage. They make great profit margins on electric vehicles compared to old-school carmakers, but vehicle sales are highly cyclical—when budgets get tight, people don't buy new luxury EVs.",
    valuation: "If you value them just as a car manufacturer, the price is absurdly expensive. If you value them as a futuristic robotics and autonomous taxi company, it might make sense. You are essentially paying for a promise of the future, not just the cars on the road today.",
    risks: "Elon Musk is both their greatest asset and a wild card. If he gets distracted by his other five companies, or if cheap Chinese electric vehicles flood the market, Tesla's margins will get squeezed like a lemon in a lemonade stand.",
    ai_exposure: "Incredible AI potential, but it's high-risk. Their 'Full Self-Driving' relies on massive neural networks, and they are building 'Optimus' humanoid robots. They aren't just using AI to write emails; they are trying to put AI into physical machines that move around the real world.",
    historical_context: "Tesla is famous for wild roller coaster rides. It can drop 50% in a few months and then shoot up 150%. It is currently priced with a lot of optimism, way higher than traditional industrial stocks, but still below its all-time peak panic-buying levels.",
    dad_take: "Tesla is like that project car in the garage. It could turn into a pristine, classic hot rod, or it could sit on blocks taking up space for years. Only invest money you are entirely comfortable watching bounce up and down."
  },
  SBUX: {
    ticker: "SBUX",
    companyName: "Starbucks Corporation",
    earnings: "Starbucks makes money by selling premium daily habits. It's the 'Third Place' between home and work. They generate massive cash flow because coffee has incredibly low raw ingredient costs, and their mobile app functions basically like a bank where customers deposit millions of prepay dollars.",
    valuation: "It's priced like a reliable household appliance. It's not a flashy sports car, but it's consistent. Right now, because of some growth struggles in China and local competition, it is trading at a more reasonable valuation than it has in years—essentially on a minor department store discount.",
    risks: "Coffee beans are getting more expensive to grow due to climate changes, and labor costs are rising as workers push for unionization. Also, if the economy really slows down, people might decide to make their coffee at home instead of paying $7 for a Caramel Macchiato.",
    ai_exposure: "Very low in terms of advanced tech, but they use simple machine learning for their mobile app's personalized offers (e.g., 'Buy a muffin today and get 50 extra stars!'). They aren't building terminators; they are just trying to get you to buy more caffeine.",
    historical_context: "Over 20 years, Starbucks has been an incredible steady compounder. It's currently in a rare slump, trading at valuations closer to its post-pandemic lows. It's like finding a solid pair of leather work boots on the clearance rack because of minor cosmetic scuffs.",
    dad_take: "This is a 'Dad Classic.' It's slow, boring, pays a decent quarterly dividend check (which is basically free money), and sells a product that people are physically addicted to. A great candidate for the slow-and-steady retirement pile."
  }
};

export default function App() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(PREBAKED_STOCKS.AAPL); 
  const [activeTab, setActiveTab] = useState("analysis"); 
  const [loadingTip, setLoadingTip] = useState("");
  
  const [watchlist, setWatchlist] = useState(["AAPL", "SBUX"]);
  const [alerts, setAlerts] = useState([
    { id: 1, ticker: "AAPL", type: "drops_below", value: 175, active: true },
    { id: 2, ticker: "NVDA", type: "rises_above", value: 150, active: false }
  ]);
  const [newAlert, setNewAlert] = useState({ ticker: "", type: "drops_below", value: "" });
  const [checklistScore, setChecklistScore] = useState({
    understand: false,
    sleepWell: false,
    cashReliable: false,
    onSale: false,
    diversified: false
  });

  const loadingTips = [
    "Checking if we left the garage door open...",
    "Consulting the official Thermostat Rules handbook...",
    "Comparing prices with the hardware store down the street...",
    "Reading the newspaper with glasses on the tip of the nose...",
    "Checking the engine oil level of this stock...",
    "Double-checking if we really need to buy this brand-name...",
    "Ensuring the emergency fund is safely locked away..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingTip(loadingTips[0]);
      interval = setInterval(() => {
        const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
        setLoadingTip(randomTip);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSelectPrebaked = (symbol) => {
    setAnalysis(PREBAKED_STOCKS[symbol]);
    setTicker("");
    setError(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) return;

    if (PREBAKED_STOCKS[cleanTicker]) {
      setAnalysis(PREBAKED_STOCKS[cleanTicker]);
      setTicker("");
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const systemPrompt = `You are "TickerDad", a seasoned, friendly, no-nonsense dad explaining stocks to a busy parent. Use highly relatable dad analogies (mowing lawns, fixing cars, grocery shopping, allowance, kids' college funds, backyard barbecues) and avoid financial jargon entirely. Break down your analysis into clear, structured sections. Maintain a strict educational tone with a warm disclaimer that this is NOT professional financial advice. Always relate things back to protecting the family budget.`;

    const userQuery = `Analyze the stock ticker "${cleanTicker}" as TickerDad. Please research and explain:
    1. The company name and what they actually make/do.
    2. Earnings: How do they generate cash? (Use a simple household or chore analogy).
    3. Valuation: Is it expensive or reasonable right now? (Use a shopping/dealership analogy).
    4. Risks: What could break the engine or blow off the roof? (List 1-2 major threats).
    5. AI Exposure: Are they riding the high-tech robot wave, or just slapping a trendy sticker on a basic tool?
    6. Historical Context: Is it currently marked up for holiday hype, or sitting on the clearance rack?
    7. Dad's Take: Your ultimate warm, common-sense summary. Remind the user to protect their emergency fund.`;

    const payload = {
      contents: [{
        parts: [{ text: userQuery }]
      }],
      tools: [{ "google_search": {} }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            ticker: { type: "STRING" },
            companyName: { type: "STRING" },
            earnings: { type: "STRING" },
            valuation: { type: "STRING" },
            risks: { type: "STRING" },
            ai_exposure: { type: "STRING" },
            historical_context: { type: "STRING" },
            dad_take: { type: "STRING" }
          },
          required: ["ticker", "companyName", "earnings", "valuation", "risks", "ai_exposure", "historical_context", "dad_take"]
        }
      }
    };

    const fetchWithRetry = async (url, fetchOptions, retries = 5, delay = 1000) => {
      try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        return await response.json();
      } catch (err) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(url, fetchOptions, retries - 1, delay * 2);
        }
        throw err;
      }
    };

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
      const data = await fetchWithRetry(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error("No response received from TickerDad AI. Try again in a minute, champ.");
      }

      const parsedAnalysis = JSON.parse(responseText);
      setAnalysis(parsedAnalysis);
      setTicker("");
    } catch (err) {
      console.error(err);
      setError(`Ah, looks like the internet lines are acting up: "${err.message || err}". Let's check if the VITE_GEMINI_API_KEY inside your .env is copied correctly, or try one of Dad's pre-approved favorites below!`);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (symbol) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter(item => item !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const handleAddAlert = (e) => {
    e.preventDefault();
    if (!newAlert.ticker || !newAlert.value) return;
    const alertItem = {
      id: Date.now(),
      ticker: newAlert.ticker.toUpperCase(),
      type: newAlert.type,
      value: parseFloat(newAlert.value),
      active: true
    };
    setAlerts([alertItem, ...alerts]);
    setNewAlert({ ticker: "", type: "drops_below", value: "" });
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const toggleAlertActive = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const trueCount = Object.values(checklistScore).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-4 py-1 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">PROMO</span>
        <span>Get 5 free fractional shares when you open an account with our partner broker.</span>
        <button 
          onClick={() => setActiveTab("brokers")} 
          className="underline hover:text-emerald-100 font-semibold inline-flex items-center gap-0.5"
        >
          View Brokers <ChevronRight size={12} />
        </button>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-xl shadow-lg shadow-emerald-500/10">
              <span className="text-xl font-black text-slate-950 tracking-tighter">TD</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">TickerDad <span className="text-emerald-400">AI</span></h1>
                <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-medium border border-slate-700">Busy Dad Mode</span>
              </div>
              <p className="text-xs text-slate-400">Common-sense stock breakdowns for busy parents with zero free time.</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button 
              onClick={() => setActiveTab("analysis")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "analysis" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <BookOpen size={14} />
              Stock Explainer
            </button>
            <button 
              onClick={() => setActiveTab("checklist")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "checklist" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <UserCheck size={14} />
              Dad's Checklist
              {trueCount > 0 && (
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {trueCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("alerts")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "alerts" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Bell size={14} />
              AI Smart Alerts
            </button>
            <button 
              onClick={() => setActiveTab("brokers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "brokers" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <MoneyIcon size={14} />
              Family Investing Hub
            </button>
          </nav>

        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Search bar section */}
        <section className="mb-8">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="text-emerald-400" size={18} />
                Ask TickerDad about any Stock
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Enter any public stock ticker (e.g., <span className="font-mono text-emerald-400">MSFT</span>, <span className="font-mono text-emerald-400">DIS</span>, <span className="font-mono text-emerald-400">WMT</span>, <span className="font-mono text-emerald-400">KO</span>). Our AI searches current market data and explains it like a common-sense parent.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                    <Search size={18} />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Enter ticker (e.g. KO, AAPL, COST)" 
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold tracking-wider text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Explain It"
                  )}
                </button>
              </form>

              {/* API Diagnostics Section */}
              <div className="mt-3 p-2 bg-slate-900/50 rounded-lg border border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Info size={12} className="text-slate-500" />
                  Local Connection Status:
                </span>
                {apiKey ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    API Key Detected from .env
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Key Missing (Check file rename/server restart)
                  </span>
                )}
              </div>
            </div>

            {/* Quick Favorites Row */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Dad's Rolodex (Instant Views):</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(PREBAKED_STOCKS).map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => handleSelectPrebaked(symbol)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                      analysis?.ticker === symbol 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40" 
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Content Tabs Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {error && (
              <div className="p-4 bg-rose-950/40 border border-rose-800/50 rounded-xl text-rose-300 text-sm flex gap-3 items-start">
                <ShieldAlert className="text-rose-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold">Darn it, kid.</p>
                  <p className="mt-1 text-rose-400/90">{error}</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-emerald-400 animate-pulse" size={20} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Consulting TickerDad's Notebook</h3>
                <p className="text-sm text-slate-400 max-w-sm italic">
                  "{loadingTip}"
                </p>
              </div>
            )}

            {/* TAB: ANALYSIS */}
            {!loading && activeTab === "analysis" && analysis && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Title */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-extrabold rounded-md border border-emerald-500/20">
                        {analysis.ticker}
                      </span>
                      <h2 className="text-xl font-extrabold text-white">{analysis.companyName}</h2>
                    </div>
                    <p className="text-xs text-slate-400">Analysis updated recently using direct grounded intelligence.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleWatchlist(analysis.ticker)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        watchlist.includes(analysis.ticker)
                          ? "bg-slate-900 border-slate-800 text-slate-300"
                          : "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-500"
                      }`}
                    >
                      {watchlist.includes(analysis.ticker) ? (
                        <>
                          <CheckCircle size={14} className="text-emerald-400" />
                          Pinned in Ledger
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          Pin to Ledger (Watchlist)
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Information cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-800 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                          <MoneyIcon size={18} />
                        </div>
                        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Earnings (The Allowance)</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {analysis.earnings}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-800 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                          <DollarSign size={18} />
                        </div>
                        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Valuation (The Price Tag)</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {analysis.valuation}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-800 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                          <AlertTriangle size={18} />
                        </div>
                        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Risks (The Danger Zone)</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {analysis.risks}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-800 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                          <Cpu size={18} />
                        </div>
                        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">AI Exposure (Robo-Upgrade)</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {analysis.ai_exposure}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <History size={18} />
                    </div>
                    <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Historically Speaking (On Sale?)</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysis.historical_context}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-800/40 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute right-3 top-3 opacity-10">
                    <Award size={80} className="text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-xl">👨‍👦</span>
                    <h3 className="font-extrabold text-white text-md">Dad's Verdict</h3>
                  </div>
                  <p className="text-xs text-emerald-100/90 leading-relaxed italic font-medium mb-4">
                    "{analysis.dad_take}"
                  </p>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                    <Info size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Important Rule of the House:</strong> TickerDad is just sorting through the noise to help you learn. This is not licensed financial or investment advice. Do not invest the kids' brace money, and always consult your spouse before making major plays.
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: CHECKLIST */}
            {activeTab === "checklist" && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">📋</span>
                    <h2 className="text-lg font-bold text-white">Dad's Common-Sense Checklist</h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Before we spend hard-earned money on ANY individual stock, check off these simple safety rules. The more checks, the sturdier the stock.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Safety Score</p>
                    <p className="text-xl font-black text-emerald-400 mt-1">
                      {trueCount}/5 Checks Approved
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                      trueCount >= 4 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : trueCount >= 2 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                      {trueCount >= 4 ? "Solid Foundation" : trueCount >= 2 ? "Proceed with Caution" : "High Risk / Speculative"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 bg-slate-900 hover:bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={checklistScore.understand}
                      onChange={(e) => setChecklistScore({ ...checklistScore, understand: e.target.checked })}
                      className="mt-1 accent-emerald-500 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Rule 1: Simple Mechanics</span>
                      <span className="text-xs text-slate-400">Do I actually understand how this company produces cash? If I can't explain their business to a 10-year-old in three sentences, I don't buy it.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 bg-slate-900 hover:bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={checklistScore.sleepWell}
                      onChange={(e) => setChecklistScore({ ...checklistScore, sleepWell: e.target.checked })}
                      className="mt-1 accent-emerald-500 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Rule 2: The Sleep Test</span>
                      <span className="text-xs text-slate-400">If this stock drops 25% tomorrow because of overall market panic, will I sleep like a baby or panic-sell at the bottom? (Buy only what you trust).</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 bg-slate-900 hover:bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={checklistScore.cashReliable}
                      onChange={(e) => setChecklistScore({ ...checklistScore, cashReliable: e.target.checked })}
                      className="mt-1 accent-emerald-500 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Rule 3: Real Cash Flow</span>
                      <span className="text-xs text-slate-400">Do they make actual, cold-hard profits, or are they just burning investor money while promising future riches? Real companies have real income.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 bg-slate-900 hover:bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={checklistScore.onSale}
                      onChange={(e) => setChecklistScore({ ...checklistScore, onSale: e.target.checked })}
                      className="mt-1 accent-emerald-500 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Rule 4: Not Buying at the Peak</span>
                      <span className="text-xs text-slate-400">Is the valuation reasonable, or am I buying at an all-time high purely because of neighborhood gossip and news headlines?</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 bg-slate-900 hover:bg-slate-900/80 rounded-xl border border-slate-800 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={checklistScore.diversified}
                      onChange={(e) => setChecklistScore({ ...checklistScore, diversified: e.target.checked })}
                      className="mt-1 accent-emerald-500 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Rule 5: Keep the Ship Balanced</span>
                      <span className="text-xs text-slate-400">Is my overall portfolio diversified? Put your main eggs in broad, cheap index funds (S&P 500) before placing bets on individual stocks.</span>
                    </div>
                  </label>
                </div>

                <div className="p-4 bg-emerald-950/20 rounded-xl text-center">
                  <p className="text-xs text-emerald-400/90 font-medium">
                    "Slow and steady wins the race. Invest for decades, not for dinner."
                  </p>
                </div>
              </div>
            )}

            {/* TAB: ALERTS */}
            {activeTab === "alerts" && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🔔</span>
                    <h2 className="text-lg font-bold text-white">AI Smart Alerts (Family Assistant)</h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Don't spend your weekends watching tickers. Set up an alert, and TickerDad will text or email you when a stock enters your buying zone.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleAddAlert} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Stock Ticker</label>
                    <input 
                      type="text" 
                      placeholder="AAPL" 
                      value={newAlert.ticker}
                      onChange={(e) => setNewAlert({ ...newAlert, ticker: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 uppercase"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Condition</label>
                    <select 
                      value={newAlert.type}
                      onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="drops_below">Drops Below ($)</option>
                      <option value="rises_above">Rises Above ($)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Target Price</label>
                    <input 
                      type="number" 
                      placeholder="150" 
                      value={newAlert.value}
                      onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1 flex items-end">
                    <button 
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <Plus size={14} />
                      Set Alert
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Watchdogs</h3>
                  {alerts.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-6">No alerts set up yet. Keep an eye out!</p>
                  ) : (
                    <div className="space-y-2">
                      {alerts.map((item) => (
                        <div key={item.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs border border-emerald-500/10">
                              {item.ticker}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-white">
                                Notify me when {item.ticker} {item.type === 'drops_below' ? 'drops below' : 'rises above'} ${item.value}
                              </p>
                              <p className="text-[10px] text-slate-400">Via Email & Mobile Notification</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => toggleAlertActive(item.id)}
                              className={`w-8 h-4 rounded-full p-0.5 transition-all focus:outline-none ${
                                item.active ? "bg-emerald-600 flex justify-end" : "bg-slate-700 flex justify-start"
                              }`}
                            >
                              <span className="w-3 h-3 bg-white rounded-full shadow-md"></span>
                            </button>
                            <button 
                              onClick={() => deleteAlert(item.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                      <Lock size={16} />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        TickerDad Premium SMS Notifications
                        <span className="bg-purple-500/20 text-purple-300 text-[9px] px-1.5 py-0.2 rounded font-bold">PRO</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">Get urgent text alerts directly to your cell phone during market storms.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert("This is a demo setup! Direct SMS alerts will be available in the upcoming Premium TickerDad launch.")}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-all"
                  >
                    Upgrade for $4/mo
                  </button>
                </div>

              </div>
            )}

            {/* TAB: BROKERS */}
            {activeTab === "brokers" && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🤝</span>
                    <h2 className="text-lg font-bold text-white">Family-Friendly Broker Partners</h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Setting up a custodial account for the kids or your own personal Roth IRA? We recommend these high-trust, low-fee brokerages. Open an account to help keep this tool free!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-extrabold text-white text-sm">Robinhood</h3>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">Top Pick for Simplicity</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        Extremely simple layout, perfect for busy parents to buy fractional shares in 30 seconds between tasks. Free commission, no minimums.
                      </p>
                      <div className="p-2.5 bg-emerald-950/20 rounded-lg border border-emerald-900/30 text-[10px] text-emerald-400 font-semibold mb-4">
                        🎁 Promo: Get up to $200 in free stock upon signing up.
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Redirecting you to our partner brokerage promo... (Simulated link)")}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                    >
                      Get Free Stock <ExternalLink size={12} />
                    </button>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-extrabold text-white text-sm">Fidelity Investments</h3>
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold">Top Pick for Kids' Custodial</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        The ultimate gold-standard for retirement planning and high-trust custody accounts. Offer fantastic youth accounts with zero monthly fees.
                      </p>
                      <div className="p-2.5 bg-indigo-950/20 rounded-lg border border-indigo-900/30 text-[10px] text-indigo-400 font-semibold mb-4">
                        🎁 Promo: Open a Fidelity Youth Account and get a $50 cash bonus.
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Redirecting to Fidelity Youth accounts page... (Simulated link)")}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                    >
                      Open Custodial Account <ExternalLink size={12} />
                    </button>
                  </div>

                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                    <Info size={14} className="text-emerald-400" />
                    How to Setup a Custodial Account (UTMA/UGMA)
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A custodial account is simply an investment account opened by you (the custodian) for your minor child. It transfers automatically to them when they reach adulthood (usually 18 or 21). You can use any money placed here to buy broad stock indices (like the S&P 500) to help pay for college, down payments, or a wedding down the line!
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="text-amber-400 fill-amber-400/20" size={18} />
                  <h3 className="font-bold text-white text-sm">Family Ledger</h3>
                </div>
                <span className="bg-slate-900 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-800 font-semibold">
                  {watchlist.length} Tickers
                </span>
              </div>

              {watchlist.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-500 italic">Ledger is empty.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Search a stock and click "Pin to Ledger" to keep track here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {watchlist.map((sym) => {
                    const info = PREBAKED_STOCKS[sym];
                    return (
                      <div 
                        key={sym} 
                        className="p-3 bg-slate-900 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700/60 rounded-xl flex items-center justify-between transition-all cursor-pointer"
                        onClick={() => handleSelectPrebaked(sym)}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-extrabold text-xs text-white bg-slate-950 px-2 py-1 rounded border border-slate-800">
                            {sym}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                              {info?.companyName || "Custom stock"}
                            </p>
                            <p className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                              <TrendingUp size={10} /> Saved to Ledger
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(sym);
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-900/30 text-[11px] text-slate-300">
                  <p className="font-bold text-white mb-1">🔥 TickerDad Pro Watchlists</p>
                  <p className="text-slate-400 text-[10px] mb-2 leading-relaxed">Unlock templates like: "The Braces Fund" and "Recession-Proof Divs".</p>
                  <button 
                    onClick={() => alert("Unlock pre-built templates is part of the upcoming premium ledger package! Coming soon.")}
                    className="w-full bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold py-1.5 px-2 rounded-lg text-[10px] text-center transition-all"
                  >
                    Unlock Pro Ledgers ($5)
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <ShieldAlert className="text-emerald-400" size={18} />
                Dad's Backyard Rules
              </h3>
              
              <ul className="space-y-3.5">
                <li className="flex gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">1.</span>
                  <div className="text-xs">
                    <strong className="text-white">Broad Index Funds First:</strong>
                    <p className="text-slate-400 mt-0.5">The absolute foundation of your family's future should be generic, low-fee index funds. Individual stocks are only for extra 'fun' funds.</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">2.</span>
                  <div className="text-xs">
                    <strong className="text-white">Dollar Cost Averaging:</strong>
                    <p className="text-slate-400 mt-0.5">Don't try to time the exact bottom of the market. Put in a small, steady amount every single month, whether the stock market is having a good day or bad day.</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">3.</span>
                  <div className="text-xs">
                    <strong className="text-white">Set It and Forget It:</strong>
                    <p className="text-slate-400 mt-0.5">Checking stock prices every hour is a recipe for white hairs. Buy solid companies, turn on automated dividend reinvestment (DRIP), and go enjoy soccer practice.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md text-center">
              <span className="text-2xl">☕</span>
              <h4 className="font-bold text-white text-xs mt-2">Have a question for TickerDad?</h4>
              <p className="text-[11px] text-slate-400 mt-1 mb-3">Send over your tickers or strategy questions for the next weekend newsletter.</p>
              <button 
                onClick={() => alert("Send us an email at ask@ticker-dad-newsletter.com! (Mock mailbox)")}
                className="inline-flex items-center gap-1 bg-slate-900 border border-slate-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all"
              >
                Send a Question
              </button>
            </div>

          </div>

        </div>

      </main>

      <footer className="border-t border-slate-800 bg-slate-950 text-slate-500 py-12 px-4 mt-16 text-xs">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xl">👨‍👦</span>
              <div>
                <p className="font-bold text-slate-300">TickerDad Stock Explainer</p>
                <p className="text-[11px]">Helping parents protect and build their family nest egg, step-by-step.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-[11px]">
              <a href="#" onClick={(e) => { e.preventDefault(); alert("We never sell your family's data. Everything runs local and safe."); }} className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("This is an educational platform designed to teach stock analysis basics using easy analogies."); }} className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Contact us at help@ticker-dad-ai-helper.com"); }} className="hover:text-slate-300 transition-colors">Support Desk</a>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-6 text-[10px] text-slate-600 leading-relaxed">
            <p className="mb-2">
              <strong>Disclaimer of Liability:</strong> TickerDad AI is an automated educational tool running the Gemini LLM with Google Search grounding. TickerDad is not a registered investment advisor, certified financial planner, or tax specialist. All opinions expressed represent simulated common-sense explanations. No information here should be construed as direct recommendation to buy or sell any security.
            </p>
            <p>
              Past performance does not guarantee future outcomes. Individual stocks carry a significant risk of loss. Always establish a robust personal emergency fund (at least 3-6 months of family living expenses) and secure reliable health insurance before placing funds in high-risk assets.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}