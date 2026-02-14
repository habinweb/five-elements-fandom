export default function CoverStep({ title, subtitle, subtext, onStart }) {
  return (
    <main className="cover-container">
      <div className="cover-title-box">
        <div className="shape-box" aria-hidden="true"></div>
        <h2 className="cover-title">{title}</h2>
        <p className="cover-desc">{subtitle}</p>
        <p className="cover-desc-sub">{subtext}</p>
      </div>

      <button className="cover-start-btn" type="button" onClick={onStart}>
        테스트 시작하기
      </button>
    </main>
  );
}
