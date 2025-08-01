import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Thème personnalisé basé sur vscDarkPlus avec JetBrains Mono
export const customVscDarkPlus = {
  ...vscDarkPlus,
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", Consolas, monospace !important',
  },
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", Consolas, monospace !important',
  },
};
