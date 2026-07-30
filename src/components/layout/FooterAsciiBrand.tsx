const WORDMARK_ID = "footer-wordmark-dots";
const WORDMARK = "Temi Adekunle";

/** A high-resolution dot matrix keeps the oversized footer mark legible. */
export function FooterAsciiBrand() {
  return (
    <div className="mt-14 h-[clamp(6.5rem,21vw,15rem)] overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1120 340"
        className="block w-full text-white/[0.16]"
        role="presentation"
      >
        <defs>
          <pattern
            id={WORDMARK_ID}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="0.9" fill="currentColor" />
          </pattern>
          <mask
            id={`${WORDMARK_ID}-mask`}
            x="0"
            y="0"
            width="1120"
            height="340"
            maskUnits="userSpaceOnUse"
          >
            <text
              x="560"
              y="270"
              textAnchor="middle"
              textLength="1092"
              lengthAdjust="spacingAndGlyphs"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="210"
              fontWeight="600"
              letterSpacing="-12"
              fill="white"
            >
              {WORDMARK}
            </text>
          </mask>
        </defs>
        <rect
          width="1120"
          height="340"
          fill={`url(#${WORDMARK})`}
          mask={`url(#${WORDMARK_ID}-mask)`}
        />
      </svg>
    </div>
  );
}
