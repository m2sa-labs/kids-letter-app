let selectedRecipient = "";
let selectedPaper = "";
let letterText = "";
let openedLetterIndex = null;
let newRecipientName = "";
let newRecipientIcon = "";
const recipientIcons = ["🌸", "⭐", "💖", "🎀", "🧸", "🌼", "🍓", "🌈"];
const recipients = [
  { name: "まま", icon: "🌸" },
  { name: "ぱぱ", icon: "⭐" }
];

const papers = [
  { id: "rainbow", img: "assets/paper_rainbow.png" },
  { id: "heart", img: "assets/paper_heart.png" },
  { id: "ribbon", img: "assets/paper_ribbon.png" },
  { id: "cat", img: "assets/paper_cat.png" },
  { id: "music", img: "assets/paper_music.png" },
  { id: "flower", img: "assets/paper_flower.png" }
];

const hiraList = [
  "あ","い","う","え","お",
  "か","き","く","け","こ",
  "さ","し","す","せ","そ",
  "た","ち","つ","て","と",
  "な","に","ぬ","ね","の",
  "は","ひ","ふ","へ","ほ",
  "ま","み","む","め","も",
  "や","ゆ","よ","","",
  "ら","り","る","れ","ろ",
  "わ","を","ん","ー"," ",
  "っ","ゃ","ゅ","ょ","゛",
  "゜","NEWLINE","","",""
];

const stamps = [
  { id: "heart", src: "assets/assetsstamp_heart.png", alt: "はーと" },
  { id: "star", src: "assets/assetsstamp_star.png", alt: "ほし" },
  { id: "flower", src: "assets/assetsstamp_flower.png", alt: "はな" },
  { id: "ribbon", src: "assets/assetsstamp_ribbon.png", alt: "りぼん" },
  { id: "strawberry", src: "assets/assetsstamp_strawberry.png", alt: "いちご" },
  { id: "rainbow", src: "assets/assetsstamp_rainbow.png", alt: "にじ" }
];

function scrollToTop() {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  const shell = document.querySelector(".app-shell");
  if (shell) shell.scrollTop = 0;
}

function renderStampButtons() {
  const area = document.getElementById("stampArea");
  if (!area) return;

  area.innerHTML = "";

  stamps.forEach(stamp => {
    const img = document.createElement("img");
    img.src = stamp.src;
    img.alt = stamp.alt;
    img.className = "stamp-btn-img";
    img.onclick = () => addStamp(stamp.id);
    area.appendChild(img);
  });
}

function addStamp(id) {
  const stampText = `[${id}]`;
  letterText += stampText;
  updateLetterPreview();

  requestAnimationFrame(() => {
    const preview = document.getElementById("letterPreview");
    const paper = document.getElementById("selectedPaperPreview");

    if (!preview || !paper) return;

    const previewRect = preview.getBoundingClientRect();
    const paperRect = paper.getBoundingClientRect();

    if (previewRect.bottom > paperRect.bottom - 36) {
      letterText = letterText.slice(0, -stampText.length);
      updateLetterPreview();
    }
  });
}

function renderStampPreview() {
  // 今はインライン表示方式なので空でもOK
}

function saveLetter() {
  const letter = {
    to: selectedRecipient + "へ",
    date: new Date().toLocaleDateString("ja-JP"),
    text: letterText,
    paperId: selectedPaper,
    read: false,
    replyStamp: ""
  };

  let saved = JSON.parse(localStorage.getItem("letters") || "[]");
  saved.unshift(letter);
  localStorage.setItem("letters", JSON.stringify(saved));
}

function goScreen(num) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById("screen" + num);
  if (target) {
    target.classList.add("active");
  }

  if (num === 4) {
    updateLetterPreview();
  }

  if (num === 5) {
    updateFinalPreview();
  }

  if (num === 6) {
    renderLetterList();
  }

  scrollToTop();
}

function renderRecipients() {
  const grid = document.getElementById("recipientGrid");
  if (!grid) return;

  grid.innerHTML = "";

  recipients.forEach(recipient => {
    const btn = document.createElement("button");
    btn.className = "recipient-btn";
    btn.onclick = function () {
      selectRecipient(recipient.name);
    };

    btn.innerHTML =
      '<div class="recipient-face">' + recipient.icon + '</div>' +
      '<div class="recipient-name">' + recipient.name + '</div>';

    grid.appendChild(btn);
  });
}

function selectRecipient(name) {
  selectedRecipient = name;
  goScreen(3);
}

function addRecipient() {
  newRecipientName = "";
  newRecipientIcon = "";
  goScreen(7);

  const input = document.getElementById("newRecipientName");
  if (input) {
    input.value = "";
  }

  renderRecipientIconOptions();
}

function renderPapers() {
  const grid = document.getElementById("paperGrid");
  if (!grid) return;

  grid.innerHTML = "";

  papers.forEach(paper => {
    const img = document.createElement("img");
    img.src = paper.img;
    img.className = "paper-card";

    img.onclick = function () {
      selectPaper(paper.id);
    };

    grid.appendChild(img);
  });
}

function selectPaper(paperId) {
  selectedPaper = paperId;
  goScreen(4);
}

function renderHiragana() {
  const area = document.getElementById("hiraganaArea");
  if (!area) return;

  area.innerHTML = "";

  hiraList.forEach(char => {
    if (char === "") {
      const empty = document.createElement("div");
      empty.className = "hira-empty";
      area.appendChild(empty);
      return;
    }
    if (char === "NEWLINE") {
  const btn = document.createElement("button");
  btn.className = "hira-btn new-line-btn";
  btn.innerHTML = "した";
  btn.onclick = function () {
    addNewLine();
  };
  area.appendChild(btn);
  return;
}

    const btn = document.createElement("button");
    btn.className = "hira-btn";
    btn.textContent = char === " " ? "␣" : char;

    if (["っ","ゃ","ゅ","ょ","゛","゜"].includes(char)) {
      btn.classList.add("small-hira");
    }

    btn.onclick = function () {
      addChar(char);
    };

    area.appendChild(btn);
  });
}

function addChar(char) {
  const beforeText = letterText;

  // 濁点
  if (char === "゛") {
    letterText = letterText.replace(/か$/, "が")
      .replace(/き$/, "ぎ")
      .replace(/く$/, "ぐ")
      .replace(/け$/, "げ")
      .replace(/こ$/, "ご")
      .replace(/さ$/, "ざ")
      .replace(/し$/, "じ")
      .replace(/す$/, "ず")
      .replace(/せ$/, "ぜ")
      .replace(/そ$/, "ぞ")
      .replace(/た$/, "だ")
      .replace(/ち$/, "ぢ")
      .replace(/つ$/, "づ")
      .replace(/て$/, "で")
      .replace(/と$/, "ど")
      .replace(/は$/, "ば")
      .replace(/ひ$/, "び")
      .replace(/ふ$/, "ぶ")
      .replace(/へ$/, "べ")
      .replace(/ほ$/, "ぼ");
  }

  // 半濁点
  else if (char === "゜") {
    letterText = letterText.replace(/は$/, "ぱ")
      .replace(/ひ$/, "ぴ")
      .replace(/ふ$/, "ぷ")
      .replace(/へ$/, "ぺ")
      .replace(/ほ$/, "ぽ");
  }

  else {
    letterText += char;
  }

  updateLetterPreview();

  requestAnimationFrame(() => {
    const preview = document.getElementById("letterPreview");
    const paper = document.getElementById("selectedPaperPreview");

    if (!preview || !paper) return;

    const previewRect = preview.getBoundingClientRect();
    const paperRect = paper.getBoundingClientRect();

    if (previewRect.bottom > paperRect.bottom - 36) {
      letterText = beforeText;
      updateLetterPreview();
      return;
    }

    // 実際に追加・変換された最後の1文字をポン表示
    if (letterText !== beforeText && letterText.length > 0) {
      showBigChar(letterText.slice(-1));
    }
  });
}
function showBigChar(char){

  const el = document.getElementById("bigChar");

  el.textContent = char;

  el.classList.remove("bigChar-show");

  void el.offsetWidth;

  el.classList.add("bigChar-show");

}
function addNewLine() {
  letterText += "\n";
  updateLetterPreview();

  requestAnimationFrame(() => {
    const preview = document.getElementById("letterPreview");
    const paper = document.getElementById("selectedPaperPreview");

    if (!preview || !paper) return;

    const previewRect = preview.getBoundingClientRect();
    const paperRect = paper.getBoundingClientRect();

    if (previewRect.bottom > paperRect.bottom - 36) {
      letterText = letterText.slice(0, -1);
      updateLetterPreview();
    }
  });
}
function deleteOne() {
  const stampMatch = letterText.match(/\[(heart|star|flower|ribbon|strawberry|rainbow)\]$/);

  if (stampMatch) {
    letterText = letterText.replace(/\[(heart|star|flower|ribbon|strawberry|rainbow)\]$/, "");
  } else {
    letterText = letterText.slice(0, -1);
  }

  updateLetterPreview();
}

function deleteAll() {
  letterText = "";
  updateLetterPreview();
}

function buildLetterText() {
  const toText = selectedRecipient ? selectedRecipient + "へ" : "だれかへ";
 return toText + "\n" + letterText;
}

function convertTextWithStamps(text) {
  text = text
    .replace(/\[heart\]/g, "①")
    .replace(/\[star\]/g, "②")
    .replace(/\[flower\]/g, "③")
    .replace(/\[ribbon\]/g, "④")
    .replace(/\[strawberry\]/g, "⑤")
    .replace(/\[rainbow\]/g, "⑥");

  const isSmallScreen = window.innerWidth < 500;
const charsPerLine = isSmallScreen ? 7 : 9;

text = text
  .split("\n")
  .map(line => line.match(new RegExp(`.{1,${charsPerLine}}`, "g"))?.join("\n") || "")
  .join("\n");

  return text
    .replace(/①/g, '<img src="assets/assetsstamp_heart.png" class="inline-stamp">')
    .replace(/②/g, '<img src="assets/assetsstamp_star.png" class="inline-stamp">')
    .replace(/③/g, '<img src="assets/assetsstamp_flower.png" class="inline-stamp">')
    .replace(/④/g, '<img src="assets/assetsstamp_ribbon.png" class="inline-stamp">')
    .replace(/⑤/g, '<img src="assets/assetsstamp_strawberry.png" class="inline-stamp">')
    .replace(/⑥/g, '<img src="assets/assetsstamp_rainbow.png" class="inline-stamp">')
    .replace(/\n/g, "<br>");
}
function backToPaperSelect() {
  goScreen(3);
}
function updateLetterPreview() {
  const preview = document.getElementById("letterPreview");
  if (!preview) return;

  preview.innerHTML = convertTextWithStamps(buildLetterText());
  applyPaperClass("selectedPaperPreview", selectedPaper);
}

function updateFinalPreview() {
  const preview = document.getElementById("finalLetterPreview");
  if (!preview) return;

  preview.innerHTML = convertTextWithStamps(buildLetterText());
  applyPaperClass("finalPaperPreview", selectedPaper);
}

function goToCheck() {
  updateFinalPreview();
  goScreen(5);
}

function sendLetter() {
  saveLetter();

  selectedRecipient = "";
  selectedPaper = "";
  letterText = "";

  goScreen(1);
}

function renderLetterList() {
  const list = document.querySelector(".letter-list");
  if (!list) return;

  let saved = JSON.parse(localStorage.getItem("letters") || "[]");
  list.innerHTML = "";

  if (saved.length === 0) {
    list.innerHTML = '<div class="empty-message">まだ おてがみは ないよ</div>';
    return;
  }

  saved.forEach((letter, index) => {
    const item = document.createElement("div");
    item.className = "letter-item";

    item.innerHTML =
  '<input type="checkbox" class="letter-check" data-index="' + index + '">' +
  '<span class="letter-icon">' + (letter.read ? "" : "🌟") + '</span>' +
  '<span class="letter-name">' + letter.to + '</span>' +
  '<span class="letter-date">' + letter.date + '</span>';
    item.onclick = function(e) {
      if (e.target.type !== "checkbox") {
        openSavedLetter(index);
      }
    };

    list.appendChild(item);
  });
}

function cleanupLetters() {
  let saved = JSON.parse(localStorage.getItem("letters") || "[]");
  const checks = document.querySelectorAll(".letter-check:checked");

  if (checks.length === 0) {
    alert("おてがみを えらんでね");
    return;
  }

  const indexes = [...checks].map(c => Number(c.dataset.index));
  saved = saved.filter((_, i) => !indexes.includes(i));

  localStorage.setItem("letters", JSON.stringify(saved));
  renderLetterList();
}

function openSavedLetter(index) {
  let saved = JSON.parse(localStorage.getItem("letters") || "[]");
  const letter = saved[index];
  if (!letter) return;

  openedLetterIndex = index;

  letter.read = true;
  saved[index] = letter;
  localStorage.setItem("letters", JSON.stringify(saved));

  const content = document.getElementById("letterContent");
  if (content) {
    content.innerHTML = convertTextWithStamps(
      letter.to + "\n\n" + letter.text
    );
  }

  applyPaperClassToReadScreen(letter.paperId);

  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("read-letter").classList.add("active");

  scrollToTop();
}

function applyPaperImage(elementId, paperId, isLarge = false) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.className = isLarge ? "paper-preview large" : "paper-preview";

  const paper = papers.find(p => p.id === paperId);

  if (paper) {
    el.style.backgroundImage = `url("${paper.img}")`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
  } else {
    el.style.backgroundImage = "";
    el.style.backgroundSize = "";
    el.style.backgroundPosition = "";
    el.style.backgroundRepeat = "";
  }
}
function addReplyStamp(type) {
  let saved = JSON.parse(localStorage.getItem("letters") || "[]");

  if (openedLetterIndex === null || !saved[openedLetterIndex]) return;

  saved[openedLetterIndex].replyStamp = type;
  localStorage.setItem("letters", JSON.stringify(saved));

  openSavedLetter(openedLetterIndex);
}
function applyPaperClass(elementId, paperId) {
  let imgId = "";

  if (elementId === "selectedPaperPreview") imgId = "selectedPaperImg";
  if (elementId === "finalPaperPreview") imgId = "finalPaperImg";

  const img = document.getElementById(imgId);
  if (!img) return;

  const paper = papers.find(p => p.id === paperId);

  if (paper) {
    img.src = paper.img;
    img.style.display = "block";
  } else {
    img.src = "";
    img.style.display = "none";
  }
}

function applyPaperClassToReadScreen(paperId) {
  const img = document.getElementById("readPaperImg");
  if (!img) return;

  const paper = papers.find(p => p.id === paperId);

  if (paper) {
    img.src = paper.img;
    img.style.display = "block";
  } else {
    img.src = "";
    img.style.display = "none";
  }
}

function goHome() {
  goScreen(1);
}
function renderRecipientIconOptions() {
  const area = document.getElementById("iconChoiceArea");
  if (!area) return;

  area.innerHTML = "";

  recipientIcons.forEach(icon => {
    const btn = document.createElement("button");
    btn.className = "icon-choice-btn";
    btn.textContent = icon;

    btn.onclick = function() {
      newRecipientIcon = icon;

      document.querySelectorAll(".icon-choice-btn").forEach(el => {
        el.classList.remove("selected");
      });

      btn.classList.add("selected");
    };

    area.appendChild(btn);
  });
}

function saveNewRecipient() {
  const input = document.getElementById("newRecipientName");
  if (!input) return;

  const cleanName = input.value.trim();

  if (!cleanName) {
    alert("なまえを いれてね");
    return;
  }

  if (!newRecipientIcon) {
    alert("アイコンを えらんでね");
    return;
  }

  recipients.push({
    name: cleanName,
    icon: newRecipientIcon
  });

  renderRecipients();
  goScreen(2);
}

function backToRecipientList() {
  goScreen(2);
}
renderRecipients();
renderPapers();
renderHiragana();
renderStampButtons();
renderStampPreview();