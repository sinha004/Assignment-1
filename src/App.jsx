import { useState, useEffect } from "react";
import "./App.css";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ entry, onDelete, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: entry.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move px-2 py-2 rounded bg-blue-200 text-sm"
    >
      <div className="flex justify-between items-center">
        <a
          target="_blank"
          href={entry.url}
          className="flex-grow hover:text-blue-600"
          onClick={(e) => {
            if (attributes["aria-pressed"]) {
              e.preventDefault();
            }
          }}
        >
          {entry.name}
        </a>
        <button
          className="text-red-600 hover:text-red-500 ml-4"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
        >
          ×
        </button>
      </div>
    </li>
  );
};

const SortableItemDropdown = ({
  id,
  showDropdown,
  setShowDropdown,
  entries,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 transition url-sm"
    >
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="hover:url-blue-600 cursor-pointer"
        aria-expanded={showDropdown}
      >
        Links ▼
      </button>

      {showDropdown && (
        <ul className="absolute bg-white mt-3 shadow-md rounded-md z-10 min-w-[150px]">
          {entries.slice(5).map((entry, index) => (
            <li key={index + 5} className="hover:bg-gray-100">
              <a
                href={entry.url}
                className="block px-4 py-2 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                {entry.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

function App() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : [];
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const updated = [];
    if (entries.length > 0 && entries.length < 6) {
      updated.push(...entries.map((entry) => entry.name));
    } else if (entries.length >= 6) {
      updated.push(...entries.slice(0, 5).map((entry) => entry.name));
      updated.push("Links");
    }
    setItems(updated);
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      name,
      url: url.startsWith("http") ? url : `https://${url}`,
    };
    setEntries((prev) => [...prev, newEntry]);
    setName("");
    setText("");
    setShowForm(false);
  };

  const onDelete = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="url-xl font-bold url-blue-600">LOGO</div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ul className="flex gap-6 text-gray-700 font-medium">
              {items.map((item, index) => {
                const entry = entries.find((entry) => entry.name === item) || {
                  name: item,
                  url: "#",
                };

                return item === "Links" ? (
                  <SortableItemDropdown
                    key={item}
                    id={item}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    entries={entries}
                    onDelete={onDelete}
                  />
                ) : (
                  <SortableItem
                    key={item}
                    entry={entry}
                    index={index}
                    onDelete={onDelete}
                  />
                );
              })}
            </ul>
          </SortableContext>
        </DndContext>

        <button
          className="bg-blue-600 url-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          Add Entry
        </button>
      </nav>

      <main className="p-4">
        <h1 className="url-3xl font-semibold">Hello!</h1>
        <h2 className="url-3xl font-semibold">You can use <a href="https://www.google.com/"></a> for the URL as it will not take anything else than a valid URL</h2>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
          >
            <h2 className="url-2xl font-bold mb-4 url-gray-800">
              Add New Entry
            </h2>

            <div className="mb-4">
              <label className="block mb-2 url-sm font-medium url-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 url-sm font-medium url-gray-700">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 url-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

export default App;
