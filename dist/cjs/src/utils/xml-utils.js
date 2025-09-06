"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXml = parseXml;
exports.parseCometXml = parseCometXml;
exports.parseComicInfoXml = parseComicInfoXml;
const fast_xml_parser_1 = require("fast-xml-parser");
/**
 * Validates and parses an XML string into a JavaScript object.
 * @param xmlContent - The XML content as a string.
 * @param options - Optional parser options.
 * @returns {T} - The parsed JavaScript object.
 * @throws {Error} - Throws an error if the XML is invalid.
 */
function parseXml(xmlContent, options = {}) {
    const validationResult = fast_xml_parser_1.XMLValidator.validate(xmlContent);
    if (validationResult !== true) {
        const { err } = validationResult;
        throw new Error(`Invalid XML at line ${err.line}, column ${err.col}: ${err.msg}`);
    }
    const parser = new fast_xml_parser_1.XMLParser({
        ...options,
        ignoreAttributes: false,
        parseTagValue: false, // Prevent parsing empty tags as strings
        parseAttributeValue: true,
    });
    return parser.parse(xmlContent);
}
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
 * Parses a `<comet>` XML document into a `CoMet` object.
 * @param xml - The XML content as a string.
 * @returns {CoMet} - The parsed `CoMet` object.
 */
function parseCometXml(xml) {
    const raw = parseXml(xml, {
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
        genre: ensureArray(c.genre),
        character: ensureArray(c.character),
        isVersionOf: c.isVersionOf,
        price: c.price,
        format: c.format,
        language: c.language,
        rating: c.rating,
        rights: c.rights,
        identifier: c.identifier,
        pages: ensureArray(c.pages),
        creator: ensureArray(c.creator),
        writer: ensureArray(c.writer),
        penciller: ensureArray(c.penciller),
        editor: ensureArray(c.editor),
        coverDesigner: ensureArray(c.coverDesigner),
        letterer: ensureArray(c.letterer),
        inker: ensureArray(c.inker),
        colorist: ensureArray(c.colorist),
        coverImage: c.coverImage,
        lastMark: c.lastMark,
        readingDirection: c.readingDirection,
    };
}
/**
 * Parses a `<ComicInfo>` XML document into a `ComicInfo` object.
 * @param xml - The XML content as a string.
 * @returns {ComicInfo} - The parsed `ComicInfo` object.
 */
function parseComicInfoXml(xml) {
    const raw = parseXml(xml, {
        attributeNamePrefix: "",
        ignoreAttributes: false,
        allowBooleanAttributes: true,
        parseTagValue: true,
        parseAttributeValue: true,
    });
    const ci = raw.ComicInfo;
    // Flatten the nested Pages → Page array (if any)
    const pagesRaw = ci.Pages?.Page;
    const pages = pagesRaw
        ? ensureArray(pagesRaw).map((p) => ({
            Image: p.Image,
            Type: p.Type,
            DoublePage: p.DoublePage,
            ImageSize: p.ImageSize,
            Key: p.Key,
            Bookmark: p.Bookmark, // v2/v2.1 only
            ImageWidth: p.ImageWidth,
            ImageHeight: p.ImageHeight,
        }))
        : undefined;
    return {
        title: ci.Title,
        series: ci.Series,
        number: ci.Number,
        count: ci.Count,
        volume: ci.Volume,
        alternateSeries: ci.AlternateSeries,
        alternateNumber: ci.AlternateNumber,
        alternateCount: ci.AlternateCount,
        summary: ci.Summary,
        notes: ci.Notes,
        year: ci.Year,
        month: ci.Month,
        day: ci.Day, // v2+
        writer: ci.Writer,
        penciller: ci.Penciller,
        inker: ci.Inker,
        colorist: ci.Colorist,
        letterer: ci.Letterer,
        coverArtist: ci.CoverArtist,
        editor: ci.Editor,
        //translator: ci.Translator as string, // v2.1+
        publisher: ci.Publisher,
        imprint: ci.Imprint,
        genre: ci.Genre,
        //tags: ci.Tags as string[], // v2.1 renaming/addition
        web: ci.Web,
        pageCount: ci.PageCount,
        languageISO: ci.LanguageISO,
        format: ci.Format,
        blackAndWhite: ci.BlackAndWhite,
        manga: ci.Manga,
        characters: ci.Characters,
        teams: ci.Teams,
        locations: ci.Locations,
        scanInformation: ci.ScanInformation,
        storyArc: ci.StoryArc,
        //storyArcNumber: ci.StoryArcNumber as number, // v2.1+
        seriesGroup: ci.SeriesGroup,
        ageRating: ci.AgeRating,
        pages: pages,
        communityRating: ci.CommunityRating,
        mainCharacterOrTeam: ci.MainCharacterOrTeam,
        review: ci.Review,
        //GTIN: ci.GTIN as string, // v2.1+
    };
}
//# sourceMappingURL=xml-utils.js.map