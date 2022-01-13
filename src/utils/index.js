import { GRADE_STATUS } from "./constants";

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

/**
 * Calculate my grades
 * 
 * @param gradeStructures 
 * @param grades 
 * @returns [myGrades, gradeTotal]
 */
export const calculateMyGrades = (gradeStructures, grades) => {
  const myGrades = gradeStructures.map((structure) => {
    const grade = grades?.find(
      (g) => g.gradeStructureId === structure.id
    );

    return {
      name: structure.name,
      total: structure.point,
      point:
        grade?.status === GRADE_STATUS.FINALIZED ? grade?.point : null,
      status: grade?.status,
    };
  });

  const gradeStructureSum = myGrades.reduce(
    (a, c) => a + Number(c.total),
    0
  );
  const total = myGrades.reduce((a, c) => {
    if (c?.point) {
      return (
        a +
        (Number(c.point) / Number(c.total)) *
          ((Number(c.total) / gradeStructureSum) * 10)
      );
    }

    return a;
  }, 0);

  return [myGrades, total.toFixed(2)];
}
