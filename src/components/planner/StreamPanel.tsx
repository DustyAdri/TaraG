import { useEffect, useRef } from "react";
import { SparkleIcon } from "../Icons";

interface StreamPanelProps {
  text: string;
  streaming: boolean;
}

/**
 * 5.1c: live output box. While streaming it shows the loading animation and
 * each chunk as it arrives; once the plan is done it collapses.
 */
export function StreamPanel({ text, streaming }: StreamPanelProps) {
  const boxRef = useRef<HTMLPreElement>(null);

  // Keep the newest text in view.
  useEffect(() => {
    const box = boxRef.current;
    if (box && streaming) box.scrollTop = box.scrollHeight;
  }, [text, streaming]);

  if (streaming) {
    return (
      <section className="card stream-panel" aria-live="polite" aria-busy="true">
        <div className="stream-status">
          <span className="orbit" aria-hidden="true">
            <SparkleIcon size={20} />
          </span>
          <span>
            Gemini is planning your trip
            <span className="dots" aria-hidden="true">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </span>
        </div>
        {text ? (
          <pre ref={boxRef} className="stream-box">
            {text}
            <span className="caret" aria-hidden="true" />
          </pre>
        ) : (
          <div className="skeleton" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
      </section>
    );
  }

  if (!text) return null;

  return (
    <details className="card stream-panel done">
      <summary>Show the AI's raw answer</summary>
      <pre className="stream-box">{text}</pre>
    </details>
  );
}
