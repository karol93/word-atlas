import { ArrowUpRight, Database, Github, Heart } from "lucide-react";
import { useAtlas } from "../atlas/context";
import { APP_NAME, REPO_URL, TAGLINE } from "../config";

const BASE = import.meta.env.BASE_URL;

export function About() {
  const atlas = useAtlas();
  return (
    <div className="page about">
      <header className="about-hero">
        <img src={`${BASE}brand/og.webp`} alt="" />
        <div>
          <p className="eyebrow">O aplikacji {APP_NAME}</p>
          <h1 className="display">{TAGLINE}</h1>
          <p className="lede">
            {APP_NAME} to autorski zestaw {atlas.count.toLocaleString("pl-PL")} słówek z poziomami CEFR. Każde słowo ma własną oryginalną ilustrację, zdanie z codziennego życia, zdanie bardziej formalne, wymowę brytyjską i amerykańską, typowe kolokacje oraz wskazówki o łatwych do pomylenia słowach. Gdy nauczysz się jednego, na twojej mapie zapala się gwiazda.
          </p>
          <p className="lede">Aplikacja jest darmowa, otwarta i nie wymaga rejestracji. Kod jest na licencji MIT, a treści na CC BY 4.0, więc każdy może z nich korzystać.</p>
          <div className="about-actions">
            <a className="btn btn-primary" href={REPO_URL} target="_blank" rel="noreferrer">
              <Github size={18} /> Zobacz na GitHubie
            </a>
            <a className="btn btn-ghost" href={`${REPO_URL}/tree/main/data`} target="_blank" rel="noreferrer">
              <Database size={18} /> Pobierz dane JSON / CSV
            </a>
          </div>
        </div>
      </header>

      <div className="about-grid">
        <section className="panel">
          <h3 className="eyebrow">Dlaczego to zostaje w głowie</h3>
          <ul className="feature-list">
            <li>
              <b>Najpierw zobacz.</b> Każde słowo ma obraz, a obraz pokazuje to, co dzieje się w pierwszym zdaniu przykładowym.
            </li>
            <li>
              <b>Potem przypomnij.</b> Wybór znaczenia, uzupełnianie zdań do obrazka, rozpoznawanie ze słuchu i pisownia: od rozpoznawania do pisania.
            </li>
            <li>
              <b>Powtórka tuż przed zapomnieniem.</b> FSRS to otwarty algorytm pamięci z nowszych wersji Anki. Planuje powtórki dopiero wtedy, gdy zaczynasz zapominać.
            </li>
            <li>
              <b>Uczciwy wynik.</b> Liczy się tylko pierwsza odpowiedź. Błędne słowo wróci w innym typie zadania, ale nie podbije skuteczności.
            </li>
            <li>
              <b>Postęp należy do ciebie.</b> Bez konta i bez serwera. Dane są w twojej przeglądarce i w każdej chwili możesz je wyeksportować.
            </li>
          </ul>
        </section>

        <section className="panel">
          <h3 className="eyebrow">Skróty klawiszowe</h3>
          <dl className="keys">
            <div>
              <dt>
                <kbd>⌘</kbd>
                <kbd>K</kbd> lub <kbd>/</kbd>
              </dt>
              <dd>Szukaj dowolnego słowa</dd>
            </div>
            <div>
              <dt>
                <kbd>1</kbd>–<kbd>4</kbd>
              </dt>
              <dd>Wybierz odpowiedź</dd>
            </div>
            <div>
              <dt>
                <kbd>Enter</kbd>
              </dt>
              <dd>Zatwierdź / dalej</dd>
            </div>
            <div>
              <dt>
                <kbd>←</kbd> <kbd>→</kbd>
              </dt>
              <dd>Poprzednie i następne słowo na karcie</dd>
            </div>
            <div>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>Zamknij okno</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <h3 className="eyebrow">Skąd się biorą treści</h3>
          <p className="muted">
            Definicje, przykłady, tłumaczenia, kolokacje i wskazówki zostały wygenerowane przez model językowy według jednolitych zasad słownikowych. Ilustracje są syntetyczne, a wymowa i lektor to nagrania syntetyczne (ElevenLabs: Alice dla brytyjskiego, Sarah dla amerykańskiego). Wszystko przechodzi automatyczną kontrolę struktury i spójności, ale nie jest sprawdzane ręcznie, wpis po wpisie. Znalazłeś błąd? Zgłoś go jako Issue na GitHubie albo popraw dane i wyślij PR.
          </p>
          <p className="muted">
            {APP_NAME} to nie jest oficjalna lista słówek żadnego egzaminu i nie obiecuje wyższych wyników. Chce tylko sprawić, żeby nauka słówek była ładniejsza i solidniejsza. Projekt powstał na bazie oryginalnego{" "}
            <a className="link" href={REPO_URL} target="_blank" rel="noreferrer">
              Word Atlas
            </a>
            .
          </p>
        </section>

        <section className="panel">
          <h3 className="eyebrow">Dla programistów</h3>
          <p className="muted">
            <code>data/word-atlas.json</code> i <code>.csv</code> to pełny zestaw słówek, a w <code>public/atlas</code> są dane podzielone na części dla strony, ilustracje i audio. Użyj ich do talii Anki, aplikacji do nauki, wtyczki do przeglądarki albo zestawu testowego dla AI. Wystarczy podać autora.
          </p>
          <a className="link" href={`${REPO_URL}#readme`} target="_blank" rel="noreferrer">
            Czytaj dokumentację <ArrowUpRight size={14} />
          </a>
        </section>
      </div>
      <p className="colophon">
        <Heart size={14} /> Zrobione dla każdego, kto uczy się słówek.
      </p>
    </div>
  );
}
