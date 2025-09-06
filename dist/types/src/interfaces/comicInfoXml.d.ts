import { AgeRating } from "../types/age-rating";
import { YesNo } from "../types/yes-no";
import { Manga } from "../types/manga";
import { ComicPageInfo } from "./metadata-parts/comic-page-info";
export interface ComicInfoRawXML {
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
//# sourceMappingURL=comicInfoXml.d.ts.map