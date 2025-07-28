import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <Component {...pageProps} />
}
