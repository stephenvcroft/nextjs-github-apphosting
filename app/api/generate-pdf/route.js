import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

export async function POST(req) {
  const { week, sheet, theme, code } = await req.json();
  // console.log(code);

  const doc = new PDFDocument({
    size: "LETTER",
    margin: 0,
  });

  doc.registerFont("faktos", "fonts/Faktos.ttf");
  doc.font("faktos");

  // Create a readable stream to pipe the PDF output
  const stream = new Readable();
  stream._read = () => {}; // No-op to make it a readable stream

  doc.on("data", (chunk) => stream.push(chunk));
  doc.on("end", () => stream.push(null));

  doc.image(`public/themes/${theme}.png`, 0, 0, { width: 612 });

  eval(code);

  doc.end();

  // Return the generated PDF as a stream
  const pdfChunks = [];
  for await (const chunk of stream) {
    pdfChunks.push(chunk);
  }

  const pdfBuffer = Buffer.concat(pdfChunks);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=generated.pdf",
    },
  });
}
