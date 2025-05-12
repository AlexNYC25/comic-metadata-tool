export interface CoMet {
  /** `<title>` (required) */
  title: string;

  /** `<description>` (optional) */
  description?: string;

  /** `<series>` (required) */
  series: string;

  /** `<issue>` (optional) — positive integer */
  issue?: number;

  /** `<volume>` (optional) — positive integer */
  volume?: number;

  /** `<publisher>` (optional) */
  publisher?: string;

  /** `<date>` (optional) — ISO 8601 date string (YYYY‑MM‑DD) */
  date?: string;

  /** `<genre>` (0..∞) */
  genre?: string[];

  /** `<character>` (0..∞) */
  character?: string[];

  /** `<isVersionOf>` (optional) */
  isVersionOf?: string;

  /** `<price>` (optional) — decimal */
  price?: number;

  /** `<format>` (optional) */
  format?: string;

  /** `<language>` (optional) — BCP 47 language tag */
  language?: string;

  /** `<rating>` (optional) */
  rating?: string;

  /** `<rights>` (optional) */
  rights?: string;

  /** `<identifier>` (optional) */
  identifier?: string;

  /** `<pages>` (0..∞) — each a positive integer */
  pages?: number[];

  /** `<creator>` (0..∞) */
  creator?: string[];

  /** `<writer>` (0..∞) */
  writer?: string[];

  /** `<penciller>` (0..∞) */
  penciller?: string[];

  /** `<editor>` (0..∞) */
  editor?: string[];

  /** `<coverDesigner>` (optional) */
  coverDesigner?: string[];

  /** `<letterer>` (0..∞) */
  letterer?: string[];

  /** `<inker>` (0..∞) */
  inker?: string[];

  /** `<colorist>` (0..∞) */
  colorist?: string[];

  /** `<coverImage>` (optional) — URL or path */
  coverImage?: string;

  /** `<lastMark>` (optional) — positive integer */
  lastMark?: number;

  /** `<readingDirection>` (required) */
  readingDirection: "ltr" | "rtl";
}
