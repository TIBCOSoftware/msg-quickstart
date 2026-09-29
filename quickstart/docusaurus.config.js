import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TIBCO Quickstarts',
  tagline: 'A faster-than-light way to get started with TIBCO.',
  favicon: 'img/favicon.ico',

  // GitHub Pages for this (private) repo is served at a rotating "pages.github.io"
  // subdomain, not tibco.github.io/msg-quickstart. If the subdomain rotates, update it here.
  url: 'https://tibcosoftware.github.io',
  baseUrl: '/msg-quickstart/',

  organizationName: 'TIBCOSoftware',
  projectName: 'msg-quickstart',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css'],
        },
      },
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ftl',
        path: 'docs/ftl',
        routeBasePath: 'ftl',
        sidebarPath: './sidebars.ftl.js',
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Quickstarts',
      logo: {
        alt: 'TIBCO Logo',
        src: 'img/tibco.svg',
        href: '/',
      },
      items: [
        {to: '/ftl', label: 'FTL', position: 'left'},
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright (c) ${new Date().getFullYear()}. Cloud Software Group, Inc. All Rights Reserved.`,
    },
    zoom: {
      selector: '.markdown img',
      background: {
        light: '#fff',
        dark: '#111',
      },
      config: {},
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'batch', 'java', 'go', 'c', 'sql', 'yaml'],
    },
  },
};

export default config;
