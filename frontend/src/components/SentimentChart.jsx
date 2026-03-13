import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function SentimentChart({ data }) {
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
      <h2 style={{ color: 'white', marginTop: 0, marginBottom: "16px" }}>Sentiment Over Time</h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#a1a1aa" />
          <YAxis stroke="#a1a1aa" domain={[-0.5, 0.5]} />
          <Tooltip />
          <ReferenceLine y={0} stroke="#71717a" />
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SentimentChart;