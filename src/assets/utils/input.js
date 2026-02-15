// src/assets/utils/input.js

export function sendSelectOption({
  questionId,
  optionIndex,
  optionText,
  optionType,
}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "select_option", {
    question_id: String(questionId),
    option_index: Number(optionIndex),
    option_text: optionText ?? "",
    option_type: optionType ?? "",
  });
}

export function sendQuizResult({ resultType, topTypes }) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "quiz_result", {
    result_type: String(resultType),
    top_types: Array.isArray(topTypes) ? topTypes.join(",") : "",
  });
}
