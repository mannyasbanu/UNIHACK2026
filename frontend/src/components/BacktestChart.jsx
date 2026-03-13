import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function BacktestChart({ data, ticker }) {
  return (
    <div
      style={{
        backgroundColor: "#18181b",
        border: "1px solid #27272a",
        borderRadius: "16px",
        padding: "20px",
        height: "360px",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "16px", color: "white" }}>
        Strategy vs Buy & Hold for {ticker}
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#a1a1aa" />
          <YAxis stroke="#a1a1aa" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="strategyValue"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Strategy"
          />
          <Line
            type="monotone"
            dataKey="benchmarkValue"
            stroke="#a1a1aa"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Buy & Hold"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BacktestChart;