import { X2jOptions } from "fast-xml-parser";
import { CoMet } from "../interfaces/comet";
import { ComicInfo } from "../interfaces/comicInfo";
/**
 * Validates and parses an XML string into a JavaScript object.
 * @param xmlContent - The XML content as a string.
 * @param options - Optional parser options.
 * @returns {T} - The parsed JavaScript object.
 * @throws {Error} - Throws an error if the XML is invalid.
 */
export declare function parseXml<T = unknown>(xmlContent: string, options?: X2jOptions): T;
/**
 * Parses a `<comet>` XML document into a `CoMet` object.
 * @param xml - The XML content as a string.
 * @returns {CoMet} - The parsed `CoMet` object.
 */
export declare function parseCometXml(xml: string): CoMet;
/**
 * Parses a `<ComicInfo>` XML document into a `ComicInfo` object.
 * @param xml - The XML content as a string.
 * @returns {ComicInfo} - The parsed `ComicInfo` object.
 */
export declare function parseComicInfoXml(xml: string): ComicInfo;
//# sourceMappingURL=xml-utils.d.ts.map