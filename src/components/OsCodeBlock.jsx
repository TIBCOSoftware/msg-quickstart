import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

import styles from './OsCodeBlock.module.css';

// A code block whose syntax highlighting mirrors the doc's OS <Tabs> group.
// Renders identical content in both Linux and Windows tabs (with `bash` vs
// `batch` highlighting), and hides the tab bar so it reads as a single block.
export default function OsCodeBlock({children, ...codeBlockProps}) {
  return (
    <div className={styles.osCodeBlock}>
      <Tabs
        groupId="os"
        defaultValue="linux"
        values={[
          {label: 'Linux', value: 'linux'},
          {label: 'Windows', value: 'windows'},
        ]}
      >
        <TabItem value="linux">
          <CodeBlock language="bash" {...codeBlockProps}>
            {children}
          </CodeBlock>
        </TabItem>
        <TabItem value="windows">
          <CodeBlock language="batch" {...codeBlockProps}>
            {children}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
}
