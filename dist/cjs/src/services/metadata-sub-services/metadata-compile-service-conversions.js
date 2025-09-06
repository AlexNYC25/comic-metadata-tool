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
    const comicInfoData = parsedXmlData.ComicInfo || {};
    // Normalize pages
    const pagesRaw = comicInfoData.Pages
        ?.Page;
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
        title: comicInfoData.Title,
        series: comicInfoData.Series,
        number: comicInfoData.Number?.toString(),
        count: comicInfoData.Count,
        volume: comicInfoData.Volume,
        alternateSeries: comicInfoData.AlternateSeries,
        alternateNumber: comicInfoData.AlternateNumber,
        alternateCount: comicInfoData.AlternateCount,
        summary: comicInfoData.Summary,
        notes: comicInfoData.Notes,
        year: comicInfoData.Year,
        month: comicInfoData.Month,
        day: comicInfoData.Day,
        writer: comicInfoData.Writer,
        penciller: comicInfoData.Penciller,
        inker: comicInfoData.Inker,
        colorist: comicInfoData.Colorist,
        letterer: comicInfoData.Letterer,
        coverArtist: comicInfoData.CoverArtist,
        editor: comicInfoData.Editor,
        publisher: comicInfoData.Publisher,
        imprint: comicInfoData.Imprint,
        genre: comicInfoData.Genre,
        web: comicInfoData.Web,
        pageCount: comicInfoData.PageCount,
        languageISO: comicInfoData.LanguageISO,
        format: comicInfoData.Format,
        blackAndWhite: comicInfoData.BlackAndWhite,
        manga: comicInfoData.Manga,
        characters: comicInfoData.Characters,
        teams: comicInfoData.Teams,
        locations: comicInfoData.Locations,
        scanInformation: comicInfoData.ScanInformation,
        storyArc: comicInfoData.StoryArc,
        seriesGroup: comicInfoData.SeriesGroup,
        ageRating: comicInfoData.AgeRating,
        pages: pages,
        communityRating: comicInfoData.CommunityRating,
        mainCharacterOrTeam: comicInfoData.MainCharacterOrTeam,
        review: comicInfoData.Review,
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
//# sourceMappingURL=metadata-compile-service-conversions.js.map