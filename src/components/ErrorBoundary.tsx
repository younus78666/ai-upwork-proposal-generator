import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; reloading: boolean; }

const CHUNK_ERROR_KEY = 'chunk_reload_attempted';

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'TypeError' &&
    (error.message.includes('Failed to fetch dynamically imported module') ||
     error.message.includes('Importing a module script failed') ||
     error.message.includes('Loading chunk') ||
     error.message.includes('Loading CSS chunk'))
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, reloading: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (isChunkLoadError(error)) {
      const alreadyTried = sessionStorage.getItem(CHUNK_ERROR_KEY);
      if (!alreadyTried) {
        sessionStorage.setItem(CHUNK_ERROR_KEY, '1');
        this.setState({ reloading: true });
        window.location.reload();
        return;
      }
    }
  }

  render() {
    if (this.state.reloading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#6b7280' }}>
          Reloading…
        </div>
      );
    }

    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', background: '#fff1f2', minHeight: '100vh' }}>
          <h2 style={{ color: '#b91c1c', marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ marginBottom: 16, color: '#374151' }}>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 14 }}
            >
              Reload page
            </button>
          </p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#374151', background: '#fee2e2', padding: 16, borderRadius: 8, fontSize: 12 }}>
            {this.state.error.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
