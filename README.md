# 바이브코딩의 첫걸음 — 강연 보충자료

「바이브코딩의 첫걸음: 나만의 코딩 에이전트 만들기」 강연의 웹 보충자료입니다.
GitHub Pages 주소에서 `index.html`을 엽니다. 별도 설치는 필요 없습니다.

## 첫 화면(index.html) 고치는 방법

`index.html`은 조립 결과입니다. 직접 고치지 말고 아래 조각을 고친 뒤 `python build.py`를 실행합니다.

| 고칠 것 | 파일 |
|---|---|
| 구역 글 | `src/sections/<부 폴더>/NN-이름.html` (폴더 → 앞 번호 순서대로 본문에 들어갑니다) |
| 부 머리말 | `src/sections/<부 폴더>/00-part.html` |
| 강연 흐름 길잡이 | `src/sections/00-hero.html` 아래쪽 `roadmap` |
| 왼쪽 목차 | `src/partials/sidebar.html` (구역을 더하거나 빼면 같이 고칩니다) |
| 머리글, CSS 연결 | `src/page.html` |
| 색, 글꼴 | `css/01-tokens.css` |
| 그 밖의 디자인 | `css/02-base.css` ~ `css/12-responsive.css` (조립 없이 바로 반영) |

```
python build.py          # src/ → index.html
python build.py --check  # index.html이 src/와 같은지 확인
```

강연 흐름 (4부)

| 부 | 폴더 | 구역 | 화면 녹화 연결 |
|---|---|---|---|
| PART 1 왜 — 웹에서 시작해 내 컴퓨터로 | `1-why/` | 01 question, 02 services, 03 ladder, 04 limits | 03에 관광대 ①②, 04에 한글타자연습앱 ①②③ |
| PART 2 어떻게 — 세 역할과 Harness | `2-how/` | 05 model, 06 vibe, 07 owner, 08 coding, 09 harness | 06에 요구사항 문서, 08에 Coding Agent 만들기, 09에 관광대 ③ |
| PART 3 실제로 — 사례와 화면 녹화 | `3-cases/` | 10 case(SkyView), 11 videos(사례 지도) | 11에 모든 영상과 연결 구역 |
| PART 4 그다음 — 안전하게 쓰고 지식 쌓기 | `4-next/` | 12 security, 13 knowledge | |

구역 안 "▶ 영상으로 보기" 상자는 `video-strip` 부품이고, 모양은 `css/13-story.css`에 있습니다.

## 하위 페이지 (주소를 바꾸지 않으려고 맨 위 폴더에 둡니다)
- `infographic-prompt.html` : 인포그래픽과 Prompt 전문 (11개 부분, 55개 문장 쌍)
- `requirements-dialogue.html` : 요구사항을 확정한 이틀의 대화 기록 (22개 사례와 자세히 읽기)
- `agent-collaboration.html` : 두 PC와 Claude 탭·Code 탭이 노션 게시판 하나로 협업한 기록 (그림은 `agent-collaboration.png`)
- `chat-to-ide.html` : 채팅에서 IDE로 옮길 때를 알리는 네 가지 신호와 사례
- `agent-collab-kit.html` : Agent 여러 개의 협업을 위한 Harness Kit 안내
- `harness-lecture.html` : Agent Collab Kit으로 보는 협업 흐름 전체(흐름도, 단계별 설명, Kit 원문)
- `harness-real-example.html` : Tony's Library를 만들 때 Agent들이 파일로 주고받은 실제 인계 문서 발췌
- `context-continuity.html` : 새 대화에서도 맥락이 이어지게 하는 방법 (화면 속 기관명은 가려 두었습니다)
- `guide-vibe-agent-claude.html`, `guide-vibe-agent-chatgpt.html` : Claude·ChatGPT를 Vibe Agent로 설정하는 가이드
- `saving-claude-usage.html`, `saving-chatgpt-usage.html` : 사용량 한도와 절약 습관 가이드
- `guide-openai.html`, `guide-google.html`, `guide-claude.html` : 세 회사 바이브코딩 사용설명서
- `concept-openai.jpg`, `concept-google.jpg`, `concept-claude.jpg` : 세 회사 서비스 개념도

## 화면 녹화 사례 (`videos/`)
- `videos/index.html` : 화면 녹화 사례 모음 (영상마다 "내 요구"와 "AI가 한 일")
- `videos/coding-agent-antigravity.html` : 나만의 Coding Agent 만들기 [Antigravity IDE 활용]
- `videos/typing-*.html`, `videos/typing-summary.html` : 한글타자연습앱 세 편과 요약
- `videos/jtu-*.html` : 관광대 강의 준비 ①②③
- `videos/docs/` : 영상에서 쓴 요구 사항 문서와 원본 앱

`videos/`는 다른 저장소(screen-autocut)의 `tools/build_page.py --out <이 저장소>/videos`로 만듭니다. 여기서 직접 고치면 다음 생성 때 덮어써집니다.
