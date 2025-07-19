import { XMLParser, XMLValidator, X2jOptions } from "fast-xml-parser";
import { CoMet } from "../interfaces/comet";
import { ComicInfo } from "../interfaces/comicInfo";
import { ComicPageInfo } from "../interfaces/metadata-parts/comic-page-info";
import { YesNo } from "../types/yes-no";
import { Manga } from "../types/manga";
import { AgeRating } from "../types/age-rating";

type RawPagesNode = {
  Page?: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Validates and parses an XML string into a JavaScript object.
 * @param xmlContent - The XML content as a string.
 * @param options - Optional parser options.
 * @returns {T} - The parsed JavaScript object.
 * @throws {Error} - Throws an error if the XML is invalid.
 */
export function parseXml<T = unknown>(
  xmlContent: string,
  options: X2jOptions = {}
): T {
  const validationResult = XMLValidator.validate(xmlContent) as
    | true
    | { err: { line: number; col: number; msg: string } };
  if (validationResult !== true) {
    const { err } = validationResult;
    throw new Error(
      `Invalid XML at line ${err.line}, column ${err.col}: ${err.msg}`
    );
  }

  const parser = new XMLParser({
    ...options,
    ignoreAttributes: false,
    parseTagValue: false, // Prevent parsing empty tags as strings
    parseAttributeValue: true,
  });

  return parser.parse(xmlContent) as T;
}

/**
 * Ensures the input is always returned as an array.
 * @param val - The value to normalize.
 * @returns {T[]} - An array of the input value.
 */
function ensureArray<T>(val?: T | T[]): T[] {
  if (val == null) return [];
  return Array.isArray(val) ? val : [val];
}

/**
 * Parses a `<comet>` XML document into a `CoMet` object.
 * @param xml - The XML content as a string.
 * @returns {CoMet} - The parsed `CoMet` object.
 */
export function parseCometXml(xml: string): CoMet {
  const raw = parseXml<{ comet: Record<string, unknown> }>(xml, {
    attributeNamePrefix: "",
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    parseTagValue: true,
    parseAttributeValue: true,
  });

  const c = raw.comet;
  return {
    title: c.title as string,
    description: c.description as string | undefined,
    series: c.series as string,
    issue: c.issue as number | undefined,
    volume: c.volume as number | undefined,
    publisher: c.publisher as string | undefined,
    date: c.date as string | undefined,
    genre: ensureArray(c.genre as string | string[]),
    character: ensureArray(c.character as string | string[]),
    isVersionOf: c.isVersionOf as string | undefined,
    price: c.price as number | undefined,
    format: c.format as string | undefined,
    language: c.language as string | undefined,
    rating: c.rating as string | undefined,
    rights: c.rights as string | undefined,
    identifier: c.identifier as string | undefined,
    pages: ensureArray(c.pages as number | number[]),
    creator: ensureArray(c.creator as string | string[]),
    writer: ensureArray(c.writer as string | string[]),
    penciller: ensureArray(c.penciller as string | string[]),
    editor: ensureArray(c.editor as string | string[]),
    coverDesigner: ensureArray(c.coverDesigner as string | string[]),
    letterer: ensureArray(c.letterer as string | string[]),
    inker: ensureArray(c.inker as string | string[]),
    colorist: ensureArray(c.colorist as string | string[]),
    coverImage: c.coverImage as string | undefined,
    lastMark: c.lastMark as number | undefined,
    readingDirection: c.readingDirection as "ltr" | "rtl",
  };
}

/**
 * Parses a `<ComicInfo>` XML document into a `ComicInfo` object.
 * @param xml - The XML content as a string.
 * @returns {ComicInfo} - The parsed `ComicInfo` object.
 */
export function parseComicInfoXml(xml: string): ComicInfo {
  const raw = parseXml<{ ComicInfo: Record<string, unknown> }>(xml, {
    attributeNamePrefix: "",
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    parseTagValue: true,
    parseAttributeValue: true,
  });

  const ci = raw.ComicInfo;

  // Flatten the nested Pages → Page array (if any)
  const pagesRaw = (ci.Pages as RawPagesNode | undefined)?.Page;
  const pages: ComicPageInfo[] | undefined = pagesRaw
    ? ensureArray<Record<string, unknown>>(pagesRaw).map((p) => ({
        Image: p.Image as number,
        Type: p.Type as ComicPageInfo["Type"],
        DoublePage: p.DoublePage as boolean,
        ImageSize: p.ImageSize as number,
        Key: p.Key as string,
        Bookmark: p.Bookmark as string, // v2/v2.1 only
        ImageWidth: p.ImageWidth as number,
        ImageHeight: p.ImageHeight as number,
      }))
    : undefined;

  return {
    title: ci.Title as string,
    series: ci.Series as string,
    number: ci.Number as string,
    count: ci.Count as number,
    volume: ci.Volume as number,
    alternateSeries: ci.AlternateSeries as string,
    alternateNumber: ci.AlternateNumber as string,
    alternateCount: ci.AlternateCount as number,
    summary: ci.Summary as string,
    notes: ci.Notes as string,
    year: ci.Year as number,
    month: ci.Month as number,
    day: ci.Day as number, // v2+
    writer: ci.Writer as string,
    penciller: ci.Penciller as string,
    inker: ci.Inker as string,
    colorist: ci.Colorist as string,
    letterer: ci.Letterer as string,
    coverArtist: ci.CoverArtist as string,
    editor: ci.Editor as string,
    //translator: ci.Translator as string, // v2.1+
    publisher: ci.Publisher as string,
    imprint: ci.Imprint as string,
    genre: ci.Genre as string,
    //tags: ci.Tags as string[], // v2.1 renaming/addition
    web: ci.Web as string,
    pageCount: ci.PageCount as number,
    languageISO: ci.LanguageISO as string,
    format: ci.Format as string,
    blackAndWhite: ci.BlackAndWhite as YesNo,
    manga: ci.Manga as Manga,
    characters: ci.Characters as string,
    teams: ci.Teams as string,
    locations: ci.Locations as string,
    scanInformation: ci.ScanInformation as string,
    storyArc: ci.StoryArc as string,
    //storyArcNumber: ci.StoryArcNumber as number, // v2.1+
    seriesGroup: ci.SeriesGroup as string,
    ageRating: ci.AgeRating as AgeRating,
    pages: pages,
    communityRating: ci.CommunityRating as number,
    mainCharacterOrTeam: ci.MainCharacterOrTeam as string,
    review: ci.Review as string,
    //GTIN: ci.GTIN as string, // v2.1+
  };
}
