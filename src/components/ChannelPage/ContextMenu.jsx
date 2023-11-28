import React, { useEffect, useRef } from "react";

export const ContextMenu = ({
  x,
  y,
  onLeaveChannel,
  onMuteChannel,
  onClose,
}) => {
  const contextMenuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      contextMenuRef.current &&
      !contextMenuRef.current.contains(event.target)
    ) {
      onClose(); // Close the context menu
    }
  };

  useEffect(() => {
    // Add click event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const style = {
    position: "absolute",
    top: y,
    left: x,
    zIndex: 1000,
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "5px",
    cursor: "pointer",
    width: "150px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  return (
    <div ref={contextMenuRef} style={style} className="context-menu">
      <div className="context-menu-item" onClick={onLeaveChannel}>
        Leave Channel
      </div>
      <div className="context-menu-item" onClick={onMuteChannel}>
        Mute Channel
      </div>
    </div>
  );
};
