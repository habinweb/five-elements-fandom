import { useEffect, useMemo, useState } from "react";

export default function useQuiz(quiz) {
  const questions = quiz?.questions ?? [];
  const total = questions.length;

  const [step, setStep] = useState("cover"); // "cover" | "quiz" | "result"
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(() => Array(total).fill(null));

  // 질문 수 바뀌면 picked 길이 정리
  useEffect(() => {
    setPicked((prev) => {
      if (prev.length === total) return prev;
      const next = Array(total).fill(null);
      for (let idx = 0; idx < Math.min(prev.length, total); idx++)
        next[idx] = prev[idx];
      return next;
    });
    setI((prev) => (prev >= total ? 0 : prev));
  }, [total]);

  const q = questions[i];
  const selected = picked[i] ?? null;

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

  const topTypes = useMemo(() => {
    const values = Object.values(scores);
    const max = values.length ? Math.max(...values) : 0;
    return Object.entries(scores)
      .filter(([, v]) => v === max)
      .map(([k]) => k);
  }, [scores]);

  // 내가 푼 결과 키
  const key = useMemo(() => {
    if (topTypes.length === 4) return "multi4";
    return topTypes.slice().sort().join("+");
  }, [topTypes]);

  // ✅ 공유 프리뷰 키(파라미터) - 필요할 때만 읽음
  const [shareKey, setShareKey] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("result"); // 없으면 null
  });

  // ✅ "현재 화면에서 보여줄 키" = (공유 프리뷰면 shareKey) 아니면 (내가 푼 key)
  const displayKey = step === "result" && shareKey ? shareKey : key;

  const finalResult = useMemo(() => {
    return quiz?.results?.[displayKey] ?? null;
  }, [quiz?.results, displayKey]);

  const isCombo = displayKey.includes("+") || displayKey === "multi4";

  const progress = total ? ((i + 1) / total) * 100 : 0;
  const canNext = selected != null;

  // ✅ 공유 링크로 들어오면 "처음에만" 결과 화면으로 점프
  useEffect(() => {
    if (!shareKey) return;
    if (!quiz?.results?.[shareKey]) return;
    setStep("result");
  }, [shareKey, quiz?.results]);

  // ✅ 공용: result 파라미터 제거
  const clearResultParam = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("result");
    window.history.replaceState({}, "", url.toString());
    setShareKey(null);
  };

  const start = () => {
    clearResultParam(); // 공유 모드 끄기
    setPicked(Array(total).fill(null)); // 공유에서 들어왔을 수도 있으니 초기화
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
    clearResultParam(); // 공유 모드 끄기
    setStep("cover");
    setI(0);
    setPicked(Array(total).fill(null));
  };

  const share = async () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("result", key);

    try {
      await navigator.clipboard.writeText(url.toString());
      alert("공유 링크 복사 완료!");
    } catch {
      prompt("아래 링크를 복사하세요.", url.toString());
    }
  };

  return {
    step,
    i,
    picked,
    questions,
    q,
    selected,

    scores,
    topTypes,
    key, // 내가 푼 키
    displayKey, // 화면에 보여주는 키(공유/내 결과)
    finalResult,
    isCombo,

    progress,
    canNext,
    shareKey,
    start,
    pickAnswer,
    prev,
    next,
    restart,
    share,
  };
}
