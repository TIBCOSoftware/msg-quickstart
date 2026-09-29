import Tabs from '@theme/Tabs';

// Shorthand for the Linux/Windows tab pattern used throughout the quickstart.
// Wraps <Tabs> with the shared groupId/defaultValue/values so mdx files can
// write <OsTabs>...<TabItem value="linux">...</TabItem>...</OsTabs>.
export default function OsTabs({children, defaultValue = 'linux', ...rest}) {
  return (
    <Tabs
      groupId="os"
      defaultValue={defaultValue}
      values={[
        {label: 'Linux', value: 'linux'},
        {label: 'Windows', value: 'windows'},
      ]}
      {...rest}
    >
      {children}
    </Tabs>
  );
}
