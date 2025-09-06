# comic-metadata-tool

A Node.js tool to read and write metadata from comic book archive files (CBZ, CBR, CB7) supporting ComicInfo.xml, CoMet, and ComicBookInfo formats.

## Supported Archive Formats & Tooling

This library supports multiple comic archive formats using different underlying tools:

### CBZ Files (.cbz, .zip)
- **Native Support**: Pure JavaScript implementation
- **Library**: [`adm-zip`](https://github.com/cthackers/adm-zip) - A pure JavaScript implementation for handling ZIP archives
- **Features**: 
  - Read ZIP comments (for ComicBookInfo metadata)
  - Extract XML files (ComicInfo.xml, CoMet.xml)
  - Full archive content listing
- **Platform**: Cross-platform, no external dependencies

### CBR Files (.cbr, .rar)
- **External Tool**: RAR decompression via WebAssembly
- **Library**: [`node-unrar-js`](https://github.com/YuJianrong/node-unrar-js) - A JavaScript port of UnRAR using Emscripten
- **Features**:
  - Read RAR comments (for ComicBookInfo metadata)
  - Extract files from RAR archives
  - Full archive content listing
- **Platform**: Cross-platform WebAssembly implementation, no external binaries required

### CB7 Files (.cb7, .7z)
- **External Tool**: 7-Zip binary
- **Libraries**: 
  - [`node-7z`](https://github.com/quentinrossetti/node-7z) - Node.js wrapper for 7-Zip
  - [`7zip-bin`](https://github.com/develar/7zip-bin) - Provides platform-specific 7za binaries
- **Features**:
  - Extract XML files from 7z archives
  - Full archive content listing
- **Platform**: Cross-platform (includes binaries for Windows, macOS, Linux)
- **Note**: On macOS, you may need to make the binary executable: `chmod +x node_modules/7zip-bin/mac/arm64/7za`

### XML Parsing
- **Library**: [`fast-xml-parser`](https://github.com/NaturalIntelligence/fast-xml-parser) - High-performance XML parser
- **Features**: Parse ComicInfo.xml and CoMet.xml metadata formats

## Supported Metadata Formats

- [ComicBookInfo](https://code.google.com/archive/p/comicbookinfo/wikis/Example.wiki)
- [CoMet](https://www.denvog.com/comet/comet-specification/)
- [ComicInfo.xml](https://github.com/anansi-project/comicinfo/blob/main/schema/v2.0/ComicInfo.xsd)

## Installation

```sh
npm install comic-metadata-tool
```

## TypeScript Support

This package includes comprehensive TypeScript definitions and supports both ESM and CommonJS imports:

```typescript
import { 
  readComicFileMetadata, 
  type MetadataCompiled, 
  type ReadComicFileMetadataOptions,
  type ComicInfo,
  type CoMet,
  type ComicBookInfo 
} from "comic-metadata-tool";

// All return types are fully typed
const metadata: MetadataCompiled = await readComicFileMetadata(filePath);
```

## Usage

### Importing
```js
// ESM
import { readComicFileMetadata } from "comic-metadata-tool";

// CommonJS
const { readComicFileMetadata } = require("comic-metadata-tool");
```

### Reading Metadata from an Archive

```js
const filePath = "/path/to/comic.cbz"; // or .cbr, .cb7

readComicFileMetadata(filePath, {
  parseComicInfoXml: true,
  parseComicBookInfo: true,
  parseCoMet: true
})
  .then((metadata) => {
    // metadata is an object with parsed ComicInfo, CoMet, and ComicBookInfo if present
    console.log(metadata);

    // Example: Access ComicInfo.xml data
    if (metadata.comicInfoXml) {
      console.log("ComicInfo Title:", metadata.comicInfoXml.Title);
    }

    // Example: Access CoMet data
    if (metadata.coMet) {
      console.log("CoMet Title:", metadata.coMet.title);
    }

    // Example: Access ComicBookInfo data from archive comment
    if (metadata.comicbookinfo) {
      console.log("ComicBookInfo Series:", metadata.comicbookinfo["ComicBookInfo/1.0"].series);
    }
  })
  .catch((err) => {
    console.error("Failed to read metadata:", err);
  });
```

### Example Output
```js
{
  "archiveType": "zip",
  "archivePath": "/path/to/comic.cbz",
  "xmlFilePresent": true,
  "zipCommentPresent": true,
  "comicInfoXmlFile": "<ComicInfo>...</ComicInfo>",
  "coMetXmlFile": "<comet>...</comet>",
  "comicbookinfoComment": "{ ... }",
  "comicInfoXml": {
    "title": "Example Comic",
    "series": "Example Series",
    "number": "1",
    ...
  },
  "coMet": {
    "title": "Example Comic",
    "series": "Example Series",
    ...
  },
  "comicbookinfo": {
    "appID": "...",
    "lastModified": "...",
    "ComicBookInfo/1.0": {
      "series": "Example Series",
      "title": "Example Comic",
      ...
    }
  }
}
```

### ComicInfoXml Example
Full object representing data from the ComicInfo Xml file

```js
comicInfoXml: {
    title: 'Knife Trick',
    series: 'Batman',
    number: '1',
    count: '57',
    volume: undefined,
    alternateSeries: undefined,
    alternateNumber: undefined,
    alternateCount: undefined,
    summary: 'Be here for the start of a new era for The Dark Knight from writer Scott Snyder (AMERICAN VAMPIRE, BATMAN: GATES OF GOTHAM) and artist Greg Capullo (Spawn)! A series of brutal killings hints at an ancient conspiracy, and Batman learns that Gotham City is deadlier than he knew.',
    notes: 'Tagged with ComicTagger 1.6.0a22 using info from Comic Vine on 2025-05-02 01:42:11. [Issue ID 293259]',
    year: '2011',
    month: '11',
    day: '30',
    writer: 'Scott Snyder',
    penciller: 'Greg Capullo,Greg Capullo',
    inker: 'Jonathan Glapion',
    colorist: 'FCO Plascencia',
    letterer: 'Jimmy Betancourt',
    coverArtist: 'Ethan Van Sciver,FCO Plascencia,Greg Capullo',
    editor: 'Janelle Asselin (Siegel),Katie Kubert,Mike Marts',
    publisher: 'DC Comics',
    imprint: undefined,
    genre: undefined,
    web: 'https://comicvine.gamespot.com/batman-1-knife-trick/4000-293259/',
    pageCount: '30',
    languageISO: undefined,
    format: undefined,
    blackAndWhite: undefined,
    manga: undefined,
    characters: 'Flamingo,Ventriloquist (Wesker),James Gordon Jr.,Two-Face,Mr. Zsasz,Big Top,Damian Wayne,Tim Drake,Leslie Thompkins,Pandora,James Gordon,Scarecrow,Harvey Bullock,Mr. Freeze,Vicki Vale,Dick Grayson,Riddler,Professor Pyg,Killer Croc,Batman,Scarface,Lincoln March,Alfred Pennyworth,Phosphorus Rex,Harley Quinn,Clayface (Karlo),Bluebird,Jeremiah Arkham',
    teams: 'Court of Owls,Batman Family,Gotham City Police Department',
    locations: 'Gotham City,Batcave,Arkham Asylum',
    scanInformation: '(7 covers) (digital) (Minutemen-PhD)',
    storyArc: '"Batman" A Court of Owls',
    seriesGroup: undefined,
    ageRating: undefined,
    pages: [
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object]
    ],
    communityRating: undefined,
    mainCharacterOrTeam: undefined,
    review: undefined
  },
```

Example of one of the objects in the 'pages' array
```js
{
  Image: 0,
  Type: 'FrontCover',
  DoublePage: false,
  ImageSize: 480200,
  ImageWidth: 1988,
  ImageHeight: 3056
}
```

### CoMet Example
```js
{
  title: [ 'Knife Trick'],
  description: [
    'Be here for the start of a new era for The Dark Knight from writer Scott Snyder (AMERICAN VAMPIRE, BATMAN: GATES OF GOTHAM) and artist Greg Capullo (Spawn)! A series of brutal killings hints at an ancient conspiracy, and Batman learns that Gotham City is deadlier than he knew.'
  ],
  series: [ 'Batman' ],
  issue: 1,
  volume: undefined,
  publisher: [ 'DC Comics' ],
  date: [ '2011-11' ],
  genre: [ '' ],
  character: [
    'Vicki Vale',
    'Bluebird',
    'Tim Drake',
    'Harley Quinn',
    'Harvey Bullock',
    'Scarface',
    'Pandora',
    'Mr. Zsasz',
    'Professor Pyg',
    'James Gordon',
    'Lincoln March',
    'Mr. Freeze',
    'Leslie Thompkins',
    'Damian Wayne',
    'Scarecrow',
    'Clayface (Karlo)',
    'Batman',
    'Ventriloquist (Wesker)',
    'Alfred Pennyworth',
    'Big Top',
    'Two-Face',
    'Killer Croc',
    'Dick Grayson',
    'Flamingo',
    'Jeremiah Arkham',
    'Riddler',
    'James Gordon Jr.',
    'Phosphorus Rex',
    'Flamingo',
    'Ventriloquist (Wesker)',
    'James Gordon Jr.',
    'Two-Face',
    'Mr. Zsasz',
    'Big Top',
    'Damian Wayne',
    'Tim Drake',
    'Leslie Thompkins',
    'Pandora',
    'James Gordon',
    'Scarecrow',
    'Harvey Bullock',
    'Mr. Freeze'
  ],
  isVersionOf: undefined,
  price: undefined,
  format: undefined,
  language: undefined,
  rating: '',
  rights: undefined,
  identifier: undefined,
  pages: [ 30 ],
  creator: [],
  writer: [ 'Scott Snyder' ],
  penciller: [ 'Greg Capullo', 'Greg Capullo' ],
  editor: [
    'Janelle Asselin (Siegel)',
    'Katie Kubert',
    'Mike Marts'
  ],
  coverDesigner: [
    'Ethan Van Sciver',
    'FCO Plascencia',
    'Greg Capullo'
  ],
  letterer: [ 'Jimmy Betancourt'],
  inker: [ 'Jonathan Glapion' ],
  colorist: [ 'FCO Plascencia' ],
  coverImage: [
    'Batman 001 (2011) (7 covers) (digital) (Minutemen-PhD)/Batman (2011-) 001-000.webp'
  ],
  lastMark: undefined,
  readingDirection: undefined
}
```

### comicbookinfo Example
```js
{
  appID: 'ComicTagger/1.0.0',
  lastModified: '2025-05-09 21:12:35.793015',
  'ComicBookInfo/1.0': {
    series: 'Batman',
    title: 'Knife Trick',
    publisher: 'DC Comics',
    publicationMonth: 11,
    publicationYear: 2011,
    issue: 1,
    numberOfIssues: 57,
    volume: 0,
    numberOfVolumes: 0,
    rating: 0,
    genre: '',
    language: '',
    country: '',
    credits: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    tags: [],
    comments: 'Be here for the start of a new era for The Dark Knight from writer Scott Snyder (AMERICAN VAMPIRE, BATMAN: GATES OF GOTHAM) and artist Greg Capullo (Spawn)! A series of brutal killings hints at an ancient conspiracy, and Batman learns that Gotham City is deadlier than he knew.'
  }
}
```

example of credits array
```js
[
  { person: 'Scott Snyder', role: 'Writer', primary: false },
  { person: 'Greg Capullo', role: 'Penciller', primary: false },
  { person: 'Jonathan Glapion', role: 'Inker', primary: false },
  { person: 'FCO Plascencia', role: 'Colorist', primary: false },
  { person: 'Jimmy Betancourt', role: 'Letterer', primary: false },
  { person: 'Ethan Van Sciver', role: 'Cover', primary: false },
  { person: 'FCO Plascencia', role: 'Cover', primary: false },
  { person: 'Greg Capullo', role: 'Cover', primary: false },
  {
    person: 'Janelle Asselin (Siegel)',
    role: 'Editor',
    primary: false
  },
  { person: 'Katie Kubert', role: 'Editor', primary: false },
  { person: 'Mike Marts', role: 'Editor', primary: false },
  { person: 'Greg Capullo', role: 'Penciler', primary: false }
]
```

## Troubleshooting

If you encounter issues with 7z file handling on macOS, run:
```sh
chmod +x node_modules/7zip-bin/mac/arm64/7za
```

## License

MIT