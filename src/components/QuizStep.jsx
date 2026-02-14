export default function QuizStep({
  q, // currentQuiz → q
  selected, // selectedAnswer → selected
  onPickAnswer,
  onPrev,
  onNext,
  canNext, // canGoNext → canNext
  progress, // progressPercent → progress
}) {
  if (!q) return null;

  return (
    <main className="quiz-container">
      <section className="progress-bar-bg" aria-labelledby="sec-h4-title">
        <p id="sec-h4-title" className="skip">
          테스트 진척도
        </p>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </section>
      <section className="quiz-header">
        <span className="step-count">Question. {q.id}</span>
        <h2 className="question-title">{q.title}</h2>
      </section>

      <section className="answer-group" aria-labelledby="sec-h3-title">
        <h3 id="sec-h3-title" className="skip">
          문항 선택
        </h3>

        {q.answers.map((answer, index) => (
          <button
            key={answer.id ?? index}
            type="button"
            className={`answer-btn ${selected === index ? "selected" : ""}`}
            onClick={() => onPickAnswer(index)}
          >
            {answer.text}
          </button>
        ))}
      </section>

      <section className="btn-container">
        <button className="quiz-prev-btn" type="button" onClick={onPrev}>
          이전
        </button>

        <button
          className="quiz-next-btn"
          type="button"
          onClick={onNext}
          disabled={!canNext}
        >
          다음
        </button>
      </section>
    </main>
  );
}
