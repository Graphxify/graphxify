/**
 * Shared helpers for normalising cover‑image URLs and gallery images.
 * Used by marketing pages (home, works) and anywhere else that
 * needs to resolve a displayable image from CMS data.
 */

export function normalizeImage(value: string | null | undefined): string | null {
    if (!value) {
        return null;
    }
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
}

export function firstGalleryImage(value: string[] | null | undefined): string | null {
    if (!Array.isArray(value)) {
        return null;
    }
    for (const item of value) {
        const normalized = normalizeImage(item);
        if (normalized) {
            return normalized;
        }
    }
    return null;
}

export function withImageVersion(src: string, version: string | null | undefined): string {
    if (!version) {
        return src;
    }

    const [path, rawQuery = ""] = src.split("?");
    const params = new URLSearchParams(rawQuery);
    params.set("v", version);
    const nextQuery = params.toString();
    return nextQuery.length > 0 ? `${path}?${nextQuery}` : path;
}
