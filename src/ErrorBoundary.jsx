import React from 'react';
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-slate-950 px-4 text-slate-200">
          <div className="max-w-xl w-full rounded-lg border border-red-500/30 bg-red-500/10 p-6 shadow-xl shadow-red-500/5 sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-red-400">System Malfunction Detected</h2>
            <p className="mb-4 text-sm text-slate-400">The matrix encountered a critical rendering error.</p>
            <pre className="overflow-x-auto rounded bg-slate-900 p-4 font-sans text-xs text-red-300">
              {this.state.error && this.state.error.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded border min-h-[44px] min-w-[44px] flex items-center justify-center border-red-500/50 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/30 transition-colors"
            >
              Reboot Matrix
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
