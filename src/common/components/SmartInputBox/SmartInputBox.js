import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import "./SmartInputBox.css";
import CustomLoaderSpinner from "../customLoaderSpinner/CustomLoaderSpinner";
import { ReactComponent as SearchIcon } from "../../../static/search2.0.svg";
import { ReactComponent as SimilaritySearch } from "../../../static/SonicSimilaritySearch.svg";
import { useNavigate } from "react-router-dom";

// 🔹 Memoized Right Buttons
const RightButtons = memo(({ rightButtons, isLoading, value }) => (
  <div className="right-buttons">
    {rightButtons.map((btn, idx) => (
      <button
        key={idx}
        className={`right-btn ${
          value?.length === 0 || value?.length >= 10 ? "" : "added"
        }`}
        onClick={btn.onClick}
        title={btn.label}
      >
        {isLoading ? (
          <div className="custom_loader">
            <CustomLoaderSpinner />
          </div>
        ) : (
          btn.icon || btn.label
        )}
        {isLoading && btn.label?.toLowerCase() === "close" && btn?.icon && (
          <div className="custom_close">{btn.icon}</div>
        )}
      </button>
    ))}
  </div>
));

// 🔹 Memoized AI Search Buttons
const AISearchButtons = memo(({ navigate }) => (
  <div className="AISearchButtons">
    <button
      className="toggleBtn selectedBtn"
      onClick={() => navigate("/AISearchScreen", { state: { type: "ai" } })}
    >
      <SearchIcon className="SearchIcon" />
      <span>AI Search</span>
    </button>
    <button
      className="toggleBtn"
      onClick={() =>
        navigate("/AISearchScreen", { state: { type: "similarity" } })
      }
    >
      <SimilaritySearch className="SimilarityIcon" />
      <span>Similarity Search</span>
    </button>
  </div>
));

function SmartInputBox({
  placeholder,
  value,
  onChange,
  rightButtons = [],
  highlightedWords = [], // [{ word, attribute }]
  isLoading,
  onUnrefine, // 🔹 callback to clear Algolia refinements
  onKeyDown,
  homePage = false,
  onUserInteract,
}) {
  const divRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);
  const navigate = useNavigate();

  // ✅ Memoized highlighter
  const getHighlightedHTML = useCallback(() => {
    let processed = value;
    highlightedWords.forEach(({ word }) => {
      if (!word) return;
      const escaped = word.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      processed = processed.replace(
        regex,
        '<span class="highlighted-text">$1</span>'
      );
    });
    return processed;
  }, [value, highlightedWords]);

  // ✅ Caret positioning
  const placeCaretAtEnd = useCallback((el) => {
    el.focus();
    const lastChild = el.lastChild;
    if (
      lastChild?.nodeType === Node.ELEMENT_NODE &&
      lastChild.tagName === "SPAN"
    ) {
      const textNode = document.createTextNode("\u00A0");
      el.appendChild(textNode);
    }
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  // ✅ Controlled rendering
  useEffect(() => {
    if (divRef.current && !divRef.current.contains(document.activeElement)) {
      const html = getHighlightedHTML();
      if (divRef.current.innerHTML !== html) {
        divRef.current.innerHTML = html;
        placeCaretAtEnd(divRef.current);
      }
    }

    // if (value.trim() === "" && highlightedWords.length === 0 && onUnrefine) {
    //   onUnrefine("", "ALL"); // reset refinements if all cleared
    // }
  }, [
    value,
    highlightedWords,
    getHighlightedHTML,
    placeCaretAtEnd,
    onUnrefine,
  ]);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
      placeCaretAtEnd(divRef.current);
    }
  }, []);

  // ✅ Input handler
  const handleInput = useCallback(
    (e) => {
      const contentDiv = e.currentTarget;
      const selection = window.getSelection();
      const anchorNode = selection.anchorNode;

      // unwrap highlight if typing inside
      if (
        anchorNode &&
        anchorNode.parentNode?.classList?.contains("highlighted-text")
      ) {
        const span = anchorNode.parentNode;
        const unwrappedText = span.textContent;

        const removed = highlightedWords.find(
          (hw) => hw.word.toLowerCase() === unwrappedText.toLowerCase()
        );
        if (removed && onUnrefine) {
          onUnrefine(removed.word, removed.attribute);
        }

        const textNode = document.createTextNode(unwrappedText);
        span.replaceWith(textNode);

        const range = document.createRange();
        range.setStart(textNode, textNode.length);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // read visible content
      let plainText = "";
      contentDiv.childNodes.forEach((node) => {
        plainText += node.textContent;
      });

      const cleaned = plainText.replace(/\u00A0/g, " ").trim();
      onChange({ target: { value: cleaned } });
    },
    [highlightedWords, onUnrefine, onChange]
  );

  // ✅ Drag handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.type.startsWith("video/")) {
        setDroppedFile(file);
      } else {
        alert("Only PDF or Video files are allowed.");
      }
    }
  }, []);

  return (
    <div className="SmartInputBox">
      <div
        className={`smart-input-wrapper ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="smart-input-inner">
          <div
            ref={divRef}
            className="smart-textarea-contenteditable"
            contentEditable
            role="textbox"
            aria-multiline="true"
            onInput={(e) => {
              handleInput(e);
              onUserInteract?.("typing");
            }}
            onClick={() => onUserInteract?.("click")}
            onKeyDown={onKeyDown} // 👈 forward prop here
            suppressContentEditableWarning={true}
          />

          {value.length === 0 && (
            <div className="placeholder-text">{placeholder}</div>
          )}
        </div>

        {rightButtons.length > 0 && (
          <RightButtons
            rightButtons={rightButtons}
            isLoading={isLoading}
            value={value}
          />
        )}

        {/* {homePage && <AISearchButtons navigate={navigate} />} */}
      </div>
    </div>
  );
}

export default memo(SmartInputBox);
