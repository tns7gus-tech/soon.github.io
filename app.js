const WORLD_SIZE = 1000;
const PLAYER_RADIUS = 24;
const MOVE_SPEED = 235;

const gameFrame = document.querySelector("#gameFrame");
const roomImage = document.querySelector("#roomImage");
const player = document.querySelector("#player");
const playerSprite = document.querySelector("#playerSprite");
const locationText = document.querySelector("#locationText");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const storyCard = document.querySelector("#storyCard");
const storyNumber = document.querySelector("#storyNumber");
const storyKicker = document.querySelector("#storyKicker");
const storyTitle = document.querySelector("#storyTitle");
const storyBody = document.querySelector("#storyBody");
const storyTags = document.querySelector("#storyTags");
const nearbyBubble = document.querySelector("#nearbyBubble");
const collectionGrid = document.querySelector("#collectionGrid");
const collectionEmpty = document.querySelector("#collectionEmpty");
const collectionCount = document.querySelector("#collectionCount");
const themeToggle = document.querySelector("#themeToggle");
const doorLabel = document.querySelector("#doorLabel");

const assets = window.PIXEL_ROOM_ASSETS;
if (!assets) {
  throw new Error("픽셀룸 이미지 데이터를 불러오지 못했습니다.");
}

const state = {
  x: 675,
  y: 923,
  direction: "up",
  moving: new Set(),
  visited: new Set(),
  activeStory: null,
  lastTimestamp: 0,
  exitShown: false,
};

const spriteByDirection = {
  up: assets.playerUp,
  down: assets.playerDown,
  left: assets.playerLeft,
  right: assets.playerRight,
};

const directionOffset = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

const stories = {
  computer: {
    number: "01",
    kicker: "컴퓨터 · 하는 일",
    title: "문제를 차분히 풀어가는 개발자",
    body: "공공기관 IT 시스템을 운영하고 개발해 온 권순현입니다. 복잡한 문제를 하나씩 정리해 안정적인 답을 만드는 일을 좋아하고, 사람을 대할 때도 같은 꾸준함을 지키려 합니다.",
    tags: ["Developer", "문제 해결", "꾸준함"],
    label: "컴퓨터 책상",
    marker: ".hotspot-computer",
    rect: { x1: 72, y1: 82, x2: 354, y2: 360 },
  },
  bookshelf: {
    number: "02",
    kicker: "책장 · 관심사",
    title: "새로운 것을 알아가는 재미",
    body: "AI와 기술, 경제 이야기부터 여행과 사람들의 삶까지 관심사가 넓습니다. 아는 척하기보다 궁금한 것을 함께 이야기하며 서로의 세계가 넓어지는 대화를 좋아합니다.",
    tags: ["AI & Tech", "경제", "여행"],
    label: "책장",
    marker: ".hotspot-bookshelf",
    rect: { x1: 376, y1: 76, x2: 590, y2: 326 },
  },
  bed: {
    number: "03",
    kicker: "침대 · 기본 프로필",
    title: "1995년생 권순현입니다",
    body: "대구에서 일하고 있는 32세 개발자입니다. 평소에는 차분한 편이지만 편해지면 장난도 잘 치고, 사소한 이야기도 오래 나누는 사람입니다.",
    tags: ["1995", "대구", "차분한 유머"],
    label: "침대",
    marker: ".hotspot-bed",
    rect: { x1: 704, y1: 92, x2: 902, y2: 465 },
  },
  table: {
    number: "04",
    kicker: "테이블 · 데이트",
    title: "걷고, 맛보고, 오래 이야기하기",
    body: "완벽하게 짜인 코스보다 함께 산책하고 맛있는 음식을 먹으며 자연스럽게 대화가 이어지는 시간을 좋아합니다. 편안한 하루가 좋은 추억이 된다고 믿어요.",
    tags: ["산책", "맛집", "편한 대화"],
    label: "작은 테이블",
    marker: ".hotspot-table",
    rect: { x1: 67, y1: 452, x2: 239, y2: 690 },
  },
  tea: {
    number: "05",
    kicker: "티 캐비닛 · 매력",
    title: "처음보다 두 번째가 더 재미있는 사람",
    body: "첫인상은 조용하고 신중해 보일 수 있지만, 가까워질수록 티키타카와 은근한 유머가 살아납니다. 말뿐 아니라 행동으로 배려하는 사람이 되고 싶습니다.",
    tags: ["배려", "티키타카", "진정성"],
    label: "티 캐비닛",
    marker: ".hotspot-tea",
    rect: { x1: 52, y1: 708, x2: 313, y2: 881 },
  },
  music: {
    number: "06",
    kicker: "음악 코너 · 한마디",
    title: "좋은 사람을 진심으로 알아가는 중",
    body: "빠르게 결론을 내리기보다 서로의 취향과 생각을 천천히 발견하는 관계를 기대합니다. 이 작은 방이 편안한 첫인사가 되었으면 좋겠습니다. 잘 부탁드립니다.",
    tags: ["진심", "천천히", "Next stage"],
    label: "음악 코너",
    marker: ".hotspot-music",
    rect: { x1: 704, y1: 627, x2: 931, y2: 884 },
  },
};

const extraObstacles = [
  { x1: 808, y1: 450, x2: 909, y2: 602 },
];

function isInsideRoom(x, y) {
  const mainRoom = x >= 66 && x <= 934 && y >= 69 && y <= 925;
  const doorway = x >= 661 && x <= 779 && y >= 905 && y <= 982;
  return mainRoom || doorway;
}

function pointHitsRect(x, y, rect, margin = PLAYER_RADIUS) {
  return (
    x > rect.x1 - margin &&
    x < rect.x2 + margin &&
    y > rect.y1 - margin &&
    y < rect.y2 + margin
  );
}

function isWalkable(x, y) {
  if (!isInsideRoom(x, y)) return false;

  const allObstacles = [
    ...Object.values(stories).map((story) => story.rect),
    ...extraObstacles,
  ];
  return !allObstacles.some((rect) => pointHitsRect(x, y, rect));
}

function distanceToRect(x, y, rect) {
  const dx = Math.max(rect.x1 - x, 0, x - rect.x2);
  const dy = Math.max(rect.y1 - y, 0, y - rect.y2);
  return Math.hypot(dx, dy);
}

function getNearbyStory() {
  let nearest = null;
  let nearestDistance = Infinity;

  Object.entries(stories).forEach(([id, story]) => {
    const distance = distanceToRect(state.x, state.y, story.rect);
    if (distance < nearestDistance) {
      nearest = id;
      nearestDistance = distance;
    }
  });

  return nearestDistance <= 68 ? nearest : null;
}

function updatePlayer() {
  player.style.left = `${(state.x / WORLD_SIZE) * 100}%`;
  player.style.top = `${(state.y / WORLD_SIZE) * 100}%`;

  const nextSource = spriteByDirection[state.direction];
  if (playerSprite.src !== nextSource) {
    playerSprite.src = nextSource;
  }

  player.classList.toggle("is-walking", state.moving.size > 0);
}

function setStory(id) {
  const story = stories[id];
  if (!story) return;

  const isFirstVisit = !state.visited.has(id);
  state.activeStory = id;
  state.visited.add(id);
  locationText.textContent = story.label;
  storyNumber.textContent = story.number;
  storyKicker.textContent = story.kicker;
  storyTitle.textContent = story.title;
  storyBody.textContent = story.body;
  storyTags.replaceChildren(
    ...story.tags.map((tag) => {
      const element = document.createElement("span");
      element.textContent = tag;
      return element;
    }),
  );

  storyCard.classList.remove("is-new");
  requestAnimationFrame(() => storyCard.classList.add("is-new"));

  if (isFirstVisit) {
    addCollectionItem(id, story);
    document.querySelector(story.marker)?.classList.add("is-visited");
  }

  updateProgress();
}

function addCollectionItem(id, story) {
  collectionEmpty?.remove();
  const article = document.createElement("article");
  article.className = "collection-item";
  article.dataset.story = id;

  const number = document.createElement("span");
  number.textContent = `STORY ${story.number}`;
  const title = document.createElement("h3");
  title.textContent = story.title;
  const body = document.createElement("p");
  body.textContent = story.body;
  article.append(number, title, body);
  collectionGrid.append(article);
}

function updateProgress() {
  const count = state.visited.size;
  progressText.textContent = `${count} / ${Object.keys(stories).length}`;
  progressBar.style.width = `${(count / Object.keys(stories).length) * 100}%`;
  collectionCount.textContent = `${count}개의 이야기를 발견했어요`;

  if (count === Object.keys(stories).length) {
    doorLabel.classList.add("is-ready");
    doorLabel.textContent = "EXIT OPEN";
  }
}

function showCompletion() {
  if (state.exitShown || state.visited.size !== Object.keys(stories).length) return;
  state.exitShown = true;
  locationText.textContent = "출구";
  storyNumber.textContent = "CLEAR";
  storyKicker.textContent = "모든 이야기 발견 완료";
  storyTitle.textContent = "제 방을 모두 둘러봐 주셨네요!";
  storyBody.textContent = "여섯 개의 이야기를 천천히 봐주셔서 감사합니다. 이제 화면 밖에서도 즐거운 대화를 이어갈 수 있으면 좋겠습니다.";
  storyTags.replaceChildren(...["Quest clear", "Thank you", "See you"].map((tag) => {
    const element = document.createElement("span");
    element.textContent = tag;
    return element;
  }));
  storyCard.classList.remove("is-new");
  requestAnimationFrame(() => storyCard.classList.add("is-new"));
}

function updateInteraction() {
  const nearbyId = getNearbyStory();

  if (nearbyId) {
    const story = stories[nearbyId];
    nearbyBubble.style.left = `${(state.x / WORLD_SIZE) * 100}%`;
    nearbyBubble.style.top = `${((state.y - 110) / WORLD_SIZE) * 100}%`;
    nearbyBubble.querySelector("span").textContent = state.visited.has(nearbyId)
      ? story.label
      : "새로운 이야기!";
    nearbyBubble.classList.add("is-visible");
    nearbyBubble.setAttribute("aria-hidden", "false");

    if (state.activeStory !== nearbyId) setStory(nearbyId);
  } else {
    nearbyBubble.classList.remove("is-visible");
    nearbyBubble.setAttribute("aria-hidden", "true");
    if (state.y > 920 && state.x > 655 && state.x < 785) {
      locationText.textContent = "방 입구";
      showCompletion();
    }
  }
}

function movementVector() {
  let dx = 0;
  let dy = 0;
  if (state.moving.has("left")) dx -= 1;
  if (state.moving.has("right")) dx += 1;
  if (state.moving.has("up")) dy -= 1;
  if (state.moving.has("down")) dy += 1;

  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }
  return { dx, dy };
}

function updateDirection(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) {
    state.direction = dx < 0 ? "left" : "right";
  } else if (dy !== 0) {
    state.direction = dy < 0 ? "up" : "down";
  }
}

function nudgePlayer(direction, distance = 18) {
  const offset = directionOffset[direction];
  if (!offset) return;

  updateDirection(offset.dx, offset.dy);
  const nextX = state.x + offset.dx * distance;
  const nextY = state.y + offset.dy * distance;
  if (isWalkable(nextX, state.y)) state.x = nextX;
  if (isWalkable(state.x, nextY)) state.y = nextY;
  updatePlayer();
  updateInteraction();
}

function gameLoop(timestamp) {
  const delta = Math.min((timestamp - state.lastTimestamp) / 1000, 0.05) || 0;
  state.lastTimestamp = timestamp;
  const { dx, dy } = movementVector();

  if (dx !== 0 || dy !== 0) {
    updateDirection(dx, dy);
    const step = MOVE_SPEED * delta;
    const nextX = state.x + dx * step;
    const nextY = state.y + dy * step;

    if (isWalkable(nextX, state.y)) state.x = nextX;
    if (isWalkable(state.x, nextY)) state.y = nextY;
    updatePlayer();
    updateInteraction();
  }

  requestAnimationFrame(gameLoop);
}

const keyDirections = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  s: "down",
  S: "down",
  a: "left",
  A: "left",
  d: "right",
  D: "right",
};

document.addEventListener("keydown", (event) => {
  const direction = keyDirections[event.key];
  if (!direction) return;
  event.preventDefault();
  if (!state.moving.has(direction)) nudgePlayer(direction);
  state.moving.add(direction);
  updatePlayer();
});

document.addEventListener("keyup", (event) => {
  const direction = keyDirections[event.key];
  if (!direction) return;
  state.moving.delete(direction);
  updatePlayer();
});

document.querySelectorAll("[data-direction]").forEach((button) => {
  const direction = button.dataset.direction;

  const start = (event) => {
    event.preventDefault();
    gameFrame.focus({ preventScroll: true });
    if (!state.moving.has(direction)) nudgePlayer(direction);
    state.moving.add(direction);
    button.classList.add("is-pressed");
    updatePlayer();
  };

  const stop = (event) => {
    event.preventDefault();
    state.moving.delete(direction);
    button.classList.remove("is-pressed");
    updatePlayer();
  };

  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", stop);
  button.addEventListener("pointercancel", stop);
  button.addEventListener("pointerleave", stop);
});

window.addEventListener("blur", () => {
  state.moving.clear();
  document.querySelectorAll(".is-pressed").forEach((button) => button.classList.remove("is-pressed"));
  updatePlayer();
});

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  themeToggle.querySelector("span").textContent = isDark ? "🌙" : "☀️";
  themeToggle.setAttribute("aria-label", isDark ? "어두운 화면으로 전환" : "밝은 화면으로 전환");
});

roomImage.src = assets.room;
updatePlayer();
updateProgress();
requestAnimationFrame(gameLoop);
