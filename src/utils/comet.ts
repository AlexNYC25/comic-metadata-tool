// Update the xmlObhect type from any to a specific type for the XML Object returend from the parseXml
export const isXMLObjectValidCoMet = (xmlObject: any): boolean => {
  // Check if the object has the property ?xml
  if (Object.prototype.hasOwnProperty.call(xmlObject, "?xml")) {
    // Check if the object has the property ComicInfo
    if (Object.prototype.hasOwnProperty.call(xmlObject, "comet")) {
      // Check if ComicInfo is an object
      if (typeof xmlObject["comet"] === "object") {
        return true;
      }
    }
  }

  return false;
};
