"use client";
import { useState, useEffect } from "react";

const TextGuide = ({
  containerId = "draggable-container",
  onPositionChange,
  pos,
  fontsize,
  title,
  store,
}) => {
  const [position, setPosition] = useState(pos);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (!dragging) {
      const rect = e.target.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const container = document
      .getElementById(containerId)
      .getBoundingClientRect();
    let newX = e.clientX - container.left - offset.x;
    let newY = e.clientY - container.top - offset.y;

    newX = Math.max(0, Math.min(newX, container.width));
    newY = Math.max(0, Math.min(newY, container.height));

    setPosition({ x: newX, y: newY });
    onPositionChange({ x: newX, y: newY });
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", () => setDragging(false), {
        once: true,
      });
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dragging]);

  return (
    <div
      className="absolute flex flex-col font-faktos text-black cursor-grab"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <span style={{ fontSize: fontsize }}>{title}</span>
      <span style={{ fontSize: fontsize * 0.8 }}>{store}</span>
    </div>
  );
};

export default TextGuide;
