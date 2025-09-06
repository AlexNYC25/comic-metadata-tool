import { AgeRating } from "../types/age-rating";
import { YesNo } from "../types/yes-no";
import { Manga } from "../types/manga";
import { ComicPageInfo } from "./metadata-parts/comic-page-info";
export interface ComicInfo {
    title?: string;
    series?: string;
    number?: string;
    count?: number;
    volume?: number;
    alternateSeries?: string;
    alternateNumber?: string;
    alternateCount?: number;
    summary?: string;
    notes?: string;
    year?: number;
    month?: number;
    /** v2 only */
    day?: number;
    writer?: string;
    penciller?: string;
    inker?: string;
    colorist?: string;
    letterer?: string;
    coverArtist?: string;
    editor?: string;
    publisher?: string;
    imprint?: string;
    genre?: string;
    web?: string;
    pageCount?: number;
    languageISO?: string;
    format?: string;
    blackAndWhite?: YesNo;
    manga?: Manga;
    /** v2 only */
    characters?: string;
    teams?: string;
    locations?: string;
    scanInformation?: string;
    storyArc?: string;
    seriesGroup?: string;
    /** v2 only */
    ageRating?: AgeRating;
    /** both versions */
    pages?: ComicPageInfo[];
    /** v2 only: 0.00–5.00 */
    communityRating?: number;
    /** v2 only */
    mainCharacterOrTeam?: string;
    /** v2 only */
    review?: string;
}
//# sourceMappingURL=comicInfo.d.ts.map