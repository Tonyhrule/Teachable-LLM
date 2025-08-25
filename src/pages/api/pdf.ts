import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument } from 'mupdf';
import { Formidable } from 'formidable';
import { readFile } from 'fs/promises';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new Formidable();
  const [, files] = await form.parse(req);

  const file = files.file?.at(0);

  if (!file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const document = PDFDocument.openDocument(await readFile(file.filepath));

  const pages = new Array(document.countPages()).fill(0).map((_, i) => {
    const page = document.loadPage(i);
    const text = page.toStructuredText().asText();
    return text;
  });

  res.status(200).json(pages);
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
