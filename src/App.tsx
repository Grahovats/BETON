import "./App.css";
import { useEffect, useRef, useState } from "react";

type FeedItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  iconSrc: string;
  tagA: string;
  tagB: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  odds: {
    trend: string;
    trendPath: string;
    trendColor: string;
    yesPrice: string;
    noPrice: string;
  };
};

const FEED_ITEMS: FeedItem[] = [
  {
    id: "politics",
    src: "Group 34.png",
    alt: "Beton trending geopolitical market about US strikes on Iran",
    title: "US STRIKES IRAN BY END OF WEEK?",
    iconSrc: "/Ellipse%203.png",
    tagA: "GEOPOLITICS",
    tagB: "MIDDLE EAST",
    engagement: {
      likes: 6900,
      comments: 900,
      shares: 350,
    },
    odds: {
      trend: "7.4%",
      trendPath:
        "M1 10C5 10 8 3 13 3C18 3 20 11 25 11C30 11 33 5 37 5C40 5 41 7 43 7",
      trendColor: "#ff2f2f",
      yesPrice: "7.4",
      noPrice: "92.6",
    },
  },
  {
    id: "sports",
    src: "Group 36.png",
    alt: "Beton trending sports market about English Premier League winner",
    title: "ENG1 PREM: LIVERPOOL WINNER",
    iconSrc: "/Ellipse%203-1.png",
    tagA: "SPORTS",
    tagB: "SOCCER",
    engagement: {
      likes: 18200,
      comments: 2800,
      shares: 1100,
    },
    odds: {
      trend: "64.2%",
      trendPath:
        "M1 12C6 12 9 9 13 9C18 9 20 7 25 7C29 7 31 2 36 2C39 2 41 4 43 4",
      trendColor: "#1dcf5a",
      yesPrice: "64.2",
      noPrice: "35.8",
    },
  },
  {
    id: "culture",
    src: "/Group 37.png",
    alt: "Beton trending market about Jesus Christ return before 2027",
    title: "WILL JESUS CHRIST RETURN BEFORE 2027?",
    iconSrc: "/Ellipse%204.png",
    tagA: "RELIGION",
    tagB: "CULTURE",
    engagement: {
      likes: 29700,
      comments: 4900,
      shares: 1950,
    },
    odds: {
      trend: "44.7%",
      trendPath:
        "M1 5C5 5 8 8 12 8C17 8 20 4 24 4C29 4 31 11 35 11C39 11 41 9 43 9",
      trendColor: "#f5b342",
      yesPrice: "44.7",
      noPrice: "55.3",
    },
  },
];

const CATEGORIES = [
  "TRENDING",
  "BREAKING",
  "NEW",
  "POLITICS",
  "CRYPTO",
  "SPORTS",
];
const TABS = [
  { label: "Home", iconSrc: "/home12.png" },
  { label: "Rewards", iconSrc: "/diamon.png" },
  { label: "Feed", iconSrc: "/feed.png" },
  { label: "Rankings", iconSrc: "/trophy1.png" },
  { label: "Profile", iconSrc: "/profile.png" },
];

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16L21 21" />
  </svg>
);

const LikeIcon = () => (
  <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
    <path d="M12 20.2l-1.2-1.1C6.2 15 3 12.1 3 8.6 3 5.8 5.2 3.6 8 3.6c1.6 0 3.1.7 4 1.9.9-1.2 2.4-1.9 4-1.9 2.8 0 5 2.2 5 5 0 3.5-3.2 6.4-7.8 10.5L12 20.2z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
    <path d="M12 4c-4.4 0-8 2.9-8 6.5c0 2.1 1.2 3.9 3.1 5.1V20l4-2.3c0.3 0 0.6 0.1 0.9 0.1c4.4 0 8-2.9 8-6.5S16.4 4 12 4z" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
    <path d="M5 18c0-5.5 3.8-9.2 9.2-9.2H16V5l6 6-6 6v-3.2h-1.6C9.7 13.8 7 15.4 5 18z" />
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
    <path d="M6 3h12v18l-6-4-6 4V3z" />
  </svg>
);

const CentIcon = () => (
  <svg viewBox="0 0 24 24" className="coin-icon" aria-hidden="true">
    <rect x="10.7" y="2" width="2.6" height="20" rx="1.1" />
    <path
      d="M17.1 7.2a6.6 6.6 0 1 0 0 9.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatEngagement = (value: number) => {
  if (value < 1000) {
    return String(value);
  }

  const thousands = value / 1000;
  const rounded =
    thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
  return `${rounded}K`;
};

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(2);
  const [selectedSide, setSelectedSide] = useState<
    Record<string, "yes" | "no" | null>
  >({});
  const [tradeMode, setTradeMode] = useState<Record<string, "buy" | "sell">>(
    {},
  );
  const feedRef = useRef<HTMLDivElement | null>(null);
  const activeItem = FEED_ITEMS[activeIndex] ?? FEED_ITEMS[0];
  const activeTradeMode = tradeMode[activeItem.id] ?? "buy";

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) {
      return;
    }

    const cards = Array.from(feed.querySelectorAll<HTMLElement>(".feed-card"));
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!activeEntry) {
          return;
        }

        const index = Number(activeEntry.target.getAttribute("data-index"));
        if (!Number.isNaN(index)) {
          setActiveIndex(index);
        }
      },
      { threshold: [0.6, 0.8, 1] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="mobile-root">
      <section className="phone-shell" aria-label="Scrollable feed">
        <div className="feed" ref={feedRef}>
          {FEED_ITEMS.map((item, index) => (
            <article className="feed-card" key={item.id} data-index={index}>
              <img
                className="feed-image"
                src={item.src}
                alt={item.alt}
                loading="lazy"
              />
              <div className="backdrop-layer" />
            </article>
          ))}
        </div>
        <div className="card-ui">
          <header className="top-area">
            <img className="logo-image" src="/BETON%20LOGO.png" alt="BETON" />
            <button className="icon-btn" type="button" aria-label="Search">
              <SearchIcon />
            </button>
          </header>

          <div className="chip-row" role="tablist" aria-label="Categories">
            {CATEGORIES.map((category, categoryIndex) => (
              <button
                key={category}
                type="button"
                className={`chip ${categoryIndex === 0 ? "active" : ""}`}
                aria-selected={categoryIndex === 0}
                role="tab"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="content-area">
            <div className="market-block">
              <h2>
                <span className="title-icon">
                  <img src={activeItem.iconSrc} alt="" />
                </span>
                <span className="title-text">{activeItem.title}</span>
              </h2>
              <div className="meta-tags">
                <span>{activeItem.tagA}</span>
                <span>{activeItem.tagB}</span>
              </div>
              <div className="market-mode">
                <button
                  type="button"
                  className={`trade-pill ${activeTradeMode}`}
                  onClick={() =>
                    setTradeMode((prev) => ({
                      ...prev,
                      [activeItem.id]:
                        activeTradeMode === "buy" ? "sell" : "buy",
                    }))
                  }
                  aria-label={`Switch to ${activeTradeMode === "buy" ? "sell" : "buy"} mode`}
                >
                  <span className="trade-label">
                    {activeTradeMode === "buy" ? "BUY" : "SELL"}
                  </span>
                  <span className="trade-knob" />
                </button>
                <button type="button" className="market-btn">
                  MARKET
                </button>
                <span className="trend-line">
                  <svg
                    viewBox="0 0 44 14"
                    className="trend-chart"
                    style={{ stroke: activeItem.odds.trendColor }}
                    aria-hidden="true"
                  >
                    <path d={activeItem.odds.trendPath} />
                  </svg>
                  <span>
                    <span
                      className="trend-value"
                      style={{ color: activeItem.odds.trendColor }}
                    >
                      {activeItem.odds.trend}
                    </span>{" "}
                    <span className="trend-yes">YES</span>
                  </span>
                </span>
              </div>
              <div className="price-row">
                <button
                  type="button"
                  className={`price-btn yes ${selectedSide[activeItem.id] === "yes" ? "selected" : ""}`}
                  aria-label={`Yes ${activeItem.odds.yesPrice} cents`}
                  onClick={() =>
                    setSelectedSide((prev) => ({
                      ...prev,
                      [activeItem.id]: "yes",
                    }))
                  }
                >
                  <span className="price-content">
                    <span className="price-side-label">YES</span>
                    <span className="price-value">
                      <span>{activeItem.odds.yesPrice}</span>
                      <CentIcon />
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className={`price-btn no ${selectedSide[activeItem.id] === "no" ? "selected" : ""}`}
                  aria-label={`No ${activeItem.odds.noPrice} cents`}
                  onClick={() =>
                    setSelectedSide((prev) => ({
                      ...prev,
                      [activeItem.id]: "no",
                    }))
                  }
                >
                  <span className="price-content">
                    <span className="price-side-label">NO</span>
                    <span className="price-value">
                      <span>{activeItem.odds.noPrice}</span>
                      <CentIcon />
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <aside className="side-actions">
              <button type="button" className="action-btn" aria-label="Like">
                <LikeIcon />
              </button>
              <span>{formatEngagement(activeItem.engagement.likes)}</span>
              <button type="button" className="action-btn" aria-label="Comment">
                <ChatIcon />
              </button>
              <span>{formatEngagement(activeItem.engagement.comments)}</span>
              <button type="button" className="action-btn" aria-label="Share">
                <SendIcon />
              </button>
              <span>{formatEngagement(activeItem.engagement.shares)}</span>
              <button type="button" className="action-btn" aria-label="Save">
                <SaveIcon />
              </button>
            </aside>
          </div>

          <nav
            className="bottom-nav"
            aria-label="Main navigation"
            style={{ ["--active-tab" as string]: String(activeTab) }}
          >
            {TABS.map((tab, tabIndex) => (
              <button
                key={tab.label}
                type="button"
                className={`tab-btn ${tabIndex === activeTab ? "active" : ""}`}
                aria-current={tabIndex === activeTab ? "page" : undefined}
                onClick={() => setActiveTab(tabIndex)}
              >
                <span className="tab-icon-wrap">
                  <img
                    className={`tab-icon-img ${tab.label === "Rankings" ? "tab-icon-trophy" : ""}`}
                    src={tab.iconSrc}
                    alt=""
                    aria-hidden="true"
                  />
                </span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}

export default App;
