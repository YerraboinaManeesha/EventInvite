export default function TimelineEditor({ items, onChange }) {
  function updateItem(index, key, value) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function addItem() {
    onChange([...items, { time: '', title: '', description: '' }]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="repeatable">
      {items.map((item, i) => (
        <div className="repeatable-row" key={i}>
          <input
            placeholder="Time (e.g. 4:00 PM)"
            value={item.time}
            onChange={(e) => updateItem(i, 'time', e.target.value)}
            style={{ maxWidth: 140 }}
          />
          <input
            placeholder="Title (e.g. Ceremony)"
            value={item.title}
            onChange={(e) => updateItem(i, 'title', e.target.value)}
          />
          <input
            placeholder="Description (optional)"
            value={item.description}
            onChange={(e) => updateItem(i, 'description', e.target.value)}
          />
          <button type="button" className="remove-btn" onClick={() => removeItem(i)}>&times;</button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addItem}>+ Add schedule item</button>

      <style>{`
        .repeatable { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
        .repeatable-row { display: flex; gap: 8px; align-items: center; }
        .repeatable-row input {
          flex: 1; padding: 9px 11px; border-radius: 3px; border: 1px solid var(--site-line); background: #fff;
        }
        .repeatable-row input:focus { outline: none; border-color: var(--site-accent); }
        .remove-btn {
          border: none; background: none; font-size: 1.3rem; color: #A33; cursor: pointer; line-height: 1; padding: 0 6px;
        }
        .add-btn {
          align-self: flex-start; background: none; border: 1px dashed var(--site-line); color: var(--site-accent);
          padding: 8px 14px; border-radius: 3px; font-size: 0.85rem; margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
