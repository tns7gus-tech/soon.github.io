# 작업일지

## 테스트

- `node --check app.js` 통과
- 시작 지점에서 모든 방(`name`, `age`, `job`, `plaza`, `charm`, `date`, `final`) 도달 가능성 검사 통과
- 정적 HTML/CSS/JS 구조라 별도 빌드 단계 없음
- Browser 도구는 `sandboxCwd must use the file URI scheme` 오류로 자동 렌더링 검증을 완료하지 못함

## 점수평가

- 구현 속도: 9/10
- 모바일 반응형: 8/10
- 접근성: 8/10
- 유지보수성: 8/10
- 방송용 임팩트: 7/10

## 작업 내용

- `index.html`: 레트로 RPG 스타일 자기소개 화면 구성
- `styles.css`: 모바일 우선 반응형, 다크/라이트 테마, 픽셀 캐릭터/방 UI 스타일링
- `app.js`: 키보드, WASD, 터치 버튼 이동과 방별 소개 카드 갱신 로직 구현
- `.github/workflows/pages.yml`: GitHub Pages 정적 사이트 자동 배포 워크플로 추가
- `.nojekyll`: GitHub Pages에서 정적 파일을 그대로 배포하도록 설정

## Reasoning Summary

- 빠른 시연이 목적이므로 빌드 도구 없이 브라우저에서 바로 열 수 있는 정적 페이지로 작성했다.
- 이름과 나이 방은 요청 정보를 그대로 넣고, 나머지 방은 추후 촬영 콘셉트에 맞춰 교체하기 쉬운 데이터 구조로 분리했다.
- 실제 포켓몬 IP를 직접 사용하지 않고 레트로 RPG풍으로 구현해 저작권 리스크를 줄였다.

## Evaluation

- 장점: 설치 없이 실행 가능하고, 방별 콘텐츠 확장이 쉽다.
- 보완점: 실제 발표용으로는 본인 사진/도트 아바타, 사운드, 더 많은 스토리 방을 추가하면 효과가 커진다.

## PM Review

- MVP 기준 충족: 캐릭터 이동, 방 전환, 자기소개 정보 노출 완료
- 다음 우선순위: 소개 문구 확정, 디자인 톤 조정, 방송 리허설용 전체화면 모드 추가

## Deployment

- 대상 저장소: `tns7gus-tech/soon`
- 실제 GitHub canonical 저장소: `tns7gus-tech/soon.github.io`
- 배포 방식: GitHub Actions 기반 GitHub Pages
- 배포 URL: `https://tns7gus-tech.github.io/soon.github.io/`
- 배포 검증: HTML, `styles.css`, `app.js` 모두 200 OK 확인
