"use client";
import { useEffect } from "react";

/**
 * Active les apparitions au scroll : tout élément portant [data-reveal]
 * reçoit la classe .is-in lorsqu'il entre dans le viewport.
 * À monter une seule fois par page.
 */
export default function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    const scan = () =>
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    const id = setInterval(scan, 1200);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, []);
  return null;
}
