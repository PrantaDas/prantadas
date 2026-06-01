// eslint-disable-next-line @typescript-eslint/no-require-imports
const multiavatar = require("@multiavatar/multiavatar");

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

/** Generate a unique SVG avatar for a name and upload it to imgbb. Returns the hosted URL or null on failure. */
export async function generateCommentAvatar(
  name: string,
): Promise<string | null> {
  if (!IMGBB_API_KEY) {
    console.warn(
      "IMGBB_API_KEY is not set. Comment avatars will not be generated.",
    );
    return null;
  }
  try {
    // Unique seed per submission so the same person gets a different avatar each time
    const seed = `${name.trim()}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // multiavatar returns an SVG string
    const fn =
      typeof multiavatar === "function" ? multiavatar : multiavatar.default;
    const svg: string = fn(seed);

    const base64 = Buffer.from(svg).toString("base64");

    const body = new URLSearchParams({
      key: IMGBB_API_KEY,
      image: base64,
      name: `avatar-${name.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}`,
    });

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as {
      success: boolean;
      data?: { display_url: string };
    };

    return data.success && data.data?.display_url
      ? data.data.display_url
      : null;
  } catch {
    return null;
  }
}
