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
    const parser = new fast_xml_parser_1.XMLParser(Object.assign(Object.assign({}, options), { ignoreAttributes: false, parseTagValue: false, parseAttributeValue: true }));
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
    var _a;
    const raw = parseXml(xml, {
        attributeNamePrefix: "",
        ignoreAttributes: false,
        allowBooleanAttributes: true,
        parseTagValue: true,
        parseAttributeValue: true,
    });
    const ci = raw.ComicInfo;
    // Flatten the nested Pages → Page array (if any)
    const pagesRaw = (_a = ci.Pages) === null || _a === void 0 ? void 0 : _a.Page;
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
        //Translator: ci.Translator as string, // v2.1+
        Publisher: ci.Publisher,
        Imprint: ci.Imprint,
        Genre: ci.Genre,
        //Tags: ci.Tags as string[], // v2.1 renaming/addition
        Web: ci.Web,
        PageCount: ci.PageCount,
        LanguageISO: ci.LanguageISO,
        Format: ci.Format,
        BlackAndWhite: ci.BlackAndWhite,
        Manga: ci.Manga,
        Characters: ci.Characters,
        Teams: ci.Teams,
        Locations: ci.Locations,
        ScanInformation: ci.ScanInformation,
        StoryArc: ci.StoryArc,
        //StoryArcNumber: ci.StoryArcNumber as number, // v2.1+
        SeriesGroup: ci.SeriesGroup,
        AgeRating: ci.AgeRating,
        Pages: pages,
        CommunityRating: ci.CommunityRating,
        MainCharacterOrTeam: ci.MainCharacterOrTeam,
        Review: ci.Review,
        //GTIN: ci.GTIN as string, // v2.1+
    };
}
