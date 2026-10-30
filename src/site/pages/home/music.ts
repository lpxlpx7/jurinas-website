import { alt, external, html, label, text } from "../../../build/html.ts";
import type { TranslationKey } from "../../../shared/translations.ts";
import { icon } from "../../components/icon.ts";

const music = {
  yuikaSite: "https://www.universal-music.co.jp/yuika/",
  navyBlueAlbum: "https://music.apple.com/jp/album/longing-for-navy-blue/1748508425",
  naotaroPlaylist: "https://music.apple.com/jp/playlist/%E6%A3%AE%E5%B1%B1%E7%9B%B4%E5%A4%AA%E6%9C%97/pl.u-zPyLl43u85yxJMz",
  naotaroCover: "https://naotaro.com/img/disco/thumb/subarashisekai_tsujou.jpg",
  recentPlaylist: "https://music.apple.com/jp/playlist/%E6%9C%80%E8%BF%91%E3%81%AE%E6%AD%8C/pl.u-4JomXNJtXe6mvMB",
};

const linkButton = (href: string, key: TranslationKey, className = "button button-light") =>
  `<a class="${className}" ${external(href)}><span ${text(key)}</span> ${icon("external")}</a>`;

const yuika = html`
          <article class="music-slide music-slide-yuika" data-slide="0">
            <img class="music-backdrop" src="img/yuika.png" alt="" aria-hidden="true">
            <div class="music-vignette" aria-hidden="true"></div>
            <div class="music-slide-inner shell">
              <a class="playlist-art" draggable="false" ${external(music.navyBlueAlbum)} ${label("albumLinkLabel")}>
                <div class="vinyl" ${label("playlistAlt")}><img src="img/紺色に憧れて.png" alt=""><span aria-hidden="true"></span></div>
              </a>
              <div class="playlist-copy">
                <p class="eyebrow" ${text("yuikaEyebrow")}</p>
                <h2 ${text("yuikaTitle")}</h2>
                <p ${text("yuikaBody")}</p>
                <div class="music-actions">
                  ${linkButton(music.yuikaSite, "yuikaButton")}
                  ${linkButton(music.navyBlueAlbum, "albumLink", "album-text-link")}
                </div>
              </div>
            </div>
          </article>`;

const naotaro = html`
          <article class="music-slide music-slide-naotaro" data-slide="1">
            <img class="music-backdrop" src="img/naotaro.jpg" alt="" aria-hidden="true">
            <div class="music-vignette" aria-hidden="true"></div>
            <div class="music-slide-inner shell">
              <a class="album-cover" draggable="false" ${external(music.naotaroPlaylist)} ${label("naotaroLinkLabel")}>
                <img src="${music.naotaroCover}" ${alt("naotaroAlt")}>
              </a>
              <div class="playlist-copy">
                <p class="eyebrow" ${text("naotaroEyebrow")}</p>
                <h2 ${text("naotaroTitle")}</h2>
                <p ${text("naotaroBody")}</p>
                ${linkButton(music.naotaroPlaylist, "naotaroButton")}
              </div>
            </div>
          </article>`;

const recent = html`
          <article class="music-slide music-slide-recent" data-slide="2">
            <div class="recent-backdrop" aria-hidden="true"><span></span><span></span><span></span></div>
            <div class="music-vignette" aria-hidden="true"></div>
            <div class="music-slide-inner music-slide-centered shell">
              <div class="recent-art" aria-hidden="true">${icon("note")}</div>
              <div class="playlist-copy">
                <p class="eyebrow" ${text("recentEyebrow")}</p>
                <h2 ${text("recentTitle")}</h2>
                <p ${text("recentBody")}</p>
                ${linkButton(music.recentPlaylist, "recentButton")}
              </div>
            </div>
          </article>`;

/** One dot per slide, in slide order; client/features/music-rail keeps them in sync with the scroll. */
const dots: TranslationKey[] = ["yuikaTab", "naotaroTab", "recentTab"];

/** Horizontally scrolling music rail (styles: sections/music). */
export const musicShowcase = (): string => html`
    <section class="music-showcase reveal" id="music" tabindex="0" ${label("musicShowcaseLabel")}>
      <div class="music-viewport">
        <div class="music-track">${yuika}
${naotaro}
${recent}
        </div>
      </div>

      <div class="music-controls" ${label("musicControlsLabel")}>
        <button class="music-arrow music-prev" type="button" disabled ${label("previousSlide")}>${icon("chevron-back")}</button>
        <div class="music-dots" role="tablist" ${label("musicPagesLabel")}>
${dots.map((key, index) => `          <button class="music-dot${index === 0 ? " is-active" : ""}" type="button" role="tab" ${label(key)} aria-selected="${index === 0}" data-slide-to="${index}"><span ${text(key)}</span></button>\n`)}        </div>
        <button class="music-arrow music-next" type="button" ${label("nextSlide")}>${icon("chevron")}</button>
      </div>
    </section>`;
