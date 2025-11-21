# InspektorScoreCard Component

A reusable React component that displays a digital identity score card with a futuristic dark theme and neon green accents.

## Installation

Make sure you have React and TailwindCSS set up in your project. If using Next.js, TailwindCSS should already be configured.

## Usage

### Basic Example

```jsx
import InspektorScoreCard from './components/InspektorScoreCard';

function MyPage() {
  return (
    <div className="bg-black min-h-screen py-12">
      <InspektorScoreCard />
    </div>
  );
}
```

### With Custom Props

```jsx
import InspektorScoreCard from './components/InspektorScoreCard';

function MyPage() {
  return (
    <div className="bg-black min-h-screen py-12">
      <InspektorScoreCard
        title="INZPEKTOR ID"
        subtitle="V.1.0"
        statusText="PROOF OF CLEAN HANDS VERIFIED"
        wallet="emmilll.eth"
        label="MINTED"
        date="2024.07.26"
      />
    </div>
  );
}
```

### With Custom Icon

```jsx
import InspektorScoreCard from './components/InspektorScoreCard';

function MyPage() {
  return (
    <InspektorScoreCard
      wallet="user.eth"
      icon={
        <svg className="w-10 h-10 text-neon-green" fill="currentColor" viewBox="0 0 24 24">
          {/* Your custom icon SVG */}
        </svg>
      }
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "INZPEKTOR ID" | Main title in uppercase |
| `subtitle` | string | "V.1.0" | Subtitle below title |
| `statusText` | string | "PROOF OF CLEAN HANDS VERIFIED" | Center status text |
| `wallet` | string | "emmilll.eth" | Wallet address/handle |
| `label` | string | "MINTED" | Bottom right label |
| `date` | string | "2024.07.26" | Date text |
| `icon` | ReactNode | null | Custom icon component (optional) |

## Styling

The component uses TailwindCSS classes and requires the following custom color in your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'neon-green': '#32ff95',
      },
    },
  },
}
```

## Features

- ✅ Fully responsive (mobile-first design)
- ✅ Centered layout on desktop
- ✅ Dark gradient background (#1d415a to #174536)
- ✅ Neon green glow effect
- ✅ Rounded corners (rounded-3xl)
- ✅ Customizable via props
- ✅ Accessible and semantic HTML

## Example Page

See `ExamplePage.jsx` for a complete example with multiple card variations.

