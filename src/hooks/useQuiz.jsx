import { useEffect, useMemo, useState } from "react";

export default function useQuiz(quiz) {
  // 1️⃣ 데이터
  const questions = quiz?.questions ?? [];
  const total = questions.length;

  // 2️⃣ 상태
  const [step, setStep] = useState("cover"); // "cover" | "quiz" | "result"
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(() => Array(total).fill(null));

  // 3️⃣ 질문 개수 변하면 picked 길이 맞춰주기
  useEffect(() => {
    setPicked((prev) => {
      if (prev.length === total) return prev;

      const next = Array(total).fill(null);
      for (let idx = 0; idx < Math.min(prev.length, total); idx++) {
        next[idx] = prev[idx];
      }
      return next;
    });

    setI((prev) => (prev >= total ? 0 : prev));
  }, [total]);

  // 4️⃣ 현재 문항
  const q = questions[i];
  const selected = picked[i] ?? null;

  // 5️⃣ 점수 계산
  const scores = useMemo(() => {
    const s = { fire: 0, water: 0, wood: 0, metal: 0, earth: 0 };

    picked.forEach((ansIndex, qIndex) => {
      if (ansIndex == null) return;

      const type = questions[qIndex]?.answers?.[ansIndex]?.type;
      if (!type) return;

      s[type] += 1;
    });

    return s;
  }, [picked, questions]);

  // 6️⃣ 최고 점수 타입 찾기
  const topTypes = useMemo(() => {
    const values = Object.values(scores);
    const max = values.length ? Math.max(...values) : 0;

    return Object.entries(scores)
      .filter(([, v]) => v === max)
      .map(([k]) => k);
  }, [scores]);

  // 7️⃣ 결과 키(단일/복합 공용)
  const key = useMemo(() => {
    if (topTypes.length === 4) return "multi4";
    return topTypes.slice().sort().join("+");
  }, [topTypes]);

  // 8️⃣ 최종 결과(단일/복합 통합 접근)
  const finalResult = useMemo(() => {
    return quiz?.results?.[key] ?? null;
  }, [quiz?.results, key]);

  // 9️⃣ 복합 여부(= UI 문구/뱃지/레이아웃 분기용)
  const isCombo = topTypes.length > 1;

  // 9️⃣ 진행도
  const progress = total ? ((i + 1) / total) * 100 : 0;
  const canNext = selected != null;

  // ✅ 액션들
  const start = () => {
    setI(0);
    setStep("quiz");
  };

  const pickAnswer = (answerIndex) => {
    setPicked((prev) => {
      const copy = [...prev];
      copy[i] = answerIndex;
      return copy;
    });
  };

  const prev = () => {
    if (i === 0) {
      setStep("cover");
      return;
    }
    setI((p) => p - 1);
  };

  const next = () => {
    if (!canNext) return;

    if (i + 1 < total) setI((p) => p + 1);
    else setStep("result");
  };

  const restart = () => {
    setStep("cover");
    setI(0);
    setPicked(Array(total).fill(null));
  };

  const share = async () => {
    // ✅ 단일/복합 통일: key 그대로 공유
    const url = new URL(window.location.href);
    url.searchParams.set("result", key);

    try {
      await navigator.clipboard.writeText(url.toString());
      alert("공유 링크 복사 완료!");
    } catch {
      prompt("아래 링크를 복사하세요.", url.toString());
    }
  };

  return {
    // 상태/데이터
    step,
    i,
    picked,
    questions,
    q,
    selected,

    // 결과 관련(통일)
    scores,
    topTypes,
    key,
    finalResult,
    isCombo,

    // 진행
    progress,
    canNext,

    // 액션
    start,
    pickAnswer,
    prev,
    next,
    restart,
    share,
  };
}
