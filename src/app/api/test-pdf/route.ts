import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
    const { text } = await extractText(pdf);
    const parsedText = Array.isArray(text) ? text.join("\n") : text;

    return NextResponse.json({ success: true, text: parsedText });
  } catch (error: any) {
    console.error("PDF parse error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
