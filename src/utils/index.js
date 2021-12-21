/**
 * Trigger a file downloading from a file or url
 *
 * @param fileOrUrl
 * @param fileName
 */
export const downloadFile = (fileOrUrl, fileName) => {
  const windowURL = window.URL || window.webkitURL;
  const blobURL =
    fileOrUrl.constructor === String
      ? fileOrUrl
      : windowURL.createObjectURL(fileOrUrl);
  const aTag = document.createElement("a");

  aTag.setAttribute("href", blobURL);
  aTag.setAttribute("download", fileName);
  aTag.setAttribute("target", "_blank");

  aTag.click();
  aTag.remove();

  windowURL.revokeObjectURL(blobURL);
};
