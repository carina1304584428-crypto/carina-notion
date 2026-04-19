const defaultConfig = {
  theme: "light",
  bg: "#f5f5f5",
  text: "#111111",
  accent: "#333333",
  muted: "#e5e5e5",
  width: 420,
  clockSize: 56,
  labelSize: 16,
  valueSize: 14,
  showFooter: true,
  footerText: "Powered by Your Widget",
  showClock: true,
  showYear: true,
  showMonth: true,
  showWeek: true,
  yearLabel: "Year",
  monthLabel: "Month",
  weekLabel: "Week",
  weekStart: "monday" // monday | sunday
};

function parseBoolean(value, fallback) {
  if (value === null) return fallback;
  return value === "true";
}

function parseNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getConfigFromURL() {
  const params = new URLSearchParams(window.location.search);

  const config = {
    ...defaultConfig,
    theme: params.get("theme") || defaultConfig.theme,
    bg: params.get("bg") || defaultConfig.bg,
    text: params.get("text") || defaultConfig.text,
    accent: params.get("accent") || defaultConfig.accent,
    muted: params.get("muted") || defaultConfig.muted,
    width: parseNumber(params.get("width"), defaultConfig.width),
    clockSize: parseNumber(params.get("clockSize"), defaultConfig.clockSize),
    labelSize: parseNumber(params.get("labelSize"), defaultConfig.labelSize),
    valueSize: parseNumber(params.get("valueSize"), defaultConfig.valueSize),
    showFooter: parseBoolean(params.get("showFooter"), defaultConfig.showFooter),
    footerText: params.get("footerText") || defaultConfig.footerText,
    showClock: parseBoolean(params.get("showClock"), defaultConfig.showClock),
    showYear: parseBoolean(params.get("showYear"), defaultConfig.showYear),
    showMonth: parseBoolean(params.get("showMonth"), defaultConfig.showMonth),
    showWeek: parseBoolean(params.get("showWeek"), defaultConfig.showWeek),
    yearLabel: params.get("yearLabel") || defaultConfig.yearLabel,
    monthLabel: params.get("monthLabel") || defaultConfig.monthLabel,
    weekLabel: params.get("weekLabel") || defaultConfig.weekLabel,
    weekStart: params.get("weekStart") || defaultConfig.weekStart
  };

  if (config.theme === "dark") {
    config.bg = params.get("bg") || "#111111";
    config.text = params.get("text") || "#f5f5f5";
    config.muted = params.get("muted") || "#2c2c2c";
    config.accent = params.get("accent") || "#d0d0d0";
  }

  return config;
}

function applyConfig(config) {
  const root = document.documentElement;

  root.style.setProperty("--bg", config.bg);
  root.style.setProperty("--text", config.text);
  root.style.setProperty("--muted", config.muted);
  root.style.setProperty("--accent", config.accent);
  root.style.setProperty("--width", `${config.width}px`);
  root.style.setProperty("--clock-size", `${config.clockSize}px`);
  root.style.setProperty("--label-size", `${config.labelSize}px`);
  root.style.setProperty("--value-size", `${config.valueSize}px`);

  document.getElementById("yearLabel").textContent = config.yearLabel;
  document.getElementById("monthLabel").textContent = config.monthLabel;
  document.getElementById("weekLabel").textContent = config.weekLabel;

  document.getElementById("clock").style.display = config.showClock ? "block" : "none";
  document.getElementById("yearRow").style.display = config.showYear ? "grid" : "none";
  document.getElementById("monthRow").style.display = config.showMonth ? "grid" : "none";
  document.getElementById("weekRow").style.display = config.showWeek ? "grid" : "none";

  const footer = document.getElementById("footer");
  footer.style.display = config.showFooter ? "block" : "none";
  footer.textContent = config.footerText;
}

function pad(num) {
  return String(num).padStart(2, "0");
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getDaysInYear(year) {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getWeekProgress(date, weekStart) {
  const day = date.getDay(); // 0=Sunday, 1=Monday
  if (weekStart === "sunday") {
    return day + 1;
  }
  return day === 0 ? 7 : day;
}

function updateWidget(config) {
  const now = new Date();

  if (config.showClock) {
    document.getElementById("clock").textContent =
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }

  if (config.showYear) {
    const dayOfYear = getDayOfYear(now);
    const totalDaysYear = getDaysInYear(now.getFullYear());
    const yearPercent = (dayOfYear / totalDaysYear) * 100;
    document.getElementById("yearFill").style.width = `${yearPercent}%`;
    document.getElementById("yearValue").textContent = `${dayOfYear}/${totalDaysYear}`;
  }

  if (config.showMonth) {
    const dayOfMonth = now.getDate();
    const totalDaysMonth = getDaysInMonth(now.getFullYear(), now.getMonth());
    const monthPercent = (dayOfMonth / totalDaysMonth) * 100;
    document.getElementById("monthFill").style.width = `${monthPercent}%`;
    document.getElementById("monthValue").textContent = `${dayOfMonth}/${totalDaysMonth}`;
  }

  if (config.showWeek) {
    const dayOfWeek = getWeekProgress(now, config.weekStart);
    const weekPercent = (dayOfWeek / 7) * 100;
    document.getElementById("weekFill").style.width = `${weekPercent}%`;
    document.getElementById("weekValue").textContent = `${dayOfWeek}/7`;
  }
}

const config = getConfigFromURL();
applyConfig(config);
updateWidget(config);
setInterval(() => updateWidget(config), 1000);
