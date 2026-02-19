import { useState } from "react";
import ResultCard from "./ResultCard";

export default function ResultStep({
  finalResult,
  topTypes,
  results,
  scores,
  restart,
  share,
  shareKey,
}) {
  const isCombo = topTypes.length > 1;

  // ✅ 토글 상태
  const [showAll, setShowAll] = useState(false);
  const hideScoreBox = Boolean(shareKey);

  return (
    <main className="result-container">
      <h2 className="result-title">테스트 결과</h2>

      <p className="result-sub">
        {!finalResult
          ? "결과를 불러오지 못했어요. 다시 시도해 주세요."
          : isCombo
            ? "여러 가지 기운을 가진 당신은 복합 타입!"
            : "덕질에 정신력을 몰빵한다! 당신은 단일 타입!"}
      </p>

      {finalResult && <ResultCard result={finalResult} resultsMap={results} />}

      {!hideScoreBox && (
        <section
          className="score-box result-card"
          aria-labelledby="score-box-title"
        >
          <p className="score-box-title" id="score-box-title">
            나의 덕질 오행 기운 보기
          </p>

          <ul className="score-list">
            <li>
              목(木)
              <span
                className="bar style-wood"
                style={{ width: `${scores.wood * 2}rem` }}
              />
              <span className="score-text">{scores.wood}점</span>
            </li>

            <li>
              화(火)
              <span
                className="bar style-fire"
                style={{ width: `${scores.fire * 2}rem` }}
              />
              <span className="score-text">{scores.fire}점</span>
            </li>

            <li>
              토(土)
              <span
                className="bar style-earth"
                style={{ width: `${scores.earth * 2}rem` }}
              />
              <span className="score-text">{scores.earth}점</span>
            </li>

            <li>
              금(金)
              <span
                className="bar style-metal"
                style={{ width: `${scores.metal * 2}rem` }}
              />
              <span className="score-text">{scores.metal}점</span>
            </li>

            <li>
              수(水)
              <span
                className="bar style-water"
                style={{ width: `${scores.water * 2}rem` }}
              />
              <span className="score-text">{scores.water}점</span>
            </li>
          </ul>
        </section>
      )}
      <div className="last-btns-box">
        <button type="button" className="last-btn" onClick={restart}>
          다시 하기
        </button>
      </div>

      {/* ✅ 전체 결과 보기 섹션 */}
      <div className="last-btns-box">
        <button
          type="button"
          className="last-btn all"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
          aria-controls="all-results"
        >
          전체 결과 펼쳐 보기
        </button>
      </div>

      {showAll && (
        <section id="all-results" className="all-results">
          <ul className="all-results-list">
            {Object.entries(results)
              .filter(([, v]) => v && Number.isFinite(v.id))
              .map(([key, v]) => (
                <li key={key} className="all-results-item">
                  <div className="all-results-thumb">
                    <img
                      className="all-img"
                      src={`${import.meta.env.BASE_URL}img/${v.id}.webp`}
                      alt={v.label}
                    />
                  </div>

                  <div className="all-results-text">
                    <p className="all-results-label">{v.label}</p>
                    <span className="all-results-one">{v.oneLiner}</span>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      )}
    </main>
  );
}
