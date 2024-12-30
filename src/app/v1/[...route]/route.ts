import { Hono } from "hono";
import { setSignedCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

export const runtime = "nodejs";

const appId = process.env.GITHUB_APP_ID;
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!appId || !clientId || !clientSecret) {
	throw new Error("Missing GitHub app ID, client ID, or client secret");
}

// TODO: remove hardcoded
const secret = "SCcUV0f2dKxs7qdzpv81a";

const app = new Hono().basePath("/v1");

// TODO: whitelist
app.use("/v1/*", cors());

app.get("/auth/github/callback", async (c) => {
	const { code } = c.req.query();

	if (!code) {
		throw new Error("Missing code");
	}

	const response = await fetch(
		`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
		{
			method: "POST",
		},
	);

	if (!response.ok) {
		return c.json({ success: false });
	}

	const data = await response.text();

	const params = new URLSearchParams(data);
	const token = params.get("access_token");

	if (!token) {
		return c.json({ data: null, error: "No access token returned" });
	}

	// TODO: add path, domain, maxAge, expires, sameSite
	await setSignedCookie(c, "rnf_access_token", token, secret, {
		secure: true,
		httpOnly: true,
	});

	return c.json({ code });
});

export const GET = handle(app);
export const POST = handle(app);
