const mapElement = document.querySelector("#map");
const playerElement = document.querySelector("#player");
const roomStatusElement = document.querySelector("#roomStatus");
const cardKickerElement = document.querySelector("#cardKicker");
const cardTitleElement = document.querySelector("#cardTitle");
const cardBodyElement = document.querySelector("#cardBody");
const profileTagsElement = document.querySelector("#profileTags");
const themeToggleElement = document.querySelector("#themeToggle");
const languageButtons = document.querySelectorAll("[data-lang]");
const controlButtons = document.querySelectorAll("[data-move]");

const grid = {
  width: 3,
  height: 5,
  blocked: new Set(["0,1", "2,1", "0,3", "2,3"]),
};

const state = {
  x: 1,
  y: 2,
  lang: "ko",
};

const translations = {
  ko: {
    eyebrow: "연애프로그램 자기소개 퀘스트",
    title: "권순현의 작은 모험",
    statusLabel: "현재 위치",
    hint: "방향키/WASD 또는 터치 버튼으로 이동",
    roomName: "이름",
    roomAge: "나이",
    roomJob: "직업",
    roomCharm: "매력",
    roomDate: "데이트",
    roomFinal: "한마디",
    rooms: {
      plaza: {
        kicker: "중앙 광장",
        title: "방을 선택해 주세요",
        body: "캐릭터를 움직여 A방과 B방에 들어가면 소개 카드가 바뀝니다.",
        tags: ["Developer", "1995", "Quest"],
      },
      name: {
        kicker: "A방 | 이름",
        title: "권순현입니다",
        body: "첫인사는 짧고 정확하게. 버그는 고치고, 마음은 천천히 알아가겠습니다.",
        tags: ["이름", "권순현", "첫인상"],
      },
      age: {
        kicker: "B방 | 나이",
        title: "95년생, 32세",
        body: "숫자로는 32세, 마음가짐은 새로운 기능 배포 전날처럼 설레는 사람입니다.",
        tags: ["1995", "32세", "설렘"],
      },
      job: {
        kicker: "C방 | 직업",
        title: "개발자",
        body: "문제를 작게 쪼개고, 좋은 답을 오래 유지되게 만드는 일을 합니다.",
        tags: ["Developer", "문제해결", "꾸준함"],
      },
      charm: {
        kicker: "D방 | 매력",
        title: "차분하지만 재밌게",
        body: "처음엔 조용해 보여도, 친해지면 의외로 티키타카가 잘 되는 편입니다.",
        tags: ["차분함", "유머", "대화"],
      },
      date: {
        kicker: "E방 | 데이트",
        title: "산책과 맛집",
        body: "복잡한 코스보다 편하게 걷고 맛있는 걸 먹으면서 오래 이야기하는 시간을 좋아합니다.",
        tags: ["산책", "맛집", "대화"],
      },
      final: {
        kicker: "F방 | 한마디",
        title: "잘 부탁드립니다",
        body: "오늘의 퀘스트는 좋은 사람을 진심으로 알아가는 것입니다.",
        tags: ["진심", "소개 완료", "Next Stage"],
      },
    },
  },
  en: {
    eyebrow: "Dating Show Intro Quest",
    title: "Soonhyun Kwon's Mini Adventure",
    statusLabel: "Current room",
    hint: "Move with arrow keys, WASD, or touch buttons",
    roomName: "Name",
    roomAge: "Age",
    roomJob: "Job",
    roomCharm: "Charm",
    roomDate: "Date",
    roomFinal: "Closing",
    rooms: {
      plaza: {
        kicker: "Central Plaza",
        title: "Choose a room",
        body: "Move into each room and the profile card will update.",
        tags: ["Developer", "1995", "Quest"],
      },
      name: {
        kicker: "Room A | Name",
        title: "I'm Soonhyun Kwon",
        body: "A short and clear first hello. I fix bugs carefully and get to know people sincerely.",
        tags: ["Name", "Soonhyun Kwon", "First impression"],
      },
      age: {
        kicker: "Room B | Age",
        title: "Born in 1995, age 32",
        body: "Thirty-two by number, still excited like the night before shipping a new feature.",
        tags: ["1995", "Age 32", "Excited"],
      },
      job: {
        kicker: "Room C | Job",
        title: "Developer",
        body: "I break problems down and build answers that can last.",
        tags: ["Developer", "Problem solving", "Steady"],
      },
      charm: {
        kicker: "Room D | Charm",
        title: "Calm, then funny",
        body: "I may seem quiet at first, but I enjoy a good back-and-forth once we get close.",
        tags: ["Calm", "Humor", "Conversation"],
      },
      date: {
        kicker: "Room E | Date",
        title: "Walks and good food",
        body: "I like relaxed walks, good restaurants, and conversations that keep going naturally.",
        tags: ["Walk", "Food", "Talk"],
      },
      final: {
        kicker: "Room F | Closing",
        title: "Nice to meet you",
        body: "Today's quest is to get to know a good person with sincerity.",
        tags: ["Sincere", "Complete", "Next Stage"],
      },
    },
  },
  ja: {
    eyebrow: "恋愛番組 自己紹介クエスト",
    title: "クォン・スンヒョンの小さな冒険",
    statusLabel: "現在地",
    hint: "矢印キー、WASD、またはタッチボタンで移動",
    roomName: "名前",
    roomAge: "年齢",
    roomJob: "職業",
    roomCharm: "魅力",
    roomDate: "デート",
    roomFinal: "一言",
    rooms: {
      plaza: {
        kicker: "中央広場",
        title: "部屋を選んでください",
        body: "キャラクターを動かして部屋に入ると、紹介カードが変わります。",
        tags: ["Developer", "1995", "Quest"],
      },
      name: {
        kicker: "A部屋 | 名前",
        title: "クォン・スンヒョンです",
        body: "最初の挨拶は短く正確に。バグは丁寧に直し、人のことはゆっくり知っていきます。",
        tags: ["名前", "クォン・スンヒョン", "第一印象"],
      },
      age: {
        kicker: "B部屋 | 年齢",
        title: "1995年生まれ、32歳",
        body: "数字では32歳、新機能を出す前日のようにまだワクワクしています。",
        tags: ["1995", "32歳", "期待"],
      },
      job: {
        kicker: "C部屋 | 職業",
        title: "開発者",
        body: "問題を小さく分け、長く使える答えを作る仕事をしています。",
        tags: ["Developer", "問題解決", "継続"],
      },
      charm: {
        kicker: "D部屋 | 魅力",
        title: "落ち着いていて、少し面白い",
        body: "最初は静かに見えても、親しくなると会話のテンポを楽しむタイプです。",
        tags: ["落ち着き", "ユーモア", "会話"],
      },
      date: {
        kicker: "E部屋 | デート",
        title: "散歩とおいしいご飯",
        body: "複雑なコースより、歩いて食べて自然に話せる時間が好きです。",
        tags: ["散歩", "グルメ", "会話"],
      },
      final: {
        kicker: "F部屋 | 一言",
        title: "よろしくお願いします",
        body: "今日のクエストは、素敵な人を誠実に知ることです。",
        tags: ["誠実", "紹介完了", "Next Stage"],
      },
    },
  },
};

const roomByPosition = {
  "0,0": "name",
  "2,0": "age",
  "0,2": "job",
  "1,2": "plaza",
  "2,2": "charm",
  "0,4": "date",
  "2,4": "final",
};

const movement = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const keyToMove = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
};

function getRoomContent() {
  const roomId = roomByPosition[`${state.x},${state.y}`] || "plaza";
  return translations[state.lang].rooms[roomId];
}

function updateText() {
  const dictionary = translations[state.lang];

  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = dictionary[key];
  });

  updateProfile();
}

function updateProfile() {
  const content = getRoomContent();
  roomStatusElement.textContent = content.kicker;
  cardKickerElement.textContent = content.kicker;
  cardTitleElement.textContent = content.title;
  cardBodyElement.textContent = content.body;
  profileTagsElement.replaceChildren(
    ...content.tags.map((tag) => {
      const tagElement = document.createElement("span");
      tagElement.textContent = tag;
      return tagElement;
    }),
  );
}

function updatePlayerPosition() {
  playerElement.style.setProperty("--x", state.x);
  playerElement.style.setProperty("--y", state.y);
  playerElement.classList.remove("is-walking");
  window.requestAnimationFrame(() => {
    playerElement.classList.add("is-walking");
  });
}

function isValidPosition(x, y) {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
    return false;
  }

  return !grid.blocked.has(`${x},${y}`);
}

function movePlayer(direction) {
  const offset = movement[direction];

  if (!offset) {
    return;
  }

  const [dx, dy] = offset;
  const nextX = state.x + dx;
  const nextY = state.y + dy;

  if (!isValidPosition(nextX, nextY)) {
    return;
  }

  state.x = nextX;
  state.y = nextY;
  updatePlayerPosition();
  updateProfile();
}

function setLanguage(lang) {
  if (!translations[lang]) {
    return;
  }

  state.lang = lang;
  languageButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === lang);
  });
  updateText();
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
}

document.addEventListener("keydown", (event) => {
  const direction = keyToMove[event.key];

  if (!direction) {
    return;
  }

  event.preventDefault();
  movePlayer(direction);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    mapElement.focus();
    movePlayer(button.dataset.move);
  });
});

themeToggleElement.addEventListener("click", toggleTheme);

updatePlayerPosition();
updateText();
