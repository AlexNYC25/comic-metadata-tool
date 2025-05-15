import { ComicInfo } from "../../interfaces/comicInfo";
import { ComicPageInfo } from "../../interfaces/metadata-parts/comic-page-info";
import { CoMet } from "../../interfaces/comet";
import { ComicBookInfo } from "../../interfaces/comicbookinfo";
import { CreditEntry } from "../../interfaces/metadata-parts/credit-entry";

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
 * Safely parses a string into a number.
 * @param value - The value to parse.
 * @returns {number | undefined} - The parsed number or undefined if invalid.
 */
function parseNumber(value?: string | number): number | undefined {
  return value != null ? parseInt(value.toString(), 10) : undefined;
}

/**
 * Converts parsed XML data into a ComicInfo object.
 * @param parsedXmlData - The parsed XML data.
 * @returns {ComicInfo} - A valid ComicInfo object.
 */
export function convertParsedXmlToComicInfo(
  parsedXmlData: Record<string, unknown>
): ComicInfo {
  const comicInfoData = (parsedXmlData.ComicInfo as Partial<ComicInfo>) || {};

  // Normalize pages
  const pagesRaw = (comicInfoData.Pages as { Page?: unknown } | undefined)
    ?.Page;
  const pages: ComicPageInfo[] = ensureArray(pagesRaw).map((value) => {
    const page = value as Record<string, unknown>; // Explicitly cast to the expected type
    return {
      Image: parseNumber(page["@_Image"] as string | number)!,
      Type: page["@_Type"] as ComicPageInfo["Type"],
      DoublePage: page["@_DoublePage"] === "True",
      ImageSize: parseNumber(page["@_ImageSize"] as string | number),
      ImageWidth: parseNumber(page["@_ImageWidth"] as string | number),
      ImageHeight: parseNumber(page["@_ImageHeight"] as string | number),
    };
  });

  return {
    Title: comicInfoData.Title,
    Series: comicInfoData.Series,
    Number: comicInfoData.Number?.toString(),
    Count: comicInfoData.Count,
    Volume: comicInfoData.Volume,
    AlternateSeries: comicInfoData.AlternateSeries,
    AlternateNumber: comicInfoData.AlternateNumber,
    AlternateCount: comicInfoData.AlternateCount,
    Summary: comicInfoData.Summary,
    Notes: comicInfoData.Notes,
    Year: comicInfoData.Year,
    Month: comicInfoData.Month,
    Day: comicInfoData.Day,
    Writer: comicInfoData.Writer,
    Penciller: comicInfoData.Penciller,
    Inker: comicInfoData.Inker,
    Colorist: comicInfoData.Colorist,
    Letterer: comicInfoData.Letterer,
    CoverArtist: comicInfoData.CoverArtist,
    Editor: comicInfoData.Editor,
    Publisher: comicInfoData.Publisher,
    Imprint: comicInfoData.Imprint,
    Genre: comicInfoData.Genre,
    Web: comicInfoData.Web,
    PageCount: comicInfoData.PageCount,
    LanguageISO: comicInfoData.LanguageISO,
    Format: comicInfoData.Format,
    BlackAndWhite: comicInfoData.BlackAndWhite,
    Manga: comicInfoData.Manga,
    Characters: comicInfoData.Characters,
    Teams: comicInfoData.Teams,
    Locations: comicInfoData.Locations,
    ScanInformation: comicInfoData.ScanInformation,
    StoryArc: comicInfoData.StoryArc,
    SeriesGroup: comicInfoData.SeriesGroup,
    AgeRating: comicInfoData.AgeRating,
    Pages: pages,
    CommunityRating: comicInfoData.CommunityRating,
    MainCharacterOrTeam: comicInfoData.MainCharacterOrTeam,
    Review: comicInfoData.Review,
  };
}

/**
 * Converts parsed XML data into a CoMet object.
 * @param parsedXmlData - The parsed XML data.
 * @returns {CoMet} - A valid CoMet object.
 */
export function convertParsedXmlToCoMet(
  parsedXmlData: Record<string, unknown>
): CoMet {
  const cometData = (parsedXmlData.comet as Partial<CoMet>) || {};

  return {
    title: cometData.title || "",
    description: cometData.description,
    series: cometData.series || "",
    issue: parseNumber(cometData.issue as string | number),
    volume: parseNumber(cometData.volume as string | number),
    publisher: cometData.publisher,
    date: cometData.date,
    genre: ensureArray(cometData.genre),
    character: ensureArray(cometData.character),
    isVersionOf: cometData.isVersionOf,
    price: cometData.price ? parseFloat(cometData.price.toString()) : undefined,
    format: cometData.format,
    language: cometData.language,
    rating: cometData.rating,
    rights: cometData.rights,
    identifier: cometData.identifier,
    pages: ensureArray(cometData.pages).map(
      (page) => parseNumber(page as string | number)!
    ),
    creator: ensureArray(cometData.creator),
    writer: ensureArray(cometData.writer),
    penciller: ensureArray(cometData.penciller),
    editor: ensureArray(cometData.editor),
    coverDesigner: ensureArray(cometData.coverDesigner),
    letterer: ensureArray(cometData.letterer),
    inker: ensureArray(cometData.inker),
    colorist: ensureArray(cometData.colorist),
    coverImage: cometData.coverImage,
    lastMark: parseNumber(cometData.lastMark as string | number),
    readingDirection: cometData.readingDirection as "ltr" | "rtl",
  };
}

/**
 * Converts parsed JSON data into a ComicBookInfo object.
 * @param parsedJsonData - The parsed JSON data.
 * @returns {ComicBookInfo} - A valid ComicBookInfo object.
 */
export function convertParsedArchiveCommentToComicbookinfo(
  parsedJsonData: Record<string, unknown>
): ComicBookInfo {
  const comicBookInfoPayload = parsedJsonData["ComicBookInfo/1.0"] as Partial<
    ComicBookInfo["ComicBookInfo/1.0"]
  >;

  return {
    appID: parsedJsonData.appID as string,
    lastModified: parsedJsonData.lastModified as string,
    "ComicBookInfo/1.0": {
      series: comicBookInfoPayload.series || "",
      title: comicBookInfoPayload.title || "",
      publisher: comicBookInfoPayload.publisher || "",
      publicationMonth: comicBookInfoPayload.publicationMonth || 0,
      publicationYear: comicBookInfoPayload.publicationYear || 0,
      issue: parseNumber(comicBookInfoPayload.issue as string | number) || 0,
      numberOfIssues: comicBookInfoPayload.numberOfIssues || 0,
      volume: comicBookInfoPayload.volume || 0,
      numberOfVolumes: comicBookInfoPayload.numberOfVolumes || 0,
      rating: comicBookInfoPayload.rating || 0,
      genre: comicBookInfoPayload.genre || "",
      language: comicBookInfoPayload.language || "",
      country: comicBookInfoPayload.country || "",
      credits: ensureArray(comicBookInfoPayload.credits).map((credit) => ({
        person: credit.person || "",
        role: credit.role || "",
        primary: credit.primary || false,
      })) as CreditEntry[],
      tags: comicBookInfoPayload.tags || [],
      comments: comicBookInfoPayload.comments || "",
    },
  };
}
