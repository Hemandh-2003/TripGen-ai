import pdf from "pdf-parse";

export const extractPDFText = async (
  pdfBuffer
) => {
  const data = await pdf(pdfBuffer);
  return data.text;
};