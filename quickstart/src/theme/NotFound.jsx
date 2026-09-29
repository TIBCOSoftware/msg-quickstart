import {useEffect} from 'react';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Redirect unknown routes to the root page instead of showing a 404.
export default function NotFound() {
  const rootUrl = useBaseUrl('/');

  useEffect(() => {
    window.location.replace(rootUrl);
  }, [rootUrl]);

  return (
    <Head>
      <meta httpEquiv="refresh" content={`0; url=${rootUrl}`} />
      <title>Redirecting…</title>
    </Head>
  );
}
