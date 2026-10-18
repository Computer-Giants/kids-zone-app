import React from "react";

export interface SceneSvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Responsive vector scenes for the five Catholic church rooms (1600 x 900 viewBox).
 */

export function NarthexSceneIllustration({ className, ...props }: SceneSvgProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="The Church Entrance and Narthex with heavy wooden arched doors, holy water font, and bell tower ropes"
      {...props}
    >
      <defs>
        <linearGradient
          id="narthex-wall"
          x1="0"
          y1="0"
          x2="0"
          y2="900"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="60%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient
          id="narthex-floor"
          x1="0"
          y1="650"
          x2="0"
          y2="900"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <radialGradient id="door-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall & Ceiling Arches */}
      <rect width="1600" height="680" fill="url(#narthex-wall)" />
      <path d="M 0 0 Q 800 200 1600 0 L 1600 680 L 0 680 Z" fill="#fef08a" opacity="0.4" />

      {/* Vaulted Stone Arches */}
      <path
        d="M 100 680 Q 800 -50 1500 680"
        stroke="#b45309"
        strokeWidth="24"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 250 680 Q 800 50 1350 680"
        stroke="#d97706"
        strokeWidth="16"
        fill="none"
        opacity="0.5"
      />

      {/* Grand Church Entry Doors */}
      <g transform="translate(600, 180)">
        <rect x="-30" y="-30" width="460" height="530" rx="200" fill="url(#door-glow)" />
        <path
          d="M 0 500 L 0 200 Q 200 -50 400 200 L 400 500 Z"
          fill="#78350f"
          stroke="#451a03"
          strokeWidth="14"
        />
        <line x1="200" y1="30" x2="200" y2="500" stroke="#451a03" strokeWidth="8" />
        <circle cx="160" cy="280" r="14" fill="#fbbf24" stroke="#78350f" strokeWidth="4" />
        <circle cx="240" cy="280" r="14" fill="#fbbf24" stroke="#78350f" strokeWidth="4" />
      </g>

      {/* Stone Floor */}
      <rect y="680" width="1600" height="220" fill="url(#narthex-floor)" />
      <line x1="0" y1="680" x2="1600" y2="680" stroke="#451a03" strokeWidth="8" />

      {/* Floor Pavers */}
      <path
        d="M 200 680 L 100 900 M 500 680 L 450 900 M 800 680 L 800 900 M 1100 680 L 1150 900 M 1400 680 L 1500 900"
        stroke="#92400e"
        strokeWidth="3"
        opacity="0.4"
      />

      {/* Holy Water Font Pillar (Left) */}
      <g transform="translate(300, 500)">
        <ellipse cx="60" cy="180" rx="60" ry="20" fill="#78350f" />
        <rect x="40" y="80" width="40" height="100" fill="#a16207" rx="6" />
        <path
          d="M 10 80 Q 60 120 110 80 Q 60 40 10 80 Z"
          fill="#eab308"
          stroke="#78350f"
          strokeWidth="4"
        />
        <ellipse cx="60" cy="75" rx="45" ry="18" fill="#38bdf8" opacity="0.8" />
        {/* Floating cross */}
        <path
          d="M 60 20 L 60 55 M 48 32 L 72 32"
          stroke="#eab308"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      {/* Bell Tower Wall Niche with Pull Rope (Right) */}
      <g transform="translate(1220, 220)">
        <path d="M 0 350 L 0 80 Q 50 0 100 80 L 100 350 Z" fill="#92400e" opacity="0.5" />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="350"
          stroke="#fef08a"
          strokeWidth="8"
          strokeDasharray="12 4"
        />
        <circle cx="50" cy="350" r="18" fill="#eab308" stroke="#78350f" strokeWidth="4" />
      </g>
    </svg>
  );
}

export function NaveSceneIllustration({ className, ...props }: SceneSvgProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="The Church Nave with central aisle, wooden pews, kneelers, stained glass windows, and Stations of the Cross"
      {...props}
    >
      <defs>
        <linearGradient id="nave-ceil" x1="0" y1="0" x2="0" y2="600" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="70%" stopColor="#334155" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient
          id="aisle-carpet"
          x1="0"
          y1="500"
          x2="0"
          y2="900"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>

      {/* Deep vaulted nave church ceiling */}
      <rect width="1600" height="900" fill="url(#nave-ceil)" />

      {/* Gothic Stained Glass Windows (Left & Right) */}
      <g opacity="0.85">
        {/* Left Windows */}
        <path
          d="M 80 150 Q 140 50 200 150 L 200 420 L 80 420 Z"
          fill="#3b82f6"
          stroke="#f59e0b"
          strokeWidth="8"
        />
        <circle cx="140" cy="220" r="35" fill="#ef4444" opacity="0.8" />
        {/* Right Windows */}
        <path
          d="M 1400 150 Q 1460 50 1520 150 L 1520 420 L 1400 420 Z"
          fill="#3b82f6"
          stroke="#f59e0b"
          strokeWidth="8"
        />
        <circle cx="1460" cy="220" r="35" fill="#ef4444" opacity="0.8" />
      </g>

      {/* Distant Sanctuary Arch View */}
      <path d="M 500 550 Q 800 200 1100 550 Z" fill="#fef3c7" opacity="0.3" />
      <line x1="800" y1="360" x2="800" y2="440" stroke="#fbbf24" strokeWidth="8" />
      <line x1="770" y1="390" x2="830" y2="390" stroke="#fbbf24" strokeWidth="8" />

      {/* Nave Floor */}
      <polygon points="0,900 1600,900 1100,550 500,550" fill="#475569" />

      {/* Center Aisle Red Carpet */}
      <polygon
        points="650,900 950,900 850,550 750,550"
        fill="url(#aisle-carpet)"
        stroke="#b91c1c"
        strokeWidth="4"
      />

      {/* Pews on Left */}
      <g fill="#78350f" stroke="#451a03" strokeWidth="5">
        <polygon points="120,860 600,860 550,780 150,780" />
        <polygon points="160,770 540,770 500,700 200,700" opacity="0.9" />
        <polygon points="210,690 490,690 460,630 250,630" opacity="0.8" />
      </g>

      {/* Pews on Right */}
      <g fill="#78350f" stroke="#451a03" strokeWidth="5">
        <polygon points="1000,860 1480,860 1450,780 1050,780" />
        <polygon points="1060,770 1440,770 1400,700 1100,700" opacity="0.9" />
        <polygon points="1110,690 1390,690 1350,630 1140,630" opacity="0.8" />
      </g>

      {/* Station of the Cross plaque (Left wall) */}
      <g transform="translate(180, 260)">
        <rect
          x="0"
          y="0"
          width="80"
          height="100"
          rx="10"
          fill="#d97706"
          stroke="#fef3c7"
          strokeWidth="6"
        />
        <path
          d="M 40 25 L 40 75 M 25 40 L 55 40"
          stroke="#fffbeb"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <text x="40" y="90" fill="#fffbeb" fontSize="14" fontWeight="bold" textAnchor="middle">
          XII
        </text>
      </g>

      {/* Confessional Door (Right wall) */}
      <g transform="translate(1330, 440)">
        <rect
          x="0"
          y="0"
          width="90"
          height="160"
          rx="8"
          fill="#451a03"
          stroke="#b45309"
          strokeWidth="6"
        />
        <circle cx="45" cy="40" r="18" fill="#78350f" stroke="#eab308" strokeWidth="3" />
        <line x1="20" y1="90" x2="70" y2="90" stroke="#eab308" strokeWidth="4" />
      </g>
    </svg>
  );
}

export function SanctuarySceneIllustration({ className, ...props }: SceneSvgProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="The Sacred Sanctuary with sanctuary lamp, marble pulpit ambo, and presider chair"
      {...props}
    >
      <defs>
        <linearGradient
          id="sanctuary-wall"
          x1="0"
          y1="0"
          x2="0"
          y2="700"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#f97316" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sanctuary Apse Wall */}
      <rect width="1600" height="900" fill="url(#sanctuary-wall)" />

      {/* Sanctuary Steps */}
      <polygon
        points="0,900 1600,900 1600,680 0,680"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="6"
      />
      <polygon
        points="100,680 1500,680 1450,620 150,620"
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="4"
      />
      <polygon
        points="200,620 1400,620 1350,560 250,560"
        fill="#e2e8f0"
        stroke="#cbd5e1"
        strokeWidth="4"
      />

      {/* Decorative Gold Sanctuary Railing */}
      <g stroke="#eab308" strokeWidth="6" opacity="0.6">
        <line x1="100" y1="720" x2="650" y2="720" />
        <line x1="950" y1="720" x2="1500" y2="720" />
      </g>

      {/* Marble Ambo (Pulpit on Left) */}
      <g transform="translate(350, 420)">
        <rect
          x="0"
          y="40"
          width="100"
          height="150"
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth="6"
          rx="6"
        />
        <path
          d="M -15 40 L 115 40 L 95 10 L 5 10 Z"
          fill="#e2e8f0"
          stroke="#64748b"
          strokeWidth="5"
        />
        <path
          d="M 50 70 L 50 120 M 35 85 L 65 85"
          stroke="#eab308"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Lectionary Book */}
        <polygon points="20,25 50,32 80,25 50,15" fill="#b91c1c" stroke="#eab308" strokeWidth="3" />
      </g>

      {/* Presider's Chair (Sedilia on Right) */}
      <g transform="translate(1080, 440)">
        {/* Tall Gothic Backrest */}
        <path
          d="M 15 160 L 15 20 Q 55 -20 95 20 L 95 160 Z"
          fill="#78350f"
          stroke="#451a03"
          strokeWidth="6"
        />
        <rect
          x="0"
          y="110"
          width="110"
          height="50"
          fill="#991b1b"
          stroke="#451a03"
          strokeWidth="5"
          rx="4"
        />
        <circle cx="55" cy="50" r="14" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />
      </g>

      {/* Glowing Red Sanctuary Lamp (Suspended on Right of Altar) */}
      <g transform="translate(1260, 220)">
        <circle cx="30" cy="60" r="60" fill="url(#lamp-glow)" />
        <line x1="30" y1="-80" x2="30" y2="40" stroke="#eab308" strokeWidth="4" />
        <path
          d="M 10 40 L 50 40 L 40 70 L 20 70 Z"
          fill="#dc2626"
          stroke="#eab308"
          strokeWidth="4"
        />
        <circle cx="30" cy="55" r="8" fill="#fef08a" />
      </g>
    </svg>
  );
}

export function AltarSceneIllustration({ className, ...props }: SceneSvgProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="The High Altar of Sacrifice and golden Tabernacle with crucifix"
      {...props}
    >
      <defs>
        <radialGradient id="tabernacle-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sacred Sanctuary Wall with Arch */}
      <rect width="1600" height="900" fill="#fffbeb" />
      <path
        d="M 300 900 L 300 350 Q 800 -50 1300 350 L 1300 900 Z"
        fill="#fef3c7"
        stroke="#eab308"
        strokeWidth="8"
      />

      {/* Reredos and Tabernacle Pedestal */}
      <g transform="translate(700, 160)">
        {/* Golden Holy Burst */}
        <circle cx="100" cy="110" r="150" fill="url(#tabernacle-burst)" />

        {/* Tabernacle Box */}
        <rect
          x="40"
          y="50"
          width="120"
          height="130"
          rx="10"
          fill="#eab308"
          stroke="#ca8a04"
          strokeWidth="8"
        />
        <path d="M 40 50 Q 100 10 160 50 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="6" />
        {/* Sacred Eucharistic Host & Chalice emblem */}
        <circle cx="100" cy="110" r="22" fill="#ffffff" stroke="#eab308" strokeWidth="4" />
        <path d="M 100 95 L 100 125 M 88 107 L 112 107" stroke="#eab308" strokeWidth="4" />
      </g>

      {/* The Altar Crucifix */}
      <g transform="translate(760, 40)">
        <line
          x1="40"
          y1="0"
          x2="40"
          y2="100"
          stroke="#78350f"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line
          x1="15"
          y1="30"
          x2="65"
          y2="30"
          stroke="#78350f"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Corpus in gold */}
        <circle cx="40" cy="28" r="6" fill="#fde047" />
        <line x1="40" y1="34" x2="40" y2="60" stroke="#fde047" strokeWidth="5" />
        <line x1="25" y1="35" x2="55" y2="35" stroke="#fde047" strokeWidth="4" />
      </g>

      {/* The Stone High Altar of Sacrifice */}
      <g transform="translate(450, 480)">
        {/* Altar Table Cloth */}
        <rect
          x="0"
          y="80"
          width="700"
          height="260"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="8"
          rx="8"
        />
        <rect
          x="-20"
          y="60"
          width="740"
          height="30"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="6"
          rx="6"
        />
        {/* Decorative Gold Embroidered Frontal */}
        <path
          d="M 30 140 Q 180 180 350 140 Q 520 180 670 140"
          stroke="#eab308"
          strokeWidth="8"
          fill="none"
        />
        {/* Altar Candles */}
        <rect x="60" y="0" width="20" height="60" fill="#fffbeb" stroke="#fde047" strokeWidth="3" />
        <ellipse cx="70" cy="-6" rx="6" ry="10" fill="#f97316" />
        <rect
          x="620"
          y="0"
          width="20"
          height="60"
          fill="#fffbeb"
          stroke="#fde047"
          strokeWidth="3"
        />
        <ellipse cx="630" cy="-6" rx="6" ry="10" fill="#f97316" />
      </g>
    </svg>
  );
}

export function SacristySceneIllustration({ className, ...props }: SceneSvgProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="The Sacristy preparation room with vestment wardrobe, sacred vessels cabinet, and sacrarium piscina"
      {...props}
    >
      <defs>
        <linearGradient
          id="sacristy-wood"
          x1="0"
          y1="0"
          x2="0"
          y2="700"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      {/* Quiet Oak Paneled Sacristy Room */}
      <rect width="1600" height="900" fill="#fef3c7" />
      <rect y="640" width="1600" height="260" fill="#b45309" stroke="#78350f" strokeWidth="8" />

      {/* Priest's Vestment Wardrobe (Left) */}
      <g transform="translate(250, 240)">
        <rect
          x="0"
          y="0"
          width="300"
          height="420"
          fill="url(#sacristy-wood)"
          stroke="#292524"
          strokeWidth="8"
          rx="10"
        />
        <line x1="150" y1="0" x2="150" y2="420" stroke="#292524" strokeWidth="6" />
        {/* Chasuble silhouette visible through glass */}
        <path
          d="M 60 70 Q 150 140 240 70 L 220 280 L 80 280 Z"
          fill="#15803d"
          stroke="#eab308"
          strokeWidth="4"
        />
        <path d="M 150 100 L 150 260 M 110 150 L 190 150" stroke="#fde047" strokeWidth="6" />
        {/* Door knobs */}
        <circle cx="135" cy="220" r="10" fill="#fbbf24" />
        <circle cx="165" cy="220" r="10" fill="#fbbf24" />
      </g>

      {/* Sacred Vessels Cabinet (Right) */}
      <g transform="translate(1050, 240)">
        <rect
          x="0"
          y="0"
          width="300"
          height="420"
          fill="url(#sacristy-wood)"
          stroke="#292524"
          strokeWidth="8"
          rx="10"
        />
        <rect
          x="30"
          y="30"
          width="240"
          height="180"
          fill="#1c1917"
          stroke="#eab308"
          strokeWidth="4"
          rx="6"
        />
        {/* Golden Chalice */}
        <g transform="translate(90, 60)">
          <path
            d="M 10 20 Q 30 70 30 90 L 30 110 L 10 130 L 50 130 L 30 110 L 30 90 Q 30 70 50 20 Z"
            fill="#eab308"
            stroke="#ca8a04"
            strokeWidth="3"
          />
        </g>
        {/* Golden Ciborium */}
        <g transform="translate(160, 50)">
          <path
            d="M 10 30 Q 35 80 35 100 L 35 120 L 15 140 L 55 140 L 35 120 L 35 100 Q 35 80 60 30 Z"
            fill="#eab308"
            stroke="#ca8a04"
            strokeWidth="3"
          />
          <path d="M 10 30 Q 35 10 60 30 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="3" />
          <line x1="35" y1="0" x2="35" y2="12" stroke="#eab308" strokeWidth="4" />
        </g>
      </g>

      {/* The Sacrarium (Piscina Basin Center) */}
      <g transform="translate(730, 560)">
        <rect
          x="20"
          y="60"
          width="100"
          height="120"
          fill="#e2e8f0"
          stroke="#64748b"
          strokeWidth="6"
          rx="8"
        />
        <ellipse cx="70" cy="60" rx="60" ry="24" fill="#f8fafc" stroke="#64748b" strokeWidth="6" />
        <ellipse cx="70" cy="60" rx="36" ry="12" fill="#334155" />
        {/* Brass Faucet */}
        <path
          d="M 70 60 L 70 10 Q 70 -10 90 -10 L 95 0"
          stroke="#eab308"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

/**
 * Helper to render the matching illustration by SVG key.
 */
export function ChurchSceneIllustration({
  svgKey,
  className,
}: {
  svgKey: string;
  className?: string;
}) {
  switch (svgKey) {
    case "narthex_scene":
      return <NarthexSceneIllustration className={className} />;
    case "nave_scene":
      return <NaveSceneIllustration className={className} />;
    case "sanctuary_scene":
      return <SanctuarySceneIllustration className={className} />;
    case "altar_scene":
      return <AltarSceneIllustration className={className} />;
    case "sacristy_scene":
      return <SacristySceneIllustration className={className} />;
    default:
      return <NarthexSceneIllustration className={className} />;
  }
}

/**
 * Sacred Item Badges for the Item Modal.
 */
export function ChurchItemBadge({
  itemKey,
  className = "w-16 h-16",
}: {
  itemKey: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-amber-300 bg-amber-100 text-amber-700 shadow-sm ${className}`}
    >
      <span className="text-3xl" role="img" aria-hidden="true">
        {itemKey === "holy_water_font" && "💧"}
        {itemKey === "church_bells" && "🔔"}
        {itemKey === "church_pew" && "🪑"}
        {itemKey === "stations_of_cross" && "✝️"}
        {itemKey === "confessional" && "🕊️"}
        {itemKey === "sanctuary_lamp" && "🕯️"}
        {itemKey === "ambo_pulpit" && "📖"}
        {itemKey === "presiders_chair" && "👑"}
        {itemKey === "altar_table" && "🍞"}
        {itemKey === "tabernacle" && "✨"}
        {itemKey === "crucifix" && "☦️"}
        {itemKey === "priest_vestments" && "🎽"}
        {itemKey === "sacred_vessels" && "🏆"}
        {itemKey === "sacrarium" && "🌱"}
      </span>
    </div>
  );
}
