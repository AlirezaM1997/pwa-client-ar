import { getJsonFromUrl } from "@functions/getJsonFromUrl";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req) {
  const index = String(req?.cookies)?.indexOf("NEXT_LOCALE=");
  const lang = index === -1 ? "en" : String(req?.cookies)?.slice(index + 12, index + 14);
  // slice(index + 12, index + 14) : Assuming that the abbreviations of each language are two letters

  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }
  const params = getJsonFromUrl(req.nextUrl.search, true);
  const comingFromZarinpal = (params?.src == "pwa" || params?.src == "app") && params?.redirectTo && params?.Status
  if (req.nextUrl.locale === "default" && !comingFromZarinpal) {
    const locale = lang;
    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }
}
