import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CircleMarker, MapContainer, TileLayer, Tooltip as MapTooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { COMMUNITY_AREA_COORDS } from '../constants/tables'

export default function ChartView({ table, data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="chart-empty">No chart data available for this selection.</p>
  }

  if (table === 'yearly_crimes') {
    const rows = [...data]
      .map(row => ({
        ...row,
        year_num: Number(row.year),
        total_crimes_num: Number(row.total_crimes),
      }))
      .filter(row => Number.isFinite(row.year_num) && Number.isFinite(row.total_crimes_num))
      .sort((a, b) => a.year_num - b.year_num)

    return (
      <div className="chart-block">
        <div className="chart-title">Yearly crime trend</div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={290}>
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year_num" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total_crimes_num"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 2.5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (table === 'holiday_vs_nonholiday') {
    const rows = [...data]
      .map(row => ({
        ...row,
        total_crimes_num: Number(row.total_crimes),
      }))
      .filter(row => Number.isFinite(row.total_crimes_num))

    return (
      <div className="chart-block">
        <div className="chart-title">Holiday vs non-holiday comparison</div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day_type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_crimes_num" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (table === 'community_area_crimes') {
    const topRows = [...data]
      .map(row => ({
        ...row,
        community_area_text: String(row.community_area),
        total_crimes_num: Number(row.total_crimes),
      }))
      .filter(row => Number.isFinite(row.total_crimes_num))
      .sort((a, b) => b.total_crimes_num - a.total_crimes_num)
      .slice(0, 15)

    const mapRows = topRows.filter(row => COMMUNITY_AREA_COORDS[row.community_area_text])
    const maxCrimes = Math.max(...topRows.map(row => row.total_crimes_num), 1)

    return (
      <div className="chart-block">
        <div className="chart-title">Top community areas by reported crime</div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={topRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="community_area_text" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_crimes_num" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="map-wrap">
          <MapContainer center={[41.8781, -87.6298]} zoom={10} className="crime-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapRows.map(row => {
              const [lat, lng] = COMMUNITY_AREA_COORDS[row.community_area_text]
              const scaled = Math.sqrt(row.total_crimes_num / maxCrimes)
              const radius = Math.max(6, Math.min(20, 6 + scaled * 14))
              return (
                <CircleMarker
                  key={row.community_area_text}
                  center={[lat, lng]}
                  radius={radius}
                  pathOptions={{ color: '#1d4ed8', fillColor: '#60a5fa', fillOpacity: 0.52 }}
                >
                  <MapTooltip>
                    Community Area {row.community_area_text}: {row.total_crimes_num} crimes
                  </MapTooltip>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="chart-block">
      <div className="chart-title">Visualization</div>
      <p className="chart-empty">A chart for this question is coming soon.</p>
    </div>
  )
}
