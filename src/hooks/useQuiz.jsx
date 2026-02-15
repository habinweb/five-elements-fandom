import { useEffect, useMemo, useState } from "react";
import { sendSelectOption, sendQuizResult } from "../assets/utils/input";

export default function useQuiz(quiz) {
  const questions = quiz?.questions ?? [];
  const total = questions.length;

  const [step, setStep] = useState("cover");
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(() => Array(total).fill(null));

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

  const key = useMemo(() => {
    if (topTypes.length === 4) return "multi4";
    return topTypes.slice().sort().join("+");
  }, [topTypes]);

  const [shareKey, setShareKey] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("result");
  });

  const displayKey = step === "result" && shareKey ? shareKey : key;

  const finalResult = useMemo(() => {
    return quiz?.results?.[displayKey] ?? null;
  }, [quiz?.results, displayKey]);

  const isCombo = displayKey.includes("+") || displayKey === "multi4";
  const progress = total ? ((i + 1) / total) * 100 : 0;
  const canNext = selected != null;

  useEffect(() => {
    if (!shareKey) return;
    if (!quiz?.results?.[shareKey]) return;
    setStep("result");
  }, [shareKey, quiz?.results]);

  const clearResultParam = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("result");
    window.history.replaceState({}, "", url.toString());
    setShareKey(null);
  };

  const start = () => {
    clearResultParam();
    setPicked(Array(total).fill(null));
    setI(0);
    setStep("quiz");
  };

  const pickAnswer = (answerIndex) => {
    const qNow = questions[i];
    const ans = qNow?.answers?.[answerIndex];

    sendSelectOption({
      questionId: qNow?.id ?? i + 1,
      optionIndex: answerIndex,
      optionText: ans?.text ?? "",
      optionType: ans?.type ?? "",
    });

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

    if (i + 1 < total) {
      setI((p) => p + 1);
    } else {
      if (!shareKey) {
        sendQuizResult({ resultType: key, topTypes });
      }
      setStep("result");
    }
  };

  const restart = () => {
    clearResultParam();
    setStep("cover");
    setI(0);
    setPicked(Array(total).fill(null));
  };

  const share = async () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("result", key);
    url.searchParams.set("v", Date.now());
    const shareUrl = url.toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "덕질 오행 테스트",
          text: "내 덕질 오행 결과 보기 👇",
          url: shareUrl,
        });
        return;
      } catch {}
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        alert("공유 링크 복사 완료!");
        return;
      }
    } catch {}

    try {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, shareUrl.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(input);

      if (ok) alert("공유 링크 복사 완료!");
      else prompt("아래 링크를 복사하세요.", shareUrl);
    } catch {
      prompt("아래 링크를 복사하세요.", shareUrl);
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
    key,
    displayKey,
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
