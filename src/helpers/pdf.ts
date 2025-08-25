import { PDFDocument } from 'mupdf';

export const pdfToText = async (file: File) => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.onload = async (event) => {
      const arrayBuffer = event.target?.result;
      if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer)) {
        return reject(new Error('Failed to read file'));
      }

      resolve(arrayBuffer);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  const document = PDFDocument.openDocument(arrayBuffer);

  const pages = new Array(document.countPages()).fill(0).map((_, i) => {
    const page = document.loadPage(i);
    const text = page.toString();
    return text;
  });

  console.log(pages);
};
