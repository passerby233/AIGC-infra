"""One-time import of local interface references; regular builds only require Node.

The original MHTMLs are intentionally never copied into the served directory.
Usage: python scripts/import-references.py --assets ../asset
"""
import argparse
import hashlib
import html
import re
from email import policy
from email.parser import BytesParser
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "http://117.50.195.94:2051/"
VOID = set("area base br col embed hr img input link meta param source track wbr".split())
BLOCKED = set("script iframe object embed form input textarea select option base".split())


def parts(source):
    return [p for p in BytesParser(policy=policy.default).parsebytes(source.read_bytes()).walk()
            if not p.is_multipart()]


def decode(part):
    return part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="replace")


class ReadOnlyHTML(HTMLParser):
    def __init__(self, mapping):
        super().__init__(convert_charrefs=True)
        self.mapping = mapping
        self.output = []
        self.blocked = []

    def resource(self, value):
        return self.mapping.get(value) or self.mapping.get(urljoin(ORIGIN, value))

    def handle_starttag(self, tag, attrs):
        if self.blocked:
            if tag not in VOID:
                self.blocked.append(tag)
            return
        if tag in BLOCKED:
            if tag not in VOID:
                self.blocked.append(tag)
            return
        values = dict(attrs)
        if tag == "meta":
            if values.get("name") != "viewport" and "charset" not in values:
                return
        if tag == "link":
            resource = self.resource(values.get("href", ""))
            if not resource:
                return
            values = {"rel": values.get("rel", "stylesheet"), "href": resource}
        cleaned = []
        for key, value in values.items():
            if key.lower().startswith("on") or key in {"srcset", "action", "formaction", "nonce", "integrity", "crossorigin"}:
                continue
            if key in {"src", "poster", "href", "xlink:href"} and tag != "link":
                if tag == "a":
                    continue
                if value and value.startswith("#"):
                    pass
                else:
                    value = self.resource(value or "")
                    if not value:
                        continue
            if key == "style":
                value = clean_css(value or "", self.mapping)
            if key in {"autoplay", "controls", "contenteditable", "tabindex"}:
                continue
            cleaned.append(" " + key + ("=\"" + html.escape(value, quote=True) + "\"" if value is not None else ""))
        if tag == "button":
            cleaned.append(' disabled aria-disabled="true"')
        self.output.append("<" + tag + "".join(cleaned) + ">")
        if tag == "head":
            self.output.append('<meta charset="utf-8">')

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if self.blocked:
            if tag in self.blocked:
                self.blocked = self.blocked[:self.blocked.index(tag)]
            return
        if tag not in BLOCKED and tag not in VOID:
            self.output.append("</" + tag + ">")

    def handle_data(self, data):
        if not self.blocked:
            self.output.append(html.escape(data))


def clean_css(css, mapping):
    css = re.sub(r"@import\s+(?:url\([^)]*\)|[^;]+);?", "", css, flags=re.I)

    def replace(match):
        value = match.group(1).strip(" \"'")
        if value.startswith("data:image/") or value.startswith("#"):
            return "url(" + value + ")"
        local = mapping.get(value) or mapping.get(urljoin(ORIGIN, value))
        return "url(" + (local or "data:,") + ")"

    return re.sub(r"url\(([^)]*)\)", replace, css, flags=re.I)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--assets", type=Path, default=ROOT.parent / "asset")
    args = parser.parse_args()
    archive = parts(args.assets / "Prim Eval.mhtml")
    destination = ROOT / "web/client/previews/prim-eval"
    destination.mkdir(parents=True, exist_ok=True)
    mapping = {}
    resources = []
    page = None
    for part in archive:
        location = part.get("Content-Location", "")
        if location == ORIGIN and part.get_content_type() == "text/html":
            page = decode(part)
        elif location.startswith(ORIGIN) and part.get_content_maintype() == "image" or location.startswith((ORIGIN, "cid:")) and part.get_content_type() == "text/css":
            extension = {"image/png": ".png", "image/jpeg": ".jpg", "text/css": ".css"}[part.get_content_type()]
            data = part.get_payload(decode=True)
            name = hashlib.sha256(data).hexdigest()[:16] + extension
            mapping[location] = name
            resources.append((part, name))
    if page is None:
        raise ValueError("Prim Eval main document missing")
    for part, name in resources:
        data = clean_css(decode(part), mapping).encode("utf-8") if name.endswith(".css") else part.get_payload(decode=True)
        (destination / name).write_bytes(data)
    snapshot = ReadOnlyHTML(mapping)
    snapshot.feed(page)
    exported = "<!DOCTYPE html>" + "".join(snapshot.output)
    if re.search(r'<(?:script|iframe)\b|\bon\w+=|\b(?:src|href)="(?:https?:|cid:|chrome-extension:)', exported, flags=re.I):
        raise ValueError("Unsafe reference remained in snapshot")
    (destination / "index.html").write_text(exported, encoding="utf-8")
    images = ROOT / "web/client/images"
    images.mkdir(parents=True, exist_ok=True)
    jira = parts(next(args.assets.glob("*TCLOUD-12853*.mhtml")))
    requested = {"image-2026-09-20-09-12-45-521.png": "eval-dashboard.png", "image-2026-09-20-09-48-59-254.png": "eval-scores.png"}
    for suffix, name in requested.items():
        part = next(p for p in jira if p.get("Content-Location", "").endswith(suffix))
        (images / name).write_bytes(part.get_payload(decode=True))
    print("Imported read-only Prim Eval interface and two Jira reference images.")


if __name__ == "__main__":
    main()
