export default function ResultCard({ result, resultsMap, share }) {
  if (!result) return null;

  const base = import.meta.env.BASE_URL;

  const {
    id,
    label,
    oneLiner,
    desc,
    matches,
    keywords = [],
    style = [],
  } = result;

  const { best, worst } = matches ?? {};

  const matchList = [
    { kind: "best", title: "평생 갈 덕친✨", data: best },
    { kind: "worst", title: "지뢰 주의보 빌런⚡", data: worst },
  ];

  return (
    <article className="result-card">
      <img src={`${base}img/${id}.webp`} alt={label} className="result-img" />

      <h3 className="result-label">{label}</h3>
      <p className="result-one">{oneLiner}</p>
      <p className="result-desc">{desc}</p>

      <div className="result-style-box">
        <h4 className="style-label">나의 덕질 스타일</h4>
        {style.length > 0 && (
          <ul className="result-style-list">
            {style.map((item, i) => (
              <li key={`${id}-style-${i}`} className="result-style-item">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="match-section">
        {matchList.map(({ kind, title, data }) => {
          if (!data?.type) return null;

          const ref = resultsMap?.[data.type];
          const imgId = ref?.id;
          const shortLabel = ref?.shortLabel ?? "";

          return (
            <div key={`${id}-${kind}`} className={`match-card ${kind}`}>
              <div className="match-box">
                {imgId && (
                  <img
                    className="match-card-img"
                    src={`${base}img/${imgId}.webp`}
                    alt={shortLabel ? `${shortLabel} 이미지` : ""}
                  />
                )}

                <div className="match-desc-box">
                  <div className="match-desc-top">
                    <h5 className={`match-card-title ${kind}`}>{title}</h5>
                    <p className="match-card-title-input">
                      <strong>{shortLabel}</strong>
                    </p>
                  </div>
                  <span className="match-desc">{data.desc ?? ""}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {keywords.length > 0 && (
        <ul className="result-keywords">
          {keywords.map((k) => (
            <li key={`${id}-kw-${k}`} className="result-tag">
              #{k}
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="last-btn share" onClick={share}>
        내 결과 공유하기
      </button>
    </article>
  );
}
