"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertParsedXmlToComicInfo = convertParsedXmlToComicInfo;
exports.convertParsedXmlToCoMet = convertParsedXmlToCoMet;
exports.convertParsedArchiveCommentToComicbookinfo = convertParsedArchiveCommentToComicbookinfo;
/**
 * Ensures the input is always returned as an array.
 * @param val - The value to normalize.
 * @returns {T[]} - An array of the input value.
 */
function ensureArray(val) {
    if (val == null)
        return [];
    return Array.isArray(val) ? val : [val];
}
/**
 * Safely parses a string into a number.
 * @param value - The value to parse.
 * @returns {number | undefined} - The parsed number or undefined if invalid.
 */
function parseNumber(value) {
    return value != null ? parseInt(value.toString(), 10) : undefined;
}
/**
 * Converts parsed XML data into a ComicInfo object.
 * @param parsedXmlData - The parsed XML data.
 * @returns {ComicInfo} - A valid ComicInfo object.
 */
function convertParsedXmlToComicInfo(parsedXmlData) {
    var _a, _b;
    const comicInfoData = parsedXmlData.ComicInfo || {};
    // Normalize pages
    const pagesRaw = (_a = comicInfoData.Pages) === null || _a === void 0 ? void 0 : _a.Page;
    const pages = ensureArray(pagesRaw).map((value) => {
        const page = value; // Explicitly cast to the expected type
        return {
            Image: parseNumber(page["@_Image"]),
            Type: page["@_Type"],
            DoublePage: page["@_DoublePage"] === "True",
            ImageSize: parseNumber(page["@_ImageSize"]),
            ImageWidth: parseNumber(page["@_ImageWidth"]),
            ImageHeight: parseNumber(page["@_ImageHeight"]),
        };
    });
    return {
        Title: comicInfoData.Title,
        Series: comicInfoData.Series,
        Number: (_b = comicInfoData.Number) === null || _b === void 0 ? void 0 : _b.toString(),
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
function convertParsedXmlToCoMet(parsedXmlData) {
    const cometData = parsedXmlData.comet || {};
    return {
        title: cometData.title || "",
        description: cometData.description,
        series: cometData.series || "",
        issue: parseNumber(cometData.issue),
        volume: parseNumber(cometData.volume),
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
        pages: ensureArray(cometData.pages).map((page) => parseNumber(page)),
        creator: ensureArray(cometData.creator),
        writer: ensureArray(cometData.writer),
        penciller: ensureArray(cometData.penciller),
        editor: ensureArray(cometData.editor),
        coverDesigner: ensureArray(cometData.coverDesigner),
        letterer: ensureArray(cometData.letterer),
        inker: ensureArray(cometData.inker),
        colorist: ensureArray(cometData.colorist),
        coverImage: cometData.coverImage,
        lastMark: parseNumber(cometData.lastMark),
        readingDirection: cometData.readingDirection,
    };
}
/**
 * Converts parsed JSON data into a ComicBookInfo object.
 * @param parsedJsonData - The parsed JSON data.
 * @returns {ComicBookInfo} - A valid ComicBookInfo object.
 */
function convertParsedArchiveCommentToComicbookinfo(parsedJsonData) {
    const comicBookInfoPayload = parsedJsonData["ComicBookInfo/1.0"];
    return {
        appID: parsedJsonData.appID,
        lastModified: parsedJsonData.lastModified,
        "ComicBookInfo/1.0": {
            series: comicBookInfoPayload.series || "",
            title: comicBookInfoPayload.title || "",
            publisher: comicBookInfoPayload.publisher || "",
            publicationMonth: comicBookInfoPayload.publicationMonth || 0,
            publicationYear: comicBookInfoPayload.publicationYear || 0,
            issue: parseNumber(comicBookInfoPayload.issue) || 0,
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
            })),
            tags: comicBookInfoPayload.tags || [],
            comments: comicBookInfoPayload.comments || "",
        },
    };
}
