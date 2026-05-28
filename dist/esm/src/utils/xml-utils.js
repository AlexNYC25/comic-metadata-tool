import { XMLBuilder, XMLParser, XMLValidator, } from "fast-xml-parser";
/**
 * Validates and parses an XML string into a JavaScript object.
 * @param xmlContent - The XML content as a string.
 * @param options - Optional parser options.
 * @returns {T} - The parsed JavaScript object.
 * @throws {Error} - Throws an error if the XML is invalid.
 */
export function parseXml(xmlContent, options = {}) {
    const validationResult = XMLValidator.validate(xmlContent);
    if (validationResult !== true) {
        const { err } = validationResult;
        throw new Error(`Invalid XML at line ${err.line}, column ${err.col}: ${err.msg}`);
    }
    const parser = new XMLParser({
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
export function parseCometXml(xml) {
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
        penciler: ensureArray(c.penciler),
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
export function parseComicInfoXml(xml) {
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
        penciler: ci.Penciler,
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
function pruneUndefined(value) {
    if (Array.isArray(value)) {
        return value
            .map((entry) => pruneUndefined(entry))
            .filter((entry) => entry !== undefined);
    }
    if (value && typeof value === "object") {
        const entries = Object.entries(value)
            .filter(([, entryValue]) => entryValue !== undefined)
            .map(([key, entryValue]) => [key, pruneUndefined(entryValue)]);
        return Object.fromEntries(entries);
    }
    return value;
}
function getXmlBuilder() {
    return new XMLBuilder({
        ignoreAttributes: false,
        format: true,
        suppressEmptyNode: true,
    });
}
function mapComicInfoPagesToXml(pages) {
    if (!pages || pages.length === 0) {
        return undefined;
    }
    return {
        Page: pages.map((page) => pruneUndefined({
            "@_Image": page.Image,
            "@_Type": page.Type,
            "@_DoublePage": page.DoublePage === undefined
                ? undefined
                : page.DoublePage
                    ? "True"
                    : "False",
            "@_ImageSize": page.ImageSize,
            "@_Key": page.Key,
            "@_Bookmark": page.Bookmark,
            "@_ImageWidth": page.ImageWidth,
            "@_ImageHeight": page.ImageHeight,
        })),
    };
}
export function serializeComicInfoXml(comicInfo) {
    const comicInfoXmlObject = pruneUndefined({
        ComicInfo: {
            Title: comicInfo.title,
            Series: comicInfo.series,
            Number: comicInfo.number,
            Count: comicInfo.count,
            Volume: comicInfo.volume,
            AlternateSeries: comicInfo.alternateSeries,
            AlternateNumber: comicInfo.alternateNumber,
            AlternateCount: comicInfo.alternateCount,
            Summary: comicInfo.summary,
            Notes: comicInfo.notes,
            Year: comicInfo.year,
            Month: comicInfo.month,
            Day: comicInfo.day,
            Writer: comicInfo.writer,
            Penciler: comicInfo.penciler,
            Inker: comicInfo.inker,
            Colorist: comicInfo.colorist,
            Letterer: comicInfo.letterer,
            CoverArtist: comicInfo.coverArtist,
            Editor: comicInfo.editor,
            Publisher: comicInfo.publisher,
            Imprint: comicInfo.imprint,
            Genre: comicInfo.genre,
            Web: comicInfo.web,
            PageCount: comicInfo.pageCount,
            LanguageISO: comicInfo.languageISO,
            Format: comicInfo.format,
            BlackAndWhite: comicInfo.blackAndWhite,
            Manga: comicInfo.manga,
            Characters: comicInfo.characters,
            Teams: comicInfo.teams,
            Locations: comicInfo.locations,
            ScanInformation: comicInfo.scanInformation,
            StoryArc: comicInfo.storyArc,
            SeriesGroup: comicInfo.seriesGroup,
            AgeRating: comicInfo.ageRating,
            Pages: mapComicInfoPagesToXml(comicInfo.pages),
            CommunityRating: comicInfo.communityRating,
            MainCharacterOrTeam: comicInfo.mainCharacterOrTeam,
            Review: comicInfo.review,
        },
    });
    return `<?xml version="1.0" encoding="utf-8"?>\n${getXmlBuilder().build(comicInfoXmlObject)}`;
}
export function serializeCoMetXml(coMet) {
    const coMetXmlObject = pruneUndefined({
        comet: {
            title: coMet.title,
            description: coMet.description,
            series: coMet.series,
            issue: coMet.issue,
            volume: coMet.volume,
            publisher: coMet.publisher,
            date: coMet.date,
            genre: coMet.genre,
            character: coMet.character,
            isVersionOf: coMet.isVersionOf,
            price: coMet.price,
            format: coMet.format,
            language: coMet.language,
            rating: coMet.rating,
            rights: coMet.rights,
            identifier: coMet.identifier,
            pages: coMet.pages,
            creator: coMet.creator,
            writer: coMet.writer,
            penciler: coMet.penciler,
            editor: coMet.editor,
            coverDesigner: coMet.coverDesigner,
            letterer: coMet.letterer,
            inker: coMet.inker,
            colorist: coMet.colorist,
            coverImage: coMet.coverImage,
            lastMark: coMet.lastMark,
            readingDirection: coMet.readingDirection,
        },
    });
    return `<?xml version="1.0" encoding="utf-8"?>\n${getXmlBuilder().build(coMetXmlObject)}`;
}
export function serializeComicBookInfoComment(comicbookinfo) {
    return JSON.stringify(comicbookinfo);
}
//# sourceMappingURL=xml-utils.js.map