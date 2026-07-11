import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ConsultAI design tokens
        ink: '#0D0D12',           // near-black, primary text
        slate: '#1C1C28',         // dark surface
        panel: '#242434',         // card backgrounds
        border: '#2E2E42',        // subtle borders
        muted: '#6B6B8A',         // muted text
        ghost: '#9090A8',         // placeholder text
        signal: '#4F6EF7',        // primary blue — interactive elements
        'signal-light': '#7B93FF',// lighter signal for hover
         lime: '#A3E635',         // availability indicator / verified badge
        amber: '#F59E0B',         // waitlist / warning
        ember: '#EF4444',         // unavailable / error
        parchment: '#F8F7F4',     // light bg for light-mode surfaces
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '8px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
      },
    },
  },
  plugins: [],
}
export default config
