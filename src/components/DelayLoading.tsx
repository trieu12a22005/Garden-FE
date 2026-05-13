import { useEffect, useRef, useState } from "react";
import { PulseLoader } from "react-spinners";

type DelayedLoadingProps = {
  loading: boolean;
  minDuration?: number;
  fadeDuration?: number;
  msg?: string;
};

const DelayedLoading = ({
  loading,
  minDuration = 700,
  fadeDuration = 300,
  msg = "Đang tải dữ liệu",
}: DelayedLoadingProps) => {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  const shownAtRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (unmountTimerRef.current) {
      clearTimeout(unmountTimerRef.current);
      unmountTimerRef.current = null;
    }

    if (loading) {
      if (!mounted) {
        setMounted(true);
      }

      requestAnimationFrame(() => {
        setShow(true);
      });

      if (!shownAtRef.current) {
        shownAtRef.current = Date.now();
      }

      return;
    }

    if (mounted) {
      const shownAt = shownAtRef.current ?? Date.now();
      const elapsed = Date.now() - shownAt;
      const remaining = Math.max(minDuration - elapsed, 0);

      hideTimerRef.current = setTimeout(() => {
        setShow(false);

        unmountTimerRef.current = setTimeout(() => {
          setMounted(false);
          shownAtRef.current = null;
        }, fadeDuration);
      }, remaining);
    }

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    };
  }, [loading, minDuration, fadeDuration, mounted]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm transition-all ${
        show ? "bg-white/80 opacity-100" : "bg-white/0 opacity-0"
      }`}
      style={{ transitionDuration: `${fadeDuration}ms` }}
    >
      <div
        className={`flex flex-col items-center gap-3 transition-all ${
          show ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-95 opacity-0"
        }`}
        style={{ transitionDuration: `${fadeDuration}ms` }}
      >
        <PulseLoader color="#3B82F6" size={15} />
        <p className="text-blue-500 font-medium animate-pulse">{msg}</p>
      </div>
    </div>
  );
};

export default DelayedLoading;
