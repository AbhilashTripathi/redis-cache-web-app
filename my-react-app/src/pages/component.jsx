import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

export default function Component() {
  const [dbItems, setDbItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [cachedItems, setCachedItems] = useState([])
  const [loading, setLoading] = useState({ db: false, cache: false })
  const [error, setError] = useState({ db: null, cache: null })

  useEffect(() => {
    fetchDbItems()
    fetchCachedItems()
  }, [])

  const fetchDbItems = async () => {
    setLoading(prev => ({ ...prev, db: true }))
    setError(prev => ({ ...prev, db: null }))
    try {
      const response = await axios.get('http://localhost:8765/db')
      setDbItems(response.data)
    } catch (error) {
      console.error('Error fetching DB items:', error)
      setError(prev => ({ ...prev, db: 'Failed to fetch database items' }))
    }
    setLoading(prev => ({ ...prev, db: false }))
  }

  const addDbItem = async () => {
    if (!newItem.trim()) return
    setLoading(prev => ({ ...prev, db: true }))
    setError(prev => ({ ...prev, db: null }))
    try {
      await axios.post('http://localhost:8765/db', { name: newItem })
      setNewItem('')
      fetchDbItems()
      fetchCachedItems()
    } catch (error) {
      console.error('Error adding DB item:', error)
      setError(prev => ({ ...prev, db: 'Failed to add item' }))
    }
    setLoading(prev => ({ ...prev, db: false }))
  }

  const fetchCachedItems = async () => {
    setLoading(prev => ({ ...prev, cache: true }))
    setError(prev => ({ ...prev, cache: null }))
    try {
      const response = await axios.get('http://localhost:8765/cache')
      setCachedItems(response.data.items || [])
    } catch (error) {
      console.error('Error fetching cached items:', error)
      setError(prev => ({ ...prev, cache: 'Failed to fetch cached items' }))
    }
    setLoading(prev => ({ ...prev, cache: false }))
  }

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Dockerized Web App</h1>
        
        <div className="card">
          <div className="card-content">
            <h2 className="subtitle">Database Items</h2>
            {loading.db ? (
              <p className="loading-text">Loading database items...</p>
            ) : error.db ? (
              <p className="error-text">{error.db}</p>
            ) : (
              <ul className="item-list">
                {dbItems.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
            )}
            <div className="input-group">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="text-input"
                placeholder="New item name"
              />
              <button
                onClick={addDbItem}
                disabled={loading.db}
                className="button button-blue"
              >
                {loading.db ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <h2 className="subtitle">Cached Items</h2>
            {loading.cache ? (
              <p className="loading-text">Loading cached items...</p>
            ) : error.cache ? (
              <p className="error-text">{error.cache}</p>
            ) : (
              <ul className="item-list">
                {cachedItems.length > 0 ? (
                  cachedItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No cached items available</li>
                )}
              </ul>
            )}
            <button
              onClick={fetchCachedItems}
              disabled={loading.cache}
              className="button button-green"
            >
              {loading.cache ? 'Refreshing...' : 'Refresh Cached Items'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}