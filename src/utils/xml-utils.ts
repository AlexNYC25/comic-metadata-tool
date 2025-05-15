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
    Title: ci.Title as string,
    Series: ci.Series as string,
    Number: ci.Number as string,
    Count: ci.Count as number,
    Volume: ci.Volume as number,
    AlternateSeries: ci.AlternateSeries as string,
    AlternateNumber: ci.AlternateNumber as string,
    AlternateCount: ci.AlternateCount as number,
    Summary: ci.Summary as string,
    Notes: ci.Notes as string,
    Year: ci.Year as number,
    Month: ci.Month as number,
    Day: ci.Day as number, // v2+
    Writer: ci.Writer as string,
    Penciller: ci.Penciller as string,
    Inker: ci.Inker as string,
    Colorist: ci.Colorist as string,
    Letterer: ci.Letterer as string,
    CoverArtist: ci.CoverArtist as string,
    Editor: ci.Editor as string,
    //Translator: ci.Translator as string, // v2.1+
    Publisher: ci.Publisher as string,
    Imprint: ci.Imprint as string,
    Genre: ci.Genre as string,
    //Tags: ci.Tags as string[], // v2.1 renaming/addition
    Web: ci.Web as string,
    PageCount: ci.PageCount as number,
    LanguageISO: ci.LanguageISO as string,
    Format: ci.Format as string,
    BlackAndWhite: ci.BlackAndWhite as YesNo,
    Manga: ci.Manga as Manga,
    Characters: ci.Characters as string,
    Teams: ci.Teams as string,
    Locations: ci.Locations as string,
    ScanInformation: ci.ScanInformation as string,
    StoryArc: ci.StoryArc as string,
    //StoryArcNumber: ci.StoryArcNumber as number, // v2.1+
    SeriesGroup: ci.SeriesGroup as string,
    AgeRating: ci.AgeRating as AgeRating,
    Pages: pages,
    CommunityRating: ci.CommunityRating as number,
    MainCharacterOrTeam: ci.MainCharacterOrTeam as string,
    Review: ci.Review as string,
    //GTIN: ci.GTIN as string, // v2.1+
  };
}
