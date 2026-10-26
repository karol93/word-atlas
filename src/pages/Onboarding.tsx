import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAtlas } from "../atlas/context";
import { APP_NAME } from "../config";
import { plural } from "../lib/pl";
import { store } from "../store/store";

const LEVELS = [
  ["A2", "Początkujący", "Podstawowe słowa"],
  ["B1", "Średnio zaawansowany", "Codzienne słownictwo masz za sobą"],
  ["B2", "Wyższy średni", "Swobodnie radzisz sobie z większością tematów"],
  ["C1", "Zaawansowany", "Rzadsze i bardziej precyzyjne słowa"],
];

export function Onboarding() {
  const atlas = useAtlas();
  const [level, setLevel] = useState(1);
  const [goal, setGoal] = useState(10);
  const finish = () => store.settings({ onboarded: true, startLevel: atlas.cefr.indexOf(LEVELS[level][0]), dailyNew: goal });
  return (
    <div className="onboard" role="dialog" aria-modal="true" aria-label="Witaj">
      <div className="onboard-card">
        <img className="onboard-art" src={`${import.meta.env.BASE_URL}brand/hero.webp`} alt="" />
        <div className="onboard-body">
          <p className="eyebrow">Witaj w aplikacji {APP_NAME}</p>
          <h1 className="display">
            {atlas.count.toLocaleString("pl-PL")} {plural(atlas.count, "gwiazda", "gwiazdy", "gwiazd")},
            <br />
            czekają, aż je zapalisz.
          </h1>
          <fieldset>
            <legend>Skąd wyruszasz?</legend>
            <div className="choice-grid">
              {LEVELS.map(([code, name, desc], i) => (
                <button key={code} className={`choice ${level === i ? "is-on" : ""}`} onClick={() => setLevel(i)} aria-pressed={level === i}>
                  <span className={`chip chip-level lv-${code}`}>{code}</span>
                  <b>{name}</b>
                  <small>{desc}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Ile nowych gwiazd dziennie?</legend>
            <div className="segmented segmented-wide">
              {[5, 10, 15, 20].map((n) => (
                <button key={n} className={goal === n ? "is-on" : ""} onClick={() => setGoal(n)} aria-pressed={goal === n}>
                  {n} {plural(n, "gwiazda", "gwiazdy", "gwiazd")}
                  {n === 10 ? " · polecane" : ""}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="btn btn-primary btn-xl" onClick={finish}>
            Wyruszamy <ArrowRight size={20} />
          </button>
          <p className="muted">Bez rejestracji. Postępy zostają tylko na tym urządzeniu, a ustawienia zmienisz w każdej chwili w zakładce „Moje”.</p>
        </div>
      </div>
    </div>
  );
}
