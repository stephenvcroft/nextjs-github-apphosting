"use client";
import { useState, useEffect } from "react";

const PriceTag = ({
  containerId = "draggable-container",
  onPositionChange,
  h,
  pos,
}) => {
  const [position, setPosition] = useState(pos);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [prevHeight, setPrevHeight] = useState(h);

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

    newX = Math.max(0, Math.min(newX, container.width - h));
    newY = Math.max(0, Math.min(newY, container.height - h));

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

  useEffect(() => {
    if (h !== prevHeight) {
      const diff = h - prevHeight;
      const offsetX = diff / 2;
      const offsetY = diff / 2;

      setPosition({
        x: Math.max(0, position.x - offsetX),
        y: Math.max(0, position.y - offsetY),
      });

      setPrevHeight(h);
    }
  }, [h, prevHeight, position.x, position.y]);

  return (
    <div
      className="absolute cursor-grab rounded-full bg-red-500"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${h}px`,
        height: `${h}px`,
      }}
      onMouseDown={handleMouseDown}
    />
  );
};

export default PriceTag;
