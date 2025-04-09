import React from "react";

const LinkComponent = ({ index, entry, onDelete }) => {
  return (
    <li className="flex justify-between items-center px-4 py-2 hover:bg-gray-100">
      <div className="flex items-center">
        <span className="font-medium text-gray-800">{entry.name}</span>
      </div>

      <button
        onClick={() => onDelete(index)}
        className="text-red-500 hover:text-red-700 ml-4"
      >
        ×
      </button>
    </li>
  );
};

export default LinkComponent;
