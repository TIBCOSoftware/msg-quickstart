/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Quickstart',
      link: {type: 'doc', id: 'intro'},
      items: ['quick-start/qs-docker', 'quick-start/qs-local'],
    },
    {
      type: 'doc',
      id: 'api',
      label: 'FTL Client API',
    },
    {
      type: 'doc',
      id: 'legal',
      label: 'Legal and Third-Party Notices',
    },
  ],
};

export default sidebars;
