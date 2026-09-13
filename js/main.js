const header = document.querySelector(".site-header");
const year = document.querySelector("#current-year");
const revealItems = document.querySelectorAll(".reveal");
const languageButtons = document.querySelectorAll(".language-button");

const translations = {
  en: {
    pageTitle: "Jurina's Homepage",
    brand: "Jurina's Homepage",
    navAbout: "About",
    navInterests: "Interests",
    navMusic: "Music",
    heroEyebrow: "Thanks for finding me.",
    heroTitle: "Nice to meet you.<br><span>I'm Jurina.</span>",
    heroLead: "My interests are all over the place, from Japanese music to virtual skies and video games. Hope you're doing great.",
    pronouns: "She/Her or They/Them",
    avatarLabel: "My avatar",
    avatarFrom: "From BanG Dream! Ave Mujica",
    interestsEyebrow: "A few things I love",
    interestsTitle: "A few things<br>I'm into.",
    musicKicker: "Now playing",
    musicTitle: "J-Tracks, always.",
    musicBody: "I'm especially into J-Pop. My all-time favorite singer is <a href=\"https://www.universal-music.co.jp/yuika/\" target=\"_blank\" rel=\"noopener noreferrer\">Yuika ↗</a>.",
    flightKicker: "Virtual aviation",
    flightTitle: "Cleared for takeoff.",
    flightBody: "I'm a C1-rated controller in VATUSA, and I also fly on VATSIM and IVAO with Microsoft Flight Simulator and X-Plane. Airliners and business jets are my favorites.",
    gamesKicker: "Gaming",
    gamesTitle: "One more match.",
    gamesBody: "I enjoy FPS games, especially Overwatch. Sometimes competitive, mostly just having fun.",
    gamesAlt: "Overwatch 2 logo",
    playlistEyebrow: "My favorite album",
    playlistTitle: "No music,<br>no life.",
    playlistBody: "<strong>紺色に憧れて</strong> is my favorite album, and one I always come back to.",
    playlistButton: "Listen on Apple Music",
    playlistAlt: "紺色に憧れて album artwork",
    albumLinkLabel: "Open 紺色に憧れて on Apple Music",
    footerNote: "Built somewhere between flights and playlists.",
    source: "Source on GitHub",
    pride: "Stands with the LGBTQIA+ community",
  },
  ja: {
    pageTitle: "Jurinaのホームページ",
    brand: "Jurinaのホームページ",
    navAbout: "私について",
    navInterests: "好きなこと",
    navMusic: "音楽",
    heroEyebrow: "見つけてくれて、ありがとう。",
    heroTitle: "はじめまして。<br><span>Jurinaです。</span>",
    heroLead: "日本の音楽、バーチャルな空、そしてゲーム。好きなものはいろいろあります。仲良くしてくれるとうれしいです。よろしくお願いします。",
    pronouns: "She/Her または They/Them",
    avatarLabel: "私のアバター",
    avatarFrom: "『BanG Dream! Ave Mujica』より",
    interestsEyebrow: "私の好きなもの",
    interestsTitle: "好きなものを、<br>少しだけ。",
    musicKicker: "再生中",
    musicTitle: "いつでも、J-Tracks。",
    musicBody: "特にJ-Popが大好きです。いちばん好きなアーティストは<a href=\"https://www.universal-music.co.jp/yuika/\" target=\"_blank\" rel=\"noopener noreferrer\">ユイカ ↗</a>。",
    flightKicker: "バーチャル航空",
    flightTitle: "離陸を許可します。",
    flightBody: "VATUSAでC1管制官として活動しています。VATSIMやIVAOで、Microsoft Flight SimulatorとX-Planeを使って飛ぶことも。旅客機とビジネスジェットが好きです。",
    gamesKicker: "ゲーム",
    gamesTitle: "あと一戦だけ。",
    gamesBody: "FPSが好きで、特にOverwatchを遊んでいます。真剣なときもあるけれど、だいたいは楽しく。",
    gamesAlt: "Overwatch 2のロゴ",
    playlistEyebrow: "いちばん好きなアルバム",
    playlistTitle: "音楽のない人生<br>なんて。",
    playlistBody: "<strong>『紺色に憧れて』</strong>は、私がいちばん好きで、何度でも聴きたくなるアルバムです。",
    playlistButton: "Apple Musicで聴く",
    playlistAlt: "アルバム『紺色に憧れて』のアートワーク",
    albumLinkLabel: "Apple Musicで『紺色に憧れて』を開く",
    footerNote: "フライトとプレイリストの合間に作りました。",
    source: "GitHubでソースを見る",
    pride: "LGBTQIA+コミュニティと共に",
  },
};

document.body.classList.add("reveal-ready");
year.textContent = new Date().getFullYear();

const setLanguage = (language) => {
  const selected = translations[language] ? language : "en";
  document.documentElement.lang = selected;
  document.title = translations[selected].pageTitle;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = translations[selected][element.dataset.i18n];
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = translations[selected][element.dataset.i18nAlt];
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translations[selected][element.dataset.i18nAriaLabel]);
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === selected;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive);
  });

  localStorage.setItem("language", selected);
};

const savedLanguage = localStorage.getItem("language");
const initialLanguage = savedLanguage || (navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en");
setLanguage(initialLanguage);

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px",
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
