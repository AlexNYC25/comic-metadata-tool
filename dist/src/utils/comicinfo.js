"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isXmlObjectValidComicInfo = void 0;
const isXmlObjectValidComicInfo = (xmlObject) => {
    // Check if the object has the property ?xml
    if (Object.prototype.hasOwnProperty.call(xmlObject, "?xml")) {
        // Check if the object has the property ComicInfo
        if (Object.prototype.hasOwnProperty.call(xmlObject, "ComicInfo")) {
            // Check if ComicInfo is an object
            if (typeof xmlObject["ComicInfo"] === "object") {
                return true;
            }
        }
    }
    return false;
};
exports.isXmlObjectValidComicInfo = isXmlObjectValidComicInfo;
