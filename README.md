# comic-metadata-tool

A Node.js tool to read and write metadata from comic book archive files (CBZ, CBR, CB7) supporting ComicInfo.xml, CoMet, and ComicBookInfo formats.

## Supported Metadata Formats

- [ComicBookInfo](https://code.google.com/archive/p/comicbookinfo/wikis/Example.wiki)
- [CoMet](https://www.denvog.com/comet/comet-specification/)
- [ComicInfo.xml](https://github.com/anansi-project/comicinfo/blob/main/schema/v2.0/ComicInfo.xsd)

## Installation

```sh
npm install comic-metadata-tool
```

## Usage

### Importing
```js
// ESM
import { getComicFileMetadata } from "comic-metadata-tool";

// CommonJS
const { getComicFileMetadata } = require("comic-metadata-tool");
```

### Reading Metadata from an Archive

```js
const filePath = "/path/to/comic.cbz"; // or .cbr, .cb7

getComicFileMetadata(filePath)
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
    "Title": "Example Comic",
    "Series": "Example Series",
    "Number": "1",
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

## Troubleshooting

If you encounter issues with 7z file handling on macOS, run:
```sh
chmod +x node_modules/7zip-bin/mac/arm64/7za
```

## License

MIT