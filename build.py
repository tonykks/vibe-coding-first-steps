"""강연 화면(index.html)과 스크립트 페이지(script-N.html) 조립 프로그램

  python build.py          src/ 조각을 모아 index.html과 script-*.html을 새로 만든다
  python build.py --check  만든 결과가 src/와 같은지 확인만 한다 (다르면 종료 코드 1)

고치는 곳
- 강연 화면 글: src/sections/NN-이름.html (파일 이름 순서대로 들어간다)
  · 부 머리:  <div class="part" id="p1"> <span class="tag">1부</span> <h2>제목</h2> ...
  · 장면:     <section class="scene" id="s1-1"> ... <h2>제목</h2> ...
  · 왼쪽 목차는 부 머리와 장면 제목에서 자동으로 만든다.
- 스크립트: src/scripts/script-N.html (첫 줄 <!-- title: 제목 | back: #p1 -->)
- 머리글·꼬리말: src/page.html, src/script-page.html, src/partials/
- 디자인: css/lecture.css (바로 반영된다)

index.html과 script-*.html은 조립 결과다. 직접 고치지 말고 src/를 고친 뒤 이 프로그램을 실행한다.
"""
import re, sys, html
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
NOTE = "<!-- 이 파일은 build.py가 src/에서 만듭니다. 직접 고치지 마세요. -->"


def read(p):
    return p.read_text(encoding="utf-8").replace("\r\n", "\n").rstrip("\n")


def includes(page):
    return re.sub(r"^[ \t]*<!-- @include (\S+) -->", lambda m: read(SRC / m.group(1)), page, flags=re.M)


def strip_tags(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def toc(body):
    out = []
    for m in re.finditer(r'<div class="part" id="([^"]+)">.*?<span class="tag">(.*?)</span>.*?<h2>(.*?)</h2>'
                         r'|<section class="scene" id="([^"]+)">.*?<h2>(.*?)</h2>', body, re.S):
        if m.group(1):
            out.append(f'      <a class="part-link" href="#{m.group(1)}">{strip_tags(m.group(2))} · {strip_tags(m.group(3))}</a>')
        else:
            out.append(f'      <a href="#{m.group(4)}">{strip_tags(m.group(5))}</a>')
    return "\n".join(out)


def finish(page):
    page = page.replace("<html lang=\"ko\">", f"<html lang=\"ko\">\n{NOTE}", 1)
    missing = re.findall(r"<!-- @\w+[^>]*-->", page)
    if missing:
        raise SystemExit(f"[중지] 처리하지 못한 표시: {missing}")
    return page + "\n"


def build():
    outs = {}
    page = includes(read(SRC / "page.html"))
    sections = sorted((SRC / "sections").glob("*.html"))
    body = "\n\n".join(read(p) for p in sections)
    page = re.sub(r"^[ \t]*<!-- @toc -->", lambda m: toc(body), page, flags=re.M)
    page = re.sub(r"^[ \t]*<!-- @sections -->", lambda m: body, page, flags=re.M)
    outs["index.html"] = finish(page)
    shell = includes(read(SRC / "script-page.html"))
    for p in sorted((SRC / "scripts").glob("*.html")):
        text = read(p)
        head = re.match(r"<!-- title: (.*?) \| back: (\S*) -->\n", text)
        if not head:
            raise SystemExit(f"[중지] {p.name} 첫 줄에 <!-- title: … | back: … --> 이 없습니다.")
        title, back = head.group(1), head.group(2)
        page = shell.replace("@title", title).replace("@back", back)
        page = re.sub(r"^[ \t]*<!-- @body -->", lambda m: text[head.end():], page, flags=re.M)
        outs[p.name] = finish(page)
    return outs, len(sections)


def main():
    outs, n = build()
    if "--check" in sys.argv:
        bad = [k for k, v in outs.items()
               if not (ROOT / k).exists() or (ROOT / k).read_text(encoding="utf-8").replace("\r\n", "\n") != v]
        print("모두 src/와 같습니다." if not bad else f"src/와 다릅니다: {bad} → python build.py를 실행하세요.")
        sys.exit(0 if not bad else 1)
    for k, v in outs.items():
        (ROOT / k).write_text(v, encoding="utf-8", newline="\n")
        print(f"만듦: {k} ({len(v.encode('utf-8')) // 1024} KB)")
    print(f"강연 화면 조각 {n}개")


if __name__ == "__main__":
    main()
