import { ComicInfo } from "../../interfaces/comicInfo";
import { CoMet } from "../../interfaces/comet";
import { ComicBookInfo } from "../../interfaces/comicbookinfo";
/**
 * Converts parsed XML data into a ComicInfo object.
 * @param parsedXmlData - The parsed XML data.
 * @returns {ComicInfo} - A valid ComicInfo object.
 */
export declare function convertParsedXmlToComicInfo(parsedXmlData: Record<string, unknown>): ComicInfo;
/**
 * Converts parsed XML data into a CoMet object.
 * @param parsedXmlData - The parsed XML data.
 * @returns {CoMet} - A valid CoMet object.
 */
export declare function convertParsedXmlToCoMet(parsedXmlData: Record<string, unknown>): CoMet;
/**
 * Converts parsed JSON data into a ComicBookInfo object.
 * @param parsedJsonData - The parsed JSON data.
 * @returns {ComicBookInfo} - A valid ComicBookInfo object.
 */
export declare function convertParsedArchiveCommentToComicbookinfo(parsedJsonData: Record<string, unknown>): ComicBookInfo;
//# sourceMappingURL=metadata-compile-service-conversions.d.ts.map