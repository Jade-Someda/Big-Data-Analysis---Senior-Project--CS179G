import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [categories, setCategories] = useState({})
  const [loadingCat, setLoadingCat] = useState(true)
  const [selectedTable, setSelectedTable] = useState(null)
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [data, setData] = useState([])
  const [stats, setStats] = useState({})
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState(null)

  // load categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(() => setError('could not load categories'))
      .finally(() => setLoadingCat(false))
  }, [])

  // when user picks a table, load its data
  useEffect(() => {
    if (!selectedTable) {
      setData([])
      setStats({})
      return
    }
    setLoadingData(true)
    setError(null)
    fetch('/api/data?table=' + encodeURIComponent(selectedTable))
      .then(res => res.json())
      .then(json => {
        setData(json.data || [])
        setStats(json.stats || {})
      })
      .catch(() => setError('could not load data'))
      .finally(() => setLoadingData(false))
  }, [selectedTable])

  if (loadingCat) return <p>Loading...</p>
  if (error && !selectedTable) return <p>{error}</p>

  return (
    <div>
      <h1>Chicago Crime Analysis</h1>
      <div className="layout">
        <nav className="sidebar">
          <h2>Categories</h2>
          <ul>
            {Object.keys(categories).map(cat => (
              <li key={cat}>
                <strong>{cat}</strong>
                <ul>
                  {Object.entries(categories[cat]).map(([label, table]) => (
                    <li key={table}>
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault()
                          setSelectedTable(table)
                          setSelectedLabel(label)
                        }}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        <main className="content">
          {!selectedTable && <p className="muted">Pick a table from the sidebar.</p>}
          {selectedTable && loadingData && <p className="muted">Loading...</p>}
          {selectedTable && !loadingData && error && <p className="err">{error}</p>}
          {selectedTable && !loadingData && !error && (
            <>
              {Object.keys(stats).length > 0 && (
                <p className="stats">
                  {Object.entries(stats).map(([k, v]) => k + ': ' + v).join('  |  ')}
                </p>
              )}
              {data.length === 0 ? (
                <p className="muted">No data.</p>
              ) : (
                <>
                  <h3>{selectedLabel}</h3>
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(data[0]).map(col => <th key={col}>{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={i}>
                          {Object.keys(data[0]).map(col => (
                            <td key={col}>{row[col] != null ? String(row[col]) : ''}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
