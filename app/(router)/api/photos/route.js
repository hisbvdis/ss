import sharp from "sharp";
import { NextResponse } from "next/server";
import { existsSync, mkdirSync, unlinkSync } from "fs";

export async function POST(req) {
  if (!existsSync("./public/photos")) mkdirSync("./public/photos");
  const formData = await req.formData();
  const files = formData.getAll("file");
  const names = formData.getAll("name");
  const photos = files.reduce((acc, _, i) => acc.concat({file: files[i], name: names[i]}), []);
  for (let {file, name} of photos) {
    const buffer = Buffer.from(await file.arrayBuffer());
    await sharp(buffer)
      .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
      .webp({quality: 70})
      .toFile(`./public/photos/${name}`);
  }
  return NextResponse.json("Ok");
}

export async function DELETE(req) {
  const formData = await req.formData();
  const names = formData.getAll("name");
  for (let name of names) {
    if (existsSync(`./public/photos/${name}`)) unlinkSync(`./public/photos/${name}`);
  }
  return NextResponse.json("Ok");
}