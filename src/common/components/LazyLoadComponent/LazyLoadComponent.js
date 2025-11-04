import React, { useEffect, useRef, useState } from "react";
import "./LazyLoadComponent.css";

export const LazyLoadComponent = React.forwardRef(
  ({ children, className, defaultHeight = 200, dataAttrs = {} }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [wasLoaded, setWasLoaded] = useState(false); // one-time state
    const localRef = useRef(null);

    // Use either forwarded or local ref
    const containerRef = ref || localRef;

    useEffect(() => {
      if (!containerRef.current || wasLoaded) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setWasLoaded(true);
            observer.disconnect(); // only trigger once
          }
        },
        {
          threshold: 0.1,
        }
      );

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }, [containerRef, wasLoaded]);

    return (
      <div
        ref={containerRef}
        className={className || ""}
        {...dataAttrs}
        style={{
          minHeight: !isVisible ? `${defaultHeight}px` : undefined, // remove minHeight after load
        }}
      >
        {isVisible && children}
      </div>
    );
  }
);
