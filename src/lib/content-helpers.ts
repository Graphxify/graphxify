/**
 * Shared helpers for normalising cover‑image URLs and gallery images.
 * Used by marketing pages (home, works) and anywhere else that
 * needs to resolve a displayable image from CMS data.
 */

type SupabaseLoaderParams = {
    src: string;
    width: number;
    quality?: number;
    maxWidth?: number;
    height?: number;
    resize?: "cover" | "contain" | "fill";
};

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

    // Supabase media uploads already use unique object paths, so avoid adding
    // extra query parameters that can trip Next image optimization.
    if (/^https?:\/\//i.test(src)) {
        return src;
    }

    const [path, rawQuery = ""] = src.split("?");
    const params = new URLSearchParams(rawQuery);
    params.set("v", version);
    const nextQuery = params.toString();
    return nextQuery.length > 0 ? `${path}?${nextQuery}` : path;
}

export function shouldBypassNextImageOptimization(src: string): boolean {
    if (!/^https?:\/\//i.test(src)) {
        return false;
    }

    try {
        const url = new URL(src);
        return /supabase\.co$/i.test(url.hostname) && url.pathname.includes("/storage/v1/object/public/");
    } catch {
        return false;
    }
}

function buildSupabasePublicImageUrl({
    src,
    width,
    quality,
    maxWidth,
    height,
    resize
}: SupabaseLoaderParams): string {
    if (!shouldBypassNextImageOptimization(src)) {
        return src;
    }

    const url = new URL(src);
    url.pathname = url.pathname.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
    url.searchParams.set("width", String(Math.max(1, Math.min(width, maxWidth ?? 2500))));
    if (typeof height === "number" && Number.isFinite(height) && height > 0) {
        url.searchParams.set("height", String(Math.round(height)));
    }
    if (resize) {
        url.searchParams.set("resize", resize);
    }
    url.searchParams.set("quality", String(quality ?? 75));
    return url.toString();
}

export function supabasePublicImageLoader(params: SupabaseLoaderParams): string {
    return buildSupabasePublicImageUrl(params);
}

export function createSupabasePublicImageLoader(
    defaults: Omit<SupabaseLoaderParams, "src" | "width"> = {}
): ({ src, width, quality }: Pick<SupabaseLoaderParams, "src" | "width" | "quality">) => string {
    return ({ src, width, quality }) =>
        buildSupabasePublicImageUrl({
            ...defaults,
            src,
            width,
            quality: quality ?? defaults.quality
        });
}
