import { Link } from 'react-router-dom'

export default function PlaceholderPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2">Page not found.</p>
      <Link to="/" className="mt-4 text-primary underline">
        Go to Dashboard
      </Link>
    </div>
  )
}