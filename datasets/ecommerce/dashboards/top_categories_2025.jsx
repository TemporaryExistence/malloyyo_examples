import { useQuery } from "@malloyyo/dashboard";

const BLUE = "#2a6fb0";
const INK = "#1f2933";
const MUTED = "#6b7785";
const money = (n) => "$" + Math.round(Number(n)).toLocaleString();
const pct = (n) => (Number(n) >= 0 ? "+" : "") + (Number(n) * 100).toFixed(1) + "%";

function Section({ title, q, children }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: INK, margin: "0 0 12px" }}>{title}</h2>
      {q.error ? <p style={{ color: "#b3261e" }}>Query failed: {String(q.error)}</p>
        : q.loading ? <p style={{ color: MUTED }}>Loading…</p>
        : children}
    </section>
  );
}

const th = { textAlign: "left", fontWeight: 500, color: MUTED, fontSize: 12, padding: "6px 8px", borderBottom: "1px solid #d9dee4" };
const td = { padding: "8px", fontSize: 14, color: INK, borderBottom: "1px solid #eef1f4" };

export default function Dashboard() {
  const all = useQuery({ query: "top_categories_2025" });
  const rows = (all.rows ?? []).map((r) => ({
    category: String(r.category),
    s25: Number(r.sales_2025),
    s24: Number(r.sales_2024),
    growth: Number(r.growth),
  }));
  const top5 = rows.slice(0, 5);
  const fastestTop = [...top5].sort((a, b) => b.growth - a.growth)[0];
  const fastestAll = [...rows].sort((a, b) => b.growth - a.growth)[0];
  const maxS = Math.max(1, ...top5.map((r) => r.s25));
  const byGrowth = [...rows].sort((a, b) => b.growth - a.growth);
  const maxG = Math.max(0.0001, ...rows.map((r) => r.growth));

  return (
    <div style={{ padding: 24, maxWidth: 960, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: INK, margin: 0 }}>Top categories, 2025</h1>
      <p style={{ color: MUTED, margin: "4px 0 0", fontSize: 13 }}>Sales by product category; growth is 2025 versus 2024.</p>

      {fastestTop && (
        <div style={{ display: "flex", gap: 48, marginTop: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 40, fontWeight: 600, color: INK }}>{money(top5.reduce((a, r) => a + r.s25, 0))}</div>
            <div style={{ fontSize: 12, color: MUTED }}>Top 5 categories, 2025 sales</div>
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 600, color: INK }}>{pct(fastestTop.growth)}</div>
            <div style={{ fontSize: 12, color: MUTED }}>Fastest growth in top 5: {fastestTop.category}</div>
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 600, color: INK }}>{pct(fastestAll.growth)}</div>
            <div style={{ fontSize: 12, color: MUTED }}>Fastest growth overall: {fastestAll.category}</div>
          </div>
        </div>
      )}

      <Section title="Top 5 categories by 2025 sales" q={all}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr><th style={th}>#</th><th style={th}>Category</th><th style={th}>2025 sales</th><th style={{ ...th, width: "30%" }}></th><th style={th}>2024 sales</th><th style={th}>Growth</th></tr>
          </thead>
          <tbody>
            {top5.map((r, i) => (
              <tr key={r.category}>
                <td style={{ ...td, color: MUTED }}>{i + 1}</td>
                <td style={td}>{r.category}</td>
                <td style={td}>{money(r.s25)}</td>
                <td style={td}>
                  <div style={{ height: 10, width: (r.s25 / maxS * 100) + "%", background: BLUE, borderRadius: "0 4px 4px 0" }} title={money(r.s25)} />
                </td>
                <td style={td}>{money(r.s24)}</td>
                <td style={{ ...td, fontWeight: r.category === fastestTop?.category ? 600 : 400 }}>{pct(r.growth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Year-over-year growth, all categories" q={all}>
        <div>
          {byGrowth.map((r) => (
            <div key={r.category} style={{ display: "flex", alignItems: "center", gap: 12, padding: "3px 0" }} title={`${r.category}: ${pct(r.growth)} (${money(r.s24)} to ${money(r.s25)})`}>
              <div style={{ width: 200, fontSize: 13, color: INK }}>{r.category}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 10, width: (r.growth / maxG * 100) + "%", background: BLUE, borderRadius: "0 4px 4px 0" }} />
              </div>
              <div style={{ width: 60, fontSize: 13, color: INK, textAlign: "right" }}>{pct(r.growth)}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
