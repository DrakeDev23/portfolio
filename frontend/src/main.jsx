import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL RUNTIME ERROR CAUGHT BY ERRORBOUNDARY:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', color: '#ff5555', background: '#0a0a0a', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#ff6b6b' }}>Runtime Error Encountered</h2>
          <pre style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </pre>
          <pre style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', overflowX: 'auto', marginTop: '12px', color: '#888' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
