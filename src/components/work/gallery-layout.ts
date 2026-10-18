/**
 * Gallery helpers for case studies: read each render's real aspect ratio so the
 * bento can show every mockup uncropped, then pack renders into justified rows.
 */

/** Width / height from the first bytes of a PNG or JPEG, or null. */
export function readImageRatio(bytes: Uint8Array): number | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // PNG: signature, then IHDR width and height at bytes 16 and 20.
  if (bytes.length >= 24 && view.getUint32(0) === 0x89504e47) {
    const width = view.getUint32(16);
    const height = view.getUint32(20);
    return width && height ? width / height : null;
  }
  // JPEG: walk the segments to the first start-of-frame marker.
  if (bytes.length >= 4 && view.getUint16(0) === 0xffd8) {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) return null;
      const marker = bytes[offset + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        const height = view.getUint16(offset + 5);
        const width = view.getUint16(offset + 7);
        return width && height ? width / height : null;
      }
      offset += 2 + view.getUint16(offset + 2);
    }
  }
  // shortcut: WebP/AVIF/SVG return null and the tile falls back to a 3:2 crop; add parsers if the CMS starts storing them.
  return null;
}

/** Fetches only the file header (cached for a day). Any failure means "unknown". */
export async function getImageRatio(src: string): Promise<number | null> {
  if (!/^https?:\/\//i.test(src)) return null;
  try {
    const response = await fetch(src, { headers: { Range: "bytes=0-65535" }, next: { revalidate: 86400 } });
    if (!response.ok) return null;
    return readImageRatio(new Uint8Array(await response.arrayBuffer()));
  } catch {
    return null;
  }
}

/**
 * Groups ratios into rows whose summed ratio lands closest to the row's target.
 * Targets alternate (fewer, larger renders, then more, smaller ones) to give the bento its rhythm.
 * A small leftover joins the previous row. Returns rows of indexes into `ratios`.
 */
export function packRows(ratios: number[], targets: [number, number] = [2.8, 4.2]): number[][] {
  const rows: number[][] = [];
  let row: number[] = [];
  let sum = 0;
  let target = targets[0];
  ratios.forEach((ratio, index) => {
    if (row.length && (sum >= target || sum + ratio - target > target - sum)) {
      rows.push(row);
      row = [];
      sum = 0;
      target = targets[rows.length % 2];
    }
    row.push(index);
    sum += ratio;
  });
  if (row.length) {
    if (rows.length && sum < target / 2) rows[rows.length - 1].push(...row);
    else rows.push(row);
  }
  return rows;
}
