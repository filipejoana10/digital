import os
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

BASE_URL = "https://www.hegodigital.online"
EXCLUDE_DIRS = {".git", ".venv", "node_modules", "sitemaps"}
EXCLUDE_FILES = {"generate_sitemap.py"}


def is_html_file(filename: str) -> bool:
    return filename.lower().endswith(".html")


def build_url(root: str, file_path: str) -> str:
    relative_path = os.path.relpath(file_path, root).replace("\\", "/")
    if relative_path == "index.html":
        return BASE_URL + "/"
    return f"{BASE_URL}/{relative_path}"


def get_lastmod(file_path: str) -> str:
    timestamp = os.path.getmtime(file_path)
    return datetime.utcfromtimestamp(timestamp).strftime("%Y-%m-%d")


def generate_sitemap(project_root: str) -> str:
    urlset = Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    for dirpath, dirnames, filenames in os.walk(project_root):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for filename in filenames:
            if filename in EXCLUDE_FILES:
                continue
            if not is_html_file(filename):
                continue
            file_path = os.path.join(dirpath, filename)
            url = build_url(project_root, file_path)
            url_element = SubElement(urlset, "url")
            SubElement(url_element, "loc").text = url
            SubElement(url_element, "lastmod").text = get_lastmod(file_path)
            SubElement(url_element, "changefreq").text = "weekly"
            SubElement(url_element, "priority").text = "1.0" if url.endswith("/") else "0.8"

    raw_xml = tostring(urlset, encoding="utf-8")
    parsed = minidom.parseString(raw_xml)
    pretty_xml = parsed.toprettyxml(indent="  ", encoding="utf-8")
    return pretty_xml.decode("utf-8")


def main() -> None:
    project_root = os.path.dirname(os.path.abspath(__file__))
    sitemap_content = generate_sitemap(project_root)
    sitemap_path = os.path.join(project_root, "sitemap.xml")
    with open(sitemap_path, "w", encoding="utf-8") as sitemap_file:
        sitemap_file.write(sitemap_content)
    print(f"Sitemap gerado em: {sitemap_path}")


if __name__ == "__main__":
    main()
