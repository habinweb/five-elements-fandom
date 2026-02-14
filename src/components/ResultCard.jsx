export default function ResultCard({ result, resultsMap, isCombo }) {
  if (!result) return null;

  const bestType = result.matches?.best?.type ?? null;
  const worstType = result.matches?.worst?.type ?? null;

  const bestRef = bestType ? resultsMap?.[bestType] : null;
  const worstRef = worstType ? resultsMap?.[worstType] : null;

  const bestImgId = bestRef?.id ?? null;
  const worstImgId = worstRef?.id ?? null;

  const bestLabel = bestRef?.shortLabel ?? "";
  const worstLabel = worstRef?.shortLabel ?? "";

  const keywords = Array.isArray(result.keywords) ? result.keywords : [];
  const styleList = Array.isArray(result.style) ? result.style : [];

  const base = import.meta.env.BASE_URL; // ✅ GitHub Pages 대응

  return (
    <article className="result-card">
      <img
        src={`${base}img/${result.id}.png`}
        alt={result.label}
        className="result-img"
      />

      <h3 className="result-label">{result.label}</h3>
      <p className="result-one">{result.oneLiner}</p>
      <p className="result-desc">{result.desc}</p>

      <div className="result-style-box">
        <h4 className="style-label">나의 덕질 스타일</h4>
        {styleList.length > 0 && (
          <ul className="result-style-list">
            {styleList.map((item, i) => (
              <li key={`${result.id}-style-${i}`} className="result-style-item">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="match-section">
        <div className="match-card best">
          <div className="match-box">
            <img
              className="match-card-img"
              src={bestImgId ? `${base}img/${bestImgId}.png` : ""}
              alt={bestLabel ? `${bestLabel} 이미지` : ""}
            />
            <div className="match-desc-box">
              <div className="match-desc-top">
                <h5 className="match-card-title best">평생 갈 덕친✨</h5>
                <p>
                  <strong>{bestLabel}</strong>
                </p>
              </div>
              <span className="match-desc">{result.matches?.best?.desc}</span>
            </div>
          </div>
        </div>

        <div className="match-card worst">
          <div className="match-box">
            <img
              className="match-card-img"
              src={worstImgId ? `${base}img/${worstImgId}.png` : ""}
              alt={worstLabel ? `${worstLabel} 이미지` : ""}
            />
            <div className="match-desc-box">
              <div className="match-desc-top">
                <h5 className="match-card-title worst">지뢰 주의보 빌런⚡</h5>
                <p>
                  <strong>{worstLabel}</strong>
                </p>
              </div>
              <span className="match-desc">{result.matches?.worst?.desc}</span>
            </div>
          </div>
        </div>
      </div>

      {keywords.length > 0 && (
        <ul className="result-keywords">
          {keywords.map((k) => (
            <li key={`${result.id}-kw-${k}`} className="result-tag">
              #{k}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
