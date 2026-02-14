import "./App.css";
import { quiz } from "./assets/data";
import Header from "./components/Header";
import Footer from "./components/Footer";

import CoverStep from "./components/CoverStep";
import QuizStep from "./components/QuizStep";
import ResultStep from "./components/ResultStep";

import useQuiz from "./hooks/useQuiz";

function App() {
  const quizState = useQuiz(quiz);

  return (
    <>
      <Header />

      {quizState.step === "cover" && (
        <CoverStep
          title={quiz.meta.title}
          subtitle={quiz.meta.subtitle}
          subtext={quiz.meta.subtext}
          onStart={quizState.start}
        />
      )}

      {quizState.step === "quiz" && (
        <QuizStep
          q={quizState.q}
          selected={quizState.selected}
          onPickAnswer={quizState.pickAnswer}
          onPrev={quizState.prev}
          onNext={quizState.next}
          canNext={quizState.canNext}
          progress={quizState.progress}
        />
      )}

      {quizState.step === "result" && (
        <ResultStep
          finalResult={quizState.finalResult}
          topTypes={quizState.topTypes}
          results={quiz.results}
          isCombo={quizState.isCombo}
          scores={quizState.scores}
          restart={quizState.restart}
          share={quizState.share}
        />
      )}

      <Footer />
    </>
  );
}

export default App;
