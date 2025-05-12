import { ComicInfo } from "../../interfaces/comicInfo";
import { ComicPageInfo } from "../../interfaces/metadata-parts/comic-page-info";
import { CoMet } from "../../interfaces/comet";
import { ComicBookInfo } from "../../interfaces/comicbookinfo";
import { CreditEntry } from "../../interfaces/metadata-parts/credit-entry";

/**
 * Converts parsed XML data into a ComicInfo object.
 * @param {Record<string, unknown>} parsedXmlData - The parsed XML data.
 * @returns {ComicInfo} - A valid ComicInfo object.
 */
export function convertParsedXmlToComicInfo(
  parsedXmlData: Record<string, unknown>
): ComicInfo {
  // Check if the parsed XML data contains ComicInfo and assign it to a variable
  // Use Partial<ComicInfo> to allow for optional properties
  // This is a workaround to avoid TypeScript errors when accessing properties
  // that may not exist in the parsed XML data
  const comicInfoData = (parsedXmlData.ComicInfo as Partial<ComicInfo>) || {};

  // Define the XML page shape to avoid using 'any'
  // This is a workaround to avoid TypeScript errors when accessing properties
  // that may not exist in the parsed XML data
  // This is a exclusive interface for the XML page attributes for ComicInfo
  interface XmlPage {
    "@_Image": string;
    "@_Type": string;
    "@_DoublePage": string;
    "@_ImageSize": string;
    "@_ImageWidth": string;
    "@_ImageHeight": string;
  }

  // Ensure Pages is always an array and map the attributes correctly
  // This does some type gymnastics to ensure the raw object is
  // either an array of Pages or a single Page or undefined as fallback
  const pagesRaw = (
    comicInfoData.Pages as { Page?: XmlPage | XmlPage[] } | undefined
  )?.Page;
  // Check if pagesRaw is an array, a single object, or undefined
  // If it's an array, use it as is;
  // if it's a single object, wrap it in an array
  // If it's undefined, use an empty array
  const pages = Array.isArray(pagesRaw) ? pagesRaw : pagesRaw ? [pagesRaw] : [];

  //
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
    Pages: pages.map((page: XmlPage) => ({
      Image: parseInt(page["@_Image"], 10),
      Type: page["@_Type"] as ComicPageInfo["Type"],
      DoublePage: page["@_DoublePage"] === "True",
      ImageSize: page["@_ImageSize"]
        ? parseInt(page["@_ImageSize"], 10)
        : undefined,
      ImageWidth: page["@_ImageWidth"]
        ? parseInt(page["@_ImageWidth"], 10)
        : undefined,
      ImageHeight: page["@_ImageHeight"]
        ? parseInt(page["@_ImageHeight"], 10)
        : undefined,
    })),
    CommunityRating: comicInfoData.CommunityRating,
    MainCharacterOrTeam: comicInfoData.MainCharacterOrTeam,
    Review: comicInfoData.Review,
  };
}

/**
 * Converts parsed XML data into a CoMet object.
 * @param {Record<string, unknown>} parsedXmlData - The parsed XML data.
 * @returns {CoMet} - A valid CoMet object.
 */
export function convertParsedXmlToCoMet(
  parsedXmlData: Record<string, unknown>
): CoMet {
  const cometData = (parsedXmlData.comet as Partial<CoMet>) || {};

  // Ensure arrays for fields that can have multiple values
  const ensureArray = <T>(val?: T | T[]): T[] => {
    if (val == null) return [];
    return Array.isArray(val) ? val : [val];
  };

  return {
    title: cometData.title || "",
    description: cometData.description,
    series: cometData.series || "",
    issue: cometData.issue
      ? parseInt(cometData.issue.toString(), 10)
      : undefined,
    volume: cometData.volume
      ? parseInt(cometData.volume.toString(), 10)
      : undefined,
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
    pages: ensureArray(cometData.pages).map((page) =>
      parseInt(page.toString(), 10)
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
    lastMark: cometData.lastMark
      ? parseInt(cometData.lastMark.toString(), 10)
      : undefined,
    readingDirection: cometData.readingDirection as "ltr" | "rtl",
  };
}

/**
 * Converts parsed JSON data into a ComicBookInfo object.
 * @param {Record<string, unknown>} parsedJsonData - The parsed JSON data.
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
      issue: parseInt(comicBookInfoPayload.issue?.toString() || "0", 10),
      numberOfIssues: comicBookInfoPayload.numberOfIssues || 0,
      volume: comicBookInfoPayload.volume || 0,
      numberOfVolumes: comicBookInfoPayload.numberOfVolumes || 0,
      rating: comicBookInfoPayload.rating || 0,
      genre: comicBookInfoPayload.genre || "",
      language: comicBookInfoPayload.language || "",
      country: comicBookInfoPayload.country || "",
      credits: (comicBookInfoPayload.credits || []).map((credit) => ({
        person: credit.person || "",
        role: credit.role || "",
        primary: credit.primary || false,
      })) as CreditEntry[],
      tags: comicBookInfoPayload.tags || [],
      comments: comicBookInfoPayload.comments || "",
    },
  };
}
