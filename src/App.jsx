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
import LinkComponent from "./components/LinkComponent";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
            <LinkComponent
              index={index}
              entry={entry}
              onDelete={onDelete}
            ></LinkComponent>
          ))}
        </ul>
      )}
    </li>
  );
};

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : [];
  });
  const [items, setItems] = useState([]);

  useGSAP(() => {
    const timeline = gsap.timeline();

    timeline.from("nav", {
      y: -20,
      opacity: 0,
      duration: 1,
      delay: 0.2,
    });
    
    timeline.from("nav div", {
      y: -20,
      opacity: 0,
      duration: 1,
      delay: 0.2,
    });
    timeline.from("nav ul", {
      y: -20,
      opacity: 0,
      duration: 1,
      stagger: 0.5,
    });

    timeline.from("section h1", {
      y: 50,
      opacity: 0,
      duration: 1,
    });

    timeline.from("section h2", {
      y: 50,
      opacity: 0,
      duration: 1,
    });
  });

  useGSAP(() => {
    gsap.to(".logo", {
      rotate: 360,
      duration: 0.5,
      repeat: -1,
      delay: 3,
      repeatDelay: 3, // 3s delay + 1s duration = 4s total cycle
      ease: "none",
    });
  }, []);

  useGSAP(() => {
    const timeline = gsap.timeline();

    if (showForm) {
      timeline.from("form", {
        y: -30,
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [showForm]);

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
    <main className="bg-white text-black min-h-screen w-full font">
      <div className="w-full h-10/12">
        <nav className="fixed top-0 left-0 right-0 bg-white z-50 px-8 py-6 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <div className="logo text-xl font-bold text-blue-700">LOGO</div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <ul className="flex gap-6 text-black font-medium">
                {items.map((item, index) => {
                  const entry = entries.find(
                    (entry) => entry.name === item
                  ) || {
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
            className="bg-blue-600 text-white px-2 py-3 rounded-xl shadow-lg hover:bg-blue-700 text-sm min-w-[150px] cursor-pointer"
            onClick={() => setShowForm(!showForm)}
          >
            Add Entry
          </button>
        </nav>

        <section className="pt-28 p-6 flex flex-col justify-center items-center mt-4">
          <h1 className="text-3xl font-semibold mb-2">Hello!</h1>
          <h2 className="text-lg mb-4">
            You can use
            <a
              className="text-red-500 underline mx-1.5"
              href="https://www.google.com/"
            >
              https://www.google.com/
            </a>
            for the URL as it will not take anything else than a valid URL.
          </h2>
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg flex flex-col justify-center"
            >
              <h2 className=" text-center text-2xl font-bold mb-4">
                Add New Entry
              </h2>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              >
                Submit
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
