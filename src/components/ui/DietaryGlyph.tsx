import type { DietaryFlag } from '@/data/menu'

type Props = {
  type: DietaryFlag
  vegLabel: string
  spicyLabel: string
}

const Leaf = ({ title }: { title: string }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    aria-label={title}
    role="img"
    className="text-leaf flex-shrink-0"
  >
    <title>{title}</title>
    <path
      d="M1.2 8.8c0-3.4 2.4-6.6 6.6-6.6 0 4.2-3.2 6.6-6.6 6.6Z"
      fill="currentColor"
    />
    <path
      d="M2 8 6.4 3.6"
      stroke="#FDFAF5"
      strokeWidth="0.6"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)

const Chili = ({ title }: { title: string }) => (
  <svg
    width="9"
    height="11"
    viewBox="0 0 9 11"
    aria-label={title}
    role="img"
    className="text-chili flex-shrink-0"
  >
    <title>{title}</title>
    <path
      d="M4.5 10.4c-2 0-3.4-1.6-3.4-3.6 0-1.8 1-3.2 2.6-3.6.4-1.4 1.4-2.4 2.6-2.4-.2 1 .2 1.8.6 2.2-.2.2-.4.6-.4 1.2 1 .6 1.6 1.6 1.6 2.6 0 2-1.6 3.6-3.6 3.6Z"
      fill="currentColor"
    />
  </svg>
)

export default function DietaryGlyph({ type, vegLabel, spicyLabel }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {(type === 'veg' || type === 'veg-spicy') && <Leaf title={vegLabel} />}
      {(type === 'spicy' || type === 'veg-spicy') && <Chili title={spicyLabel} />}
    </span>
  )
}
