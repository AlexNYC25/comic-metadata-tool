import { ComicPageType } from "../../types/comic-page-type";

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
