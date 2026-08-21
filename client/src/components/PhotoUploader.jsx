function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhotoUploader({ photos, onChange }) {
  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    onChange([...photos, ...dataUrls]);
    e.target.value = ''; // allow re-selecting the same file later
  }

  function removePhoto(index) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="photo-grid">
        {photos.map((src, i) => (
          <div className="photo-thumb" key={i}>
            <img src={src} alt={`Upload ${i + 1}`} />
            <button type="button" className="photo-remove" onClick={() => removePhoto(i)}>&times;</button>
          </div>
        ))}
        <label className="photo-add">
          <input type="file" accept="image/*" multiple onChange={handleFiles} hidden />
          <span>+ Add Photos</span>
        </label>
      </div>
      <p className="hint">Tapping "Add Photos" opens your device's photo gallery / file picker.</p>

      <style>{`
        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-bottom: 6px; }
        .photo-thumb { position: relative; aspect-ratio: 1/1; border-radius: 4px; overflow: hidden; border: 1px solid var(--site-line); }
        .photo-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .photo-remove {
          position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; border-radius: 50%;
          background: rgba(0,0,0,0.6); color: #fff; border: none; font-size: 1rem; line-height: 1; cursor: pointer;
        }
        .photo-add {
          aspect-ratio: 1/1; border: 1px dashed var(--site-line); border-radius: 4px;
          display: flex; align-items: center; justify-content: center; text-align: center;
          font-size: 0.78rem; color: var(--site-accent); cursor: pointer; padding: 8px;
        }
        .photo-add:hover { border-color: var(--site-accent); }
      `}</style>
    </div>
  );
}
