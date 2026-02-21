'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface Status {
  backend: string
  database: string
  llm: string
  timestamp: string
}

export default function StatusPage() {
  const [status, setStatus] = useState<Status | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    setLoading(true)
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setStatus(data)
      setLastChecked(new Date())
    } catch (error) {
      console.error('Failed to check status:', error)
    } finally {
      setLoading(false)
    }
  }

  function getStatusIcon(state: string) {
    if (state === 'healthy') {
      return <CheckCircle className="text-green-600" size={24} />
    }
    return <XCircle className="text-red-600" size={24} />
  }

  function getStatusColor(state: string) {
    return state === 'healthy' 
      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
  }

  if (loading && !status) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Status</h1>
        <div className="text-center py-12">Checking system status...</div>
      </div>
    )
  }

  const allHealthy = status && 
    status.backend === 'healthy' && 
    status.database === 'healthy' && 
    status.llm === 'healthy'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">System Status</h1>
        <button
          onClick={checkStatus}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {status && (
        <>
          <div className={`rounded-lg p-6 mb-6 border ${allHealthy 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-3">
              {allHealthy ? (
                <CheckCircle className="text-green-600" size={32} />
              ) : (
                <AlertCircle className="text-red-600" size={32} />
              )}
              <div>
                <h2 className="text-xl font-bold">
                  {allHealthy ? 'All Systems Operational' : 'Some Systems Down'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last checked: {lastChecked?.toLocaleTimeString() || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-lg p-6 border ${getStatusColor(status.backend)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.backend)}
                  <div>
                    <h3 className="font-bold text-lg">Backend Server</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Next.js API routes
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status.backend === 'healthy'
                    ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                    : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}>
                  {status.backend}
                </span>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${getStatusColor(status.database)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.database)}
                  <div>
                    <h3 className="font-bold text-lg">Database</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      SQLite with Prisma ORM
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status.database === 'healthy'
                    ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                    : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}>
                  {status.database}
                </span>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${getStatusColor(status.llm)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.llm)}
                  <div>
                    <h3 className="font-bold text-lg">LLM Connection</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {typeof process !== 'undefined' && process.env?.GROQ_API_KEY 
                        ? 'Groq Llama-3.3-70B (FREE) for AI summaries'
                        : 'OpenAI GPT-3.5-turbo for AI summaries'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status.llm === 'healthy'
                    ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                    : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}>
                  {status.llm}
                </span>
              </div>
              {status.llm === 'unhealthy' && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> The app will still work, but AI summaries will not be generated. 
                    Get a FREE Groq API key at <a href="https://console.groq.com/keys" target="_blank" className="underline">console.groq.com/keys</a> or 
                    use OpenAI at <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">platform.openai.com</a>.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold mb-2">About This Application</h3>
            <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <p><strong>Framework:</strong> Next.js 14 with TypeScript</p>
              <p><strong>Database:</strong> SQLite with Prisma ORM</p>
              <p><strong>LLM Provider:</strong> OpenAI (GPT-3.5-turbo)</p>
              <p><strong>Styling:</strong> Tailwind CSS</p>
              <p><strong>Deployment:</strong> Docker-ready for easy hosting</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
