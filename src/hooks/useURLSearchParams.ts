import { useLocation, useSearchParams } from 'react-router'

/**
 * Hook for working with URL parameters,
 * allows to read, manipulate them and pack
 * in a `Map` for quick access
 */
const useURLSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { search } = useLocation()
  const params: Map<string, string> = new Map()

  for (const [key, value] of searchParams) {
    params.set(key, value)
  }

  return {
    params,
    search,
    setSearchParams,
  }
}

export { useURLSearchParams }
