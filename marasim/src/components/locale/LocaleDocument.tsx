"use client";

import { useEffect } from "react";

type Props = {
  locale: string;
  dir: "rtl" | "ltr";
};

/** Syncs document lang/dir for localized marketing routes under the shared root layout. */
export default function LocaleDocument({ locale, dir }: Props) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = dir;
  }, [locale, dir]);

  return null;
}
