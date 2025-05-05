// common simple types
export type YesNo = "Unknown" | "No" | "Yes";
export type Manga = YesNo | "YesAndRightToLeft";
export type AgeRating =
  | "Unknown"
  | "Adults Only 18+"
  | "Early Childhood"
  | "Everyone"
  | "Everyone 10+"
  | "G"
  | "Kids to Adults"
  | "M"
  | "MA15+"
  | "Mature 17+"
  | "PG"
  | "R18+"
  | "Rating Pending"
  | "Teen"
  | "X18+";

// page‐type list shared by both versions
export type ComicPageType =
  | "FrontCover"
  | "InnerCover"
  | "Roundup"
  | "Story"
  | "Advertisement"
  | "Editorial"
  | "Letters"
  | "Preview"
  | "BackCover"
  | "Other"
  | "Deleted";

export interface ComicPageInfo {
  /** @attribute Image (required) */
  Image: number;

  /** @attribute Type (default="Story") */
  Type?: ComicPageType;

  /** @attribute DoublePage (default="false") */
  DoublePage?: boolean;

  /** @attribute ImageSize (default="0") */
  ImageSize?: number;

  /** @attribute Key (default="") */
  Key?: string;

  /** v2 only: @attribute Bookmark (default="") */
  Bookmark?: string;

  /** @attribute ImageWidth (default="-1") */
  ImageWidth?: number;

  /** @attribute ImageHeight (default="-1") */
  ImageHeight?: number;
}

export interface ComicInfo {
  Title?: string;
  Series?: string;
  Number?: string;
  Count?: number;
  Volume?: number;

  AlternateSeries?: string;
  AlternateNumber?: string;
  AlternateCount?: number;

  Summary?: string;
  Notes?: string;

  Year?: number;
  Month?: number;

  /** v2 only */
  Day?: number;

  Writer?: string;
  Penciller?: string;
  Inker?: string;
  Colorist?: string;
  Letterer?: string;
  CoverArtist?: string;
  Editor?: string;

  Publisher?: string;
  Imprint?: string;
  Genre?: string;
  Web?: string;

  PageCount?: number;

  LanguageISO?: string;
  Format?: string;

  BlackAndWhite?: YesNo;
  Manga?: Manga;

  /** v2 only */
  Characters?: string;
  Teams?: string;
  Locations?: string;
  ScanInformation?: string;
  StoryArc?: string;
  SeriesGroup?: string;

  /** v2 only */
  AgeRating?: AgeRating;

  /** both versions */
  Pages?: ComicPageInfo[];

  /** v2 only: 0.00–5.00 */
  CommunityRating?: number;

  /** v2 only */
  MainCharacterOrTeam?: string;
  /** v2 only */
  Review?: string;
}
