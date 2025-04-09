This is a React-based dynamic navigation bar where you can **add**, **delete**, and **reorder** links using drag and drop. It supports persistence with local storage and handles overflow by grouping extra links into a `Links` dropdown.

Built using:

- React
- TailwindCSS
- @dnd-kit/core
- @dnd-kit/sortable

##  Features

- Add links with custom names and URLs.
- Automatically groups extra links (after 5) into a `Links` dropdown.
- Drag-and-drop reorder of navigation items.
- Delete any link.
- Data is saved to local storage so it persists after refresh.

##  Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/your-username/draggable-navbar.git
cd draggable-navbar
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the app**

```bash
npm start
```

##  How It Works (Workflow)

### 1. State Management

- `entries`: Array of objects, each with `{ name, url }`.
- `items`: Array of item names (`entries.map(entry => entry.name)`) + `"Links"` if total items > 5.
- `showDropdown`: Boolean flag to toggle the dropdown.
- Stored in `localStorage`.

### 2. Adding Entries

- Click the "Add Entry" button.
- Fill in the `name` and `url` inputs.
- On submit:
  - A new `{ name, url }` is pushed to `entries`.
  - `items` gets recalculated to include new entry (up to 5) + `"Links"`.

### 3. Dropdown Handling

- If `entries.length > 5`, first 5 entries are shown directly.
- Remaining entries are bundled into a `Links ▼` dropdown.
- These are rendered using a separate component.

### 4. Drag-and-Drop Logic

- Uses `@dnd-kit/core` and `@dnd-kit/sortable`.
- You can drag items in the nav bar to reorder them.
- Items are reordered inside the `items` array, **not** `entries`, because:
  - `entries` hold the data.
  - `items` hold the order of display.

### 5. Deleting Links

- Each link item has a red cross (x) icon.
- Clicking it removes the item from `entries`.
- Automatically recalculates and updates the `items` array.

## Folder Structure

```
src/
├── App.js
├── App.css
├── index.js
└── components/
    └── LinkComponent.js (optional / not used in final app)
```

## Future Improvements

- Drag from dropdown (`Links`) as well.
- Sync order between `items` and `entries`.
- Add editing capability to existing links.
- Mobile responsiveness.

## Created By

-- Pulkit Sinha
