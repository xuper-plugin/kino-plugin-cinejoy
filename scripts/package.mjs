// Writes dist/<id>-<version>.kinoplugin: the file Kino imports with "Importar plugin desde un archivo" (a ZIP with the
// manifest, the bundled plugin.js, the icon and a kino-export.json naming each file's sha256). Run after `npm run build`.
import { createHash } from "node:crypto";
import { deflateRawSync } from "node:zlib";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const FILES = ["kino-plugin.json", "plugin.js", "icon.png"];

function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) {
    let c = (crc ^ b) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** A plain ZIP (deflate, no data descriptors, no directories). */
function zip(entries) {
  const locals = [], centrals = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const packed = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(nameBuf.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(8, 10);
    central.writeUInt32LE(crc, 16); central.writeUInt32LE(packed.length, 20); central.writeUInt32LE(data.length, 24); central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, nameBuf, packed);
    centrals.push(central, nameBuf);
    offset += 30 + nameBuf.length + packed.length;
  }
  const dir = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(dir.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, dir, end]);
}

const files = FILES.map((f) => [f, readFileSync(join(ROOT, f))]);
const manifest = JSON.parse(files[0][1].toString("utf8"));
const info = {
  format: 1,
  exportedAt: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
  pluginId: manifest.id,
  name: manifest.name,
  version: manifest.version,
  originalAddress: null,
  kinoVersion: "kit",
  files: Object.fromEntries(files.map(([f, d]) => [f, createHash("sha256").update(d).digest("hex")]).sort()),
};
mkdirSync(join(ROOT, "dist"), { recursive: true });
const out = join(ROOT, "dist", `${manifest.id}-${manifest.version}.kinoplugin`);
writeFileSync(out, zip([...files, ["kino-export.json", Buffer.from(JSON.stringify(info, null, 2))]]));
console.log("wrote " + out);
