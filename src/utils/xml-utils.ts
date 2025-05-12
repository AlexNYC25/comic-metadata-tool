// parser.ts
import { XMLParser, XMLValidator, X2jOptions } from "fast-xml-parser";
import { CoMet } from "../interfaces/comet";
import { ComicInfo } from "../interfaces/comicInfo";
import { ComicPageInfo } from "../interfaces/metadata-parts/comic-page-info";
import { YesNo } from "../types/yes-no";
import { Manga } from "../types/manga";
import { AgeRating } from "../types/age-rating";

/**
 * Validates & parses an XML string into a JavaScript object.
 */
export function parseXml<T = unknown>(
  xmlContent: string,
  options: X2jOptions = {}
): T {
  const validationResult = XMLValidator.validate(xmlContent);
  if (validationResult !== true) {
    const err = (validationResult as any).err;
    throw new Error(
      `Invalid XML at line ${err.line}, col ${err.col}: ${err.msg}`
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

/** Make sure we always get an array out of “maybe T | T[] | undefined” */
function ensureArray<T>(val?: T | T[]): T[] {
  if (val == null) return [];
  return Array.isArray(val) ? val : [val];
}

/**
 * Parse a `<comet>…</comet>` document into our `Comet` interface.
 */
export function parseCometXml(xml: string): CoMet {
  const raw = parseXml<{ comet: any }>(xml, {
    ignoreNameSpace: true,
    attributeNamePrefix: "",
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    parseTagValue: true,
    parseAttributeValue: true,
  });

  const c = raw.comet;
  return {
    title: c.title,
    description: c.description,
    series: c.series,
    issue: c.issue,
    volume: c.volume,
    publisher: c.publisher,
    date: c.date,
    // repeating elements → arrays
    genre: ensureArray(c.genre),
    character: ensureArray(c.character),
    isVersionOf: c.isVersionOf,
    price: c.price,
    format: c.format,
    language: c.language,
    rating: c.rating,
    rights: c.rights,
    identifier: c.identifier,
    pages: c.pages,
    creator: ensureArray(c.creator),
    writer: ensureArray(c.writer),
    penciller: ensureArray(c.penciller),
    editor: ensureArray(c.editor),
    coverDesigner: c.coverDesigner,
    letterer: ensureArray(c.letterer),
    inker: ensureArray(c.inker),
    colorist: ensureArray(c.colorist),
    coverImage: c.coverImage,
    lastMark: c.lastMark,
    readingDirection: c.readingDirection as "ltr" | "rtl",
  };
}

/**
 * Parse a `<ComicInfo>…</ComicInfo>` document into our `ComicInfo` interface.
 */
export function parseComicInfoXml(xml: string): ComicInfo {
  const raw = parseXml<{ ComicInfo: any }>(xml, {
    ignoreNameSpace: true,
    attributeNamePrefix: "",
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    parseTagValue: true,
    parseAttributeValue: true,
  });

  const ci = raw.ComicInfo;

  // flatten the nested Pages → Page array (if any)
  const pagesRaw = ci.Pages?.Page;
  const pages: ComicPageInfo[] | undefined = pagesRaw
    ? ensureArray(pagesRaw).map((p: any) => ({
        Image: p.Image,
        Type: p.Type as ComicPageInfo["Type"],
        DoublePage: p.DoublePage,
        ImageSize: p.ImageSize,
        Key: p.Key,
        Bookmark: p.Bookmark, // v2/v2.1 only
        ImageWidth: p.ImageWidth,
        ImageHeight: p.ImageHeight,
      }))
    : undefined;

  return {
    Title: ci.Title,
    Series: ci.Series,
    Number: ci.Number,
    Count: ci.Count,
    Volume: ci.Volume,
    AlternateSeries: ci.AlternateSeries,
    AlternateNumber: ci.AlternateNumber,
    AlternateCount: ci.AlternateCount,
    Summary: ci.Summary,
    Notes: ci.Notes,
    Year: ci.Year,
    Month: ci.Month,
    Day: ci.Day, // v2+
    Writer: ci.Writer,
    Penciller: ci.Penciller,
    Inker: ci.Inker,
    Colorist: ci.Colorist,
    Letterer: ci.Letterer,
    CoverArtist: ci.CoverArtist,
    Editor: ci.Editor,
    Translator: ci.Translator, // v2.1+
    Publisher: ci.Publisher,
    Imprint: ci.Imprint,
    Genre: ci.Genre,
    Tags: ci.Tags, // v2.1 renaming/addition
    Web: ci.Web,
    PageCount: ci.PageCount,
    LanguageISO: ci.LanguageISO,
    Format: ci.Format,
    BlackAndWhite: ci.BlackAndWhite as YesNo,
    Manga: ci.Manga as Manga,
    Characters: ci.Characters,
    Teams: ci.Teams,
    Locations: ci.Locations,
    ScanInformation: ci.ScanInformation,
    StoryArc: ci.StoryArc,
    StoryArcNumber: ci.StoryArcNumber, // v2.1+
    SeriesGroup: ci.SeriesGroup,
    AgeRating: ci.AgeRating as AgeRating,
    Pages: pages,
    CommunityRating: ci.CommunityRating,
    MainCharacterOrTeam: ci.MainCharacterOrTeam,
    Review: ci.Review,
    GTIN: ci.GTIN, // v2.1+
  };
}
