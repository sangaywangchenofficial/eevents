import React from 'react';
import { Link } from 'react-router-dom';

// ---------- NotFound (404) ----------
export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#FDFDF7] dark:bg-[#0F1A17] p-5 font-sans">
            <h1 className="text-9xl font-bold text-[#1E352F] dark:text-[#E8F5F2] m-0 tracking-tight">404</h1>
            <p className="text-2xl text-[#66756F] dark:text-[#A8C4BE] mt-2 font-medium">
                Oops! The page you're looking for doesn't exist.
            </p>
            <Link
                to="/"
                className="mt-6 px-8 py-3.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white font-semibold rounded-xl text-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200"
            >
                Go back to Home
            </Link>
        </div>
    );
};

// ---------- Error Fallback UI ----------
const ErrorFallback = ({ error }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#FDFDF7] dark:bg-[#0F1A17] p-5 font-sans">
            <div className="bg-[#FFF5F5] dark:bg-red-950/20 border border-[#FECACA] dark:border-red-900/50 rounded-2xl p-8 max-w-2xl w-full shadow-sm">
                <h1 className="text-4xl font-bold text-[#DC2626] dark:text-red-400">Something went wrong</h1>
                <p className="text-lg text-[#66756F] dark:text-[#A8C4BE] mt-2">
                    We're sorry, but an unexpected error occurred.
                </p>
                {error && (
                    <pre className="bg-[#FEE2E2] dark:bg-red-900/30 text-[#991B1B] dark:text-red-300 p-4 rounded-xl max-w-full overflow-auto text-sm mt-4 text-left border dark:border-red-800/50">
                        {error.toString()}
                    </pre>
                )}
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-8 py-3.5 bg-[#29BBA3] text-white font-semibold rounded-xl text-base shadow-md hover:bg-[#1E8B7A] hover:shadow-lg transition-all duration-200"
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
};

// ---------- Error Boundary (class component) ----------
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to your error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }
        return this.props.children;
    }
}