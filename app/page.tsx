'use client'

import { useState, useEffect } from 'react'
import { Plus, ExternalLink, Trash2, RefreshCw, AlertCircle, Clock } from 'lucide-react'

interface Competitor {
  id: string
  name: string
  description: string
  tags: string
  links: Link[]
  alerts: Alert[]
}

interface Link {
  id: string
  url: string
  linkType: string
  checks: Check[]
}

interface Check {
  id: string
  checkDate: string
  status: string
  errorMsg: string | null
  changes: Change[]
}

interface Change {
  id: string
  diffText: string
  summary: string | null
  hasSignificant: boolean
  snippets: string | null
}

interface Alert {
  id: string
  keyword: string
  isActive: boolean
}

export default function Home() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState<Set<string>>(new Set())
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null)
  const [showAddCompetitor, setShowAddCompetitor] = useState(false)
  const [showAddLink, setShowAddLink] = useState<string | null>(null)
  const [showAddAlert, setShowAddAlert] = useState<string | null>(null)
  const [filterSignificant, setFilterSignificant] = useState(false)

  useEffect(() => {
    loadCompetitors()
  }, [])

  async function loadCompetitors() {
    try {
      const res = await fetch('/api/competitors')
      const data = await res.json()
      setCompetitors(data)
    } catch (error) {
      console.error('Failed to load competitors:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addCompetitor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          tags: formData.get('tags'),
        }),
      })
      setShowAddCompetitor(false)
      loadCompetitors()
    } catch (error) {
      console.error('Failed to add competitor:', error)
    }
  }

  async function addLink(e: React.FormEvent<HTMLFormElement>, competitorId: string) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorId,
          url: formData.get('url'),
          linkType: formData.get('linkType'),
        }),
      })
      setShowAddLink(null)
      loadCompetitors()
    } catch (error) {
      console.error('Failed to add link:', error)
    }
  }

  async function addAlert(e: React.FormEvent<HTMLFormElement>, competitorId: string) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorId,
          keyword: formData.get('keyword'),
        }),
      })
      setShowAddAlert(null)
      loadCompetitors()
    } catch (error) {
      console.error('Failed to add alert:', error)
    }
  }

  async function checkNow(competitorId: string) {
    setChecking(prev => new Set(prev).add(competitorId))
    try {
      await fetch('/api/check-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId }),
      })
      loadCompetitors()
    } catch (error) {
      console.error('Failed to check:', error)
    } finally {
      setChecking(prev => {
        const next = new Set(prev)
        next.delete(competitorId)
        return next
      })
    }
  }

  async function deleteCompetitor(id: string) {
    if (!confirm('Are you sure you want to delete this competitor?')) return
    try {
      await fetch(`/api/competitors/${id}`, { method: 'DELETE' })
      loadCompetitors()
    } catch (error) {
      console.error('Failed to delete competitor:', error)
    }
  }

  async function deleteLink(id: string) {
    try {
      await fetch(`/api/links/${id}`, { method: 'DELETE' })
      loadCompetitors()
    } catch (error) {
      console.error('Failed to delete link:', error)
    }
  }

  async function deleteAlert(id: string) {
    try {
      await fetch(`/api/alerts?id=${id}`, { method: 'DELETE' })
      loadCompetitors()
    } catch (error) {
      console.error('Failed to delete alert:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8 mb-8 border border-blue-200 dark:border-blue-800">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to Competitive Intelligence Tracker
        </h1>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p className="font-semibold">📋 How to use:</p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Add competitors you want to track</li>
            <li>Add 5-10 competitor links (pricing pages, docs, changelogs)</li>
            <li>Click "Check Now" to fetch and store content</li>
            <li>View diffs and AI-generated summaries of changes</li>
            <li>See history of last 5 checks per competitor</li>
            <li>Use tags and alerts to organize and monitor changes</li>
          </ol>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Competitors</h2>
        <button
          onClick={() => setShowAddCompetitor(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Competitor
        </button>
      </div>

      {showAddCompetitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Add New Competitor</h3>
            <form onSubmit={addCompetitor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Competitor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Brief description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  name="tags"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="saas, enterprise, ai"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCompetitor(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {competitors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No competitors added yet</p>
          <button
            onClick={() => setShowAddCompetitor(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Your First Competitor
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {competitors.map(competitor => (
            <div key={competitor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{competitor.name}</h3>
                    {competitor.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{competitor.description}</p>
                    )}
                    {competitor.tags && (
                      <div className="flex flex-wrap gap-2">
                        {competitor.tags.split(',').map((tag, i) => (
                          <span key={i} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => checkNow(competitor.id)}
                      disabled={checking.has(competitor.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                    >
                      <RefreshCw size={16} className={checking.has(competitor.id) ? 'animate-spin' : ''} />
                      Check Now
                    </button>
                    <button
                      onClick={() => deleteCompetitor(competitor.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Links ({competitor.links.length}/10)</h4>
                    <button
                      onClick={() => setShowAddLink(competitor.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Plus size={16} /> Add Link
                    </button>
                  </div>

                  {showAddLink === competitor.id && (
                    <form onSubmit={(e) => addLink(e, competitor.id)} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="space-y-2">
                        <input
                          name="url"
                          type="url"
                          required
                          placeholder="https://competitor.com/pricing"
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        />
                        <select
                          name="linkType"
                          required
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        >
                          <option value="pricing">Pricing Page</option>
                          <option value="docs">Documentation</option>
                          <option value="changelog">Changelog</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="flex gap-2">
                          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddLink(null)}
                            className="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {competitor.links.length === 0 ? (
                    <p className="text-gray-500 text-sm">No links added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {competitor.links.map(link => (
                        <div key={link.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded text-xs">
                                  {link.linkType}
                                </span>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                >
                                  {link.url}
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                              <p className="text-xs text-gray-500">
                                {link.checks.length} check{link.checks.length !== 1 ? 's' : ''} performed
                              </p>
                            </div>
                            <button
                              onClick={() => deleteLink(link.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {link.checks.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <button
                                onClick={() => setExpandedCompetitor(expandedCompetitor === link.id ? null : link.id)}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                <Clock size={14} />
                                View History ({Math.min(link.checks.length, 5)} checks)
                              </button>

                              {expandedCompetitor === link.id && (
                                <div className="space-y-2 pl-4">
                                  {link.checks.slice(0, 5).map((check, idx) => (
                                    <div key={check.id} className="border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                                      <p className="text-xs text-gray-500 mb-1">
                                        Check #{idx + 1} - {new Date(check.checkDate).toLocaleString()}
                                      </p>
                                      {check.status === 'error' ? (
                                        <p className="text-red-600 text-sm flex items-center gap-1">
                                          <AlertCircle size={14} /> Error: {check.errorMsg}
                                        </p>
                                      ) : check.changes.length > 0 ? (
                                        <div className="space-y-2">
                                          {check.changes
                                            .filter(change => !filterSignificant || change.hasSignificant)
                                            .map(change => (
                                              <div key={change.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                                {change.hasSignificant && (
                                                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded mb-2">
                                                    Significant Change
                                                  </span>
                                                )}
                                                {change.summary && (
                                                  <p className="text-sm mb-2 font-medium">{change.summary}</p>
                                                )}
                                                {change.snippets && (
                                                  <div className="space-y-1 mb-2">
                                                    {JSON.parse(change.snippets).map((snippet: any, i: number) => (
                                                      <div key={i} className="text-xs bg-white dark:bg-gray-800 p-2 rounded">
                                                        <p className="font-mono">{snippet.text}</p>
                                                        <p className="text-gray-500 mt-1">{snippet.citation}</p>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                                <details className="text-xs">
                                                  <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                                                    View Diff
                                                  </summary>
                                                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto whitespace-pre-wrap">
                                                    {change.diffText.slice(0, 1000)}
                                                    {change.diffText.length > 1000 && '... (truncated)'}
                                                  </pre>
                                                </details>
                                              </div>
                                            ))}
                                        </div>
                                      ) : (
                                        <p className="text-green-600 text-sm">No changes detected</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">Keyword Alerts</h4>
                    <button
                      onClick={() => setShowAddAlert(competitor.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Plus size={16} /> Add Alert
                    </button>
                  </div>

                  {showAddAlert === competitor.id && (
                    <form onSubmit={(e) => addAlert(e, competitor.id)} className="mb-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <input
                        name="keyword"
                        type="text"
                        required
                        placeholder="e.g., pricing, discount, new feature"
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 mb-2"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                          Add Alert
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddAlert(null)}
                          className="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded hover:bg-gray-400 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {competitor.alerts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {competitor.alerts.map(alert => (
                        <div key={alert.id} className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-sm flex items-center gap-2">
                          <AlertCircle size={12} />
                          {alert.keyword}
                          <button onClick={() => deleteAlert(alert.id)} className="hover:text-red-600">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {competitors.some(c => c.links.some(l => l.checks.some(ch => ch.changes.length > 0))) && (
        <div className="mt-6 flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterSignificant}
              onChange={(e) => setFilterSignificant(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Show only significant changes</span>
          </label>
        </div>
      )}
    </div>
  )
}
