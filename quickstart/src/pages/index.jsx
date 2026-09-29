import {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Each tagline is split so only the words that actually change flip when the
// hovered card changes; the shared "A " prefix stays static.
const TAGLINES = {
  neutral: {phrase: 'quick way',            product: 'Messaging'},
  ftl:     {phrase: 'faster-than-light way', product: 'FTL'},
};

const products = [
  {
    slug: '/ftl',
    key: 'ftl',
    name: 'TIBCO FTL®',
    tagline: 'High-performance messaging.',
    description:
      'A low-latency, high-throughput messaging platform engineered for enterprise and cloud-ready environments, with built-in reliability and high availability.',
    cta: 'Get started with FTL',
  },
];

// 3-D flips between arbitrary strings by assigning each incoming text to
// whichever face is currently hidden, then rotating to reveal it. If the
// incoming text already matches what's visible, nothing flips.
function Flipper({text}) {
  const rootRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const [state, setState] = useState({side: 'front', front: text, back: text});

  useEffect(() => {
    setState((prev) => {
      const visible = prev.side === 'front' ? prev.front : prev.back;
      if (visible === text) return prev;
      const opposite = prev.side === 'front' ? 'back' : 'front';
      return {
        side: opposite,
        front: opposite === 'front' ? text : prev.front,
        back: opposite === 'back' ? text : prev.back,
      };
    });
  }, [text]);

  useEffect(() => {
    const measure = () => {
      const root = rootRef.current;
      const f = frontRef.current;
      const b = backRef.current;
      if (!root || !f || !b) return;
      const fw = f.offsetWidth;
      const bw = b.offsetWidth;
      root.style.setProperty('--flip-w-front', `${fw}px`);
      root.style.setProperty('--flip-w-back', `${bw}px`);
      // Delay the container's shrink until the wider face is backface-hidden so
      // the still-visible wider face never overflows into the next word.
      root.style.setProperty('--flip-delay-front', fw >= bw ? '0ms' : '320ms');
      root.style.setProperty('--flip-delay-back', bw >= fw ? '0ms' : '320ms');
    };
    measure();
    // Re-measure once web fonts finish loading (they can change text width).
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    if (frontRef.current) ro.observe(frontRef.current);
    if (backRef.current) ro.observe(backRef.current);
    return () => ro.disconnect();
  }, [state.front, state.back]);

  const visible = state.side === 'front' ? state.front : state.back;

  return (
    <span
      className={clsx(styles.flip, state.side === 'back' && styles.flipPhaseBack)}
      ref={rootRef}
      aria-hidden="true"
    >
      <span className={styles.flipSizer}>{visible}</span>
      <span className={styles.flipRotator}>
        <span className={clsx(styles.flipFace, styles.flipFront)} ref={frontRef}>
          {state.front}
        </span>
        <span className={clsx(styles.flipFace, styles.flipBack)} ref={backRef}>
          {state.back}
        </span>
      </span>
    </span>
  );
}

function Hero({slots}) {
  const {siteConfig} = useDocusaurusContext();
  const aria = `A ${slots.phrase} to get started with TIBCO ${slots.product}.`;
  return (
    <header className={clsx('hero', styles.hero)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroTagline} aria-label={aria}>
          {'A '}
          <Flipper text={slots.phrase} />
          {' to get started with TIBCO '}
          <Flipper text={slots.product} />
          {''}
        </p>
      </div>
    </header>
  );
}

function ProductCard({product, onPointerEnter, onPointerLeave}) {
  // Docusaurus's <Link> uses onMouseEnter internally for route preloading and
  // overrides any onMouseEnter prop, so pointer handlers must live on a wrapper.
  return (
    <div
      className={styles.cardWrapper}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <Link
        to={product.slug}
        className={styles.card}
        onFocus={onPointerEnter}
        onBlur={onPointerLeave}
      >
        <div className={styles.cardHeader}>
          <Heading as="h2" className={styles.cardTitle}>
            {product.name}
          </Heading>
          <span className={styles.cardTagline}>{product.tagline}</span>
        </div>
        <p className={styles.cardBody}>{product.description}</p>
        <span className={styles.cardCta}>{product.cta} &rarr;</span>
      </Link>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const [hovered, setHovered] = useState(null);
  const leaveTimer = useRef(null);
  const scheduleClear = () => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHovered(null), 120);
  };
  const setImmediateHover = (key) => {
    clearTimeout(leaveTimer.current);
    setHovered(key);
  };
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const slots = TAGLINES[hovered] ?? TAGLINES.neutral;

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Hero slots={slots} />
      <main className={styles.main}>
        <section className={clsx('container', styles.cards)}>
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              onPointerEnter={() => setImmediateHover(p.key)}
              onPointerLeave={scheduleClear}
            />
          ))}
        </section>
      </main>
    </Layout>
  );
}
