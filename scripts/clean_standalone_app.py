#!/usr/bin/env python3
import os
import re
from bs4 import BeautifulSoup

TARGET_DIR = os.path.abspath("target_app")

AD_DOMAINS = [
    "ezoic",
    "ezojs",
    "ezodn",
    "gatekeeperconsent",
    "googletagmanager",
    "googlesyndication",
    "doubleclick",
    "open.video",
    "ad-gate.js",
]

INLINE_AD_KEYWORDS = [
    "__ez",
    "_ezaq",
    "ezTcfConsent",
    "_setEzCookies",
    "addEzCookies",
    "ezoicTestActive",
    "ezAnalyticsStatic",
    "google_ama_config",
    "ezstandalone",
    "dataLayer",
    "qubit-js-ezoic",
    "humixPlayers",
    "_emitEzConsentEvent",
    "_handleConsentDecision",
    "adsbygoogle",
    "QubitCssExclusions",
    "ezoTemplate",
    "ezdomain",
    "ezoicSearchable",
    "ezorca",
    "data-anchor-status",
    "data-google-query-id",
    "window.ezgconsent",
    "__CF$cv$params",
    "challenge-platform",
]

def clean_html_file(file_path):
    print(f"Cleaning {os.path.basename(file_path)}...")
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    soup = BeautifulSoup(content, "html.parser")

    # 1. Remove ad/tracker script tags with src
    removed_scripts = 0
    for script in soup.find_all("script"):
        src = script.get("src", "")
        if src and any(domain in src.lower() for domain in AD_DOMAINS):
            script.decompose()
            removed_scripts += 1
            continue

        # Check inline scripts
        if not src:
            text = script.string or script.text or ""
            if any(kw in text for kw in INLINE_AD_KEYWORDS):
                script.decompose()
                removed_scripts += 1
                continue

    # 2. Remove ad/tracker link preloads
    removed_links = 0
    for link in soup.find_all("link"):
        href = link.get("href", "")
        if href and any(domain in href.lower() for domain in AD_DOMAINS):
            link.decompose()
            removed_links += 1

    # 3. Remove ad DOM elements (ins.adsbygoogle, spans/divs with ezoic placeholders)
    removed_elements = 0
    for tag in soup.find_all(["ins", "span", "div", "iframe"]):
        tag_id = tag.get("id", "")
        tag_class = " ".join(tag.get("class", []))
        has_ez_ph = tag.has_attr("data-ez-ph-id") or tag.has_attr("data-method")

        if (
            "adsbygoogle" in tag_class
            or "ezoic" in tag_id.lower()
            or "ezoic" in tag_class.lower()
            or has_ez_ph
            or tag_id.startswith("ezoic-pub-ad")
        ):
            tag.decompose()
            removed_elements += 1

    # 4. Normalize absolute root paths to relative paths (e.g. /main.js -> main.js)
    for tag in soup.find_all(["script", "link", "img", "a"]):
        for attr in ["src", "href"]:
            val = tag.get(attr)
            if val and val.startswith("/") and not val.startswith("//"):
                tag[attr] = val.lstrip("/")

    # 5. Output cleaned file
    cleaned_html = str(soup)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(cleaned_html)

    print(f"  -> Removed {removed_scripts} scripts, {removed_links} links, {removed_elements} ad placeholders.")

def main():
    html_files = [
        f for f in os.listdir(TARGET_DIR)
        if f.endswith(".html")
    ]
    for html_file in sorted(html_files):
        clean_html_file(os.path.join(TARGET_DIR, html_file))

if __name__ == "__main__":
    main()
