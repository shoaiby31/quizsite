import { useEffect, useRef } from "react";

const QuizGuard = ({ onWarning }) => {
  const lastWarnRef = useRef(0);

  useEffect(() => {
    const warn = (reason) => {
      const now = Date.now();
      if (now - lastWarnRef.current < 2000) return;
      lastWarnRef.current = now;
      onWarning(reason);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") warn("tab switch");
    };

    const handleBlur = () => {
      warn("window blur");
    };

    const handlePop = () => {
      warn("back navigation");
      window.history.pushState(null, null, window.location.href); // block back
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("popstate", handlePop);
    window.history.pushState(null, null, window.location.href); // push state on load

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("popstate", handlePop);
    };
  }, [onWarning]);

  return null; // It only runs logic, doesn't render anything
};

export default QuizGuard;