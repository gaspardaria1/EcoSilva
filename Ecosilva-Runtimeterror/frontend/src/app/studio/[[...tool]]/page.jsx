export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [{ tool: [] }]
}

export default function StudioPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Studio</h1>
        <p className="mt-2 text-gray-500">Sanity Studio is not configured in this environment.</p>
      </div>
    </div>
  )
}
