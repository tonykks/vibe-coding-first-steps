"""보충자료 첫 화면(index.html) 조립 프로그램

  python build.py          src/ 조각을 모아 index.html을 새로 만든다
  python build.py --check  index.html이 src/와 같은지 확인만 한다 (다르면 종료 코드 1)

고치는 곳
- 글: src/sections/NN-이름.html (파일 이름 앞 번호 순서대로 본문에 들어간다)
- 왼쪽 목차: src/partials/sidebar.html (구역을 더하거나 빼면 목차도 같이 고친다)
- 머리글·CSS 연결: src/page.html
- 디자인: css/*.css (index.html이 바로 읽으므로 조립하지 않아도 바로 반영된다)

index.html은 조립 결과다. 직접 고치지 말고 src/를 고친 뒤 이 프로그램을 실행한다.
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"
NOTE = "<!-- 이 파일은 build.py가 src/에서 만듭니다. 직접 고치지 마세요. -->"


def read(p):
    return p.read_text(encoding="utf-8").replace("\r\n", "\n").rstrip("\n")


def build():
    page = read(SRC / "page.html")
    page = re.sub(r"^[ \t]*<!-- @include (\S+) -->", lambda m: read(SRC / m.group(1)), page, flags=re.M)
    sections = sorted((SRC / "sections").glob("*.html"))
    body = "\n\n".join(read(p) for p in sections)
    page = re.sub(r"^[ \t]*<!-- @sections -->", lambda m: body, page, flags=re.M)
    page = page.replace("<html lang=\"ko\">", f"<html lang=\"ko\">\n{NOTE}", 1)
    missing = re.findall(r"<!-- @\w+[^>]*-->", page)
    if missing:
        raise SystemExit(f"[중지] 처리하지 못한 표시: {missing}")
    return page + "\n", len(sections)


def main():
    html, n = build()
    if "--check" in sys.argv:
        same = OUT.exists() and OUT.read_text(encoding="utf-8").replace("\r\n", "\n") == html
        print("index.html이 src/와 같습니다." if same else "index.html이 src/와 다릅니다. python build.py를 실행하세요.")
        sys.exit(0 if same else 1)
    OUT.write_text(html, encoding="utf-8", newline="\n")
    print(f"만듦: index.html (구역 {n}개, {len(html.encode('utf-8')) // 1024} KB)")


if __name__ == "__main__":
    main()
