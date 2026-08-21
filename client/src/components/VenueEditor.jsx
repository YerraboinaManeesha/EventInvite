export default function VenueEditor({ items, onChange }) {
  function updateItem(index, key, value) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function addItem() {
    onChange([...items, { label: '', name: '', address: '', note: '', mapUrl: '' }]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="venue-repeatable">
      {items.map((item, i) => (
        <div className="venue-block" key={i}>
          <div className="venue-block-head">
            <input
              placeholder="Label (e.g. Ceremony, Venue)"
              value={item.label}
              onChange={(e) => updateItem(i, 'label', e.target.value)}
            />
            <button type="button" className="remove-btn" onClick={() => removeItem(i)}>&times;</button>
          </div>
          <input
            placeholder="Venue name"
            value={item.name}
            onChange={(e) => updateItem(i, 'name', e.target.value)}
          />
          <input
            placeholder="Address"
            value={item.address}
            onChange={(e) => updateItem(i, 'address', e.target.value)}
          />
          <input
            placeholder="Note (e.g. parking, hotel info) — optional"
            value={item.note}
            onChange={(e) => updateItem(i, 'note', e.target.value)}
          />
          <input
            placeholder="Google Maps embed URL — optional"
            value={item.mapUrl}
            onChange={(e) => updateItem(i, 'mapUrl', e.target.value)}
          />
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addItem}>+ Add venue / location</button>

      <style>{`
        .venue-repeatable { display: flex; flex-direction: column; gap: 14px; margin-bottom: 8px; }
        .venue-block { display: flex; flex-direction: column; gap: 8px; padding: 14px; border: 1px solid var(--site-line); border-radius: 4px; background: #fff; }
        .venue-block-head { display: flex; gap: 8px; align-items: center; }
        .venue-block-head input { flex: 1; }
        .venue-block input {
          padding: 9px 11px; border-radius: 3px; border: 1px solid var(--site-line); background: #fff;
        }
        .venue-block input:focus { outline: none; border-color: var(--site-accent); }
        .remove-btn { border: none; background: none; font-size: 1.3rem; color: #A33; cursor: pointer; line-height: 1; padding: 0 6px; }
        .add-btn { align-self: flex-start; background: none; border: 1px dashed var(--site-line); color: var(--site-accent); padding: 8px 14px; border-radius: 3px; font-size: 0.85rem; }
      `}</style>
    </div>
  );
}
