// "Reorder Photos" section for customize pages - lets a user decide which
// captured photo lands in which slot before the strip is finalized. Reads
// and rewrites the same PhotoboothDB/images IndexedDB store every customize
// page already uses (order = insertion order, matching the existing
// convention - no schema change). Not wired into pages whose layout is
// flagged `reorderable: false` in the catalog (e.g. Student ID Card, which
// is a pick-1-of-N template with no concept of slot order).
function initPhotoReorder(containerEl, onReordered) {
    if (!containerEl) return;

    const section = containerEl.closest(".custom-options-container");

    function withStore(mode, callback) {
        const request = indexedDB.open("PhotoboothDB", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction(["images"], mode);
            callback(tx.objectStore("images"), tx);
        };
        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.errorCode);
        };
    }

    function load() {
        withStore("readonly", (store) => {
            const getAllReq = store.getAll();
            getAllReq.onsuccess = () => {
                render(getAllReq.result.map((item) => item.data));
            };
        });
    }

    function render(dataUrls) {
        // Nothing meaningful to reorder with 0 or 1 photo - hide the whole
        // section instead of showing a single disabled row.
        if (dataUrls.length <= 1) {
            if (section) section.style.display = "none";
            return;
        }
        if (section) section.style.display = "";

        containerEl.innerHTML = "";
        dataUrls.forEach((dataUrl, index) => {
            const item = document.createElement("div");
            item.className = "photo-reorder-item";
            item.innerHTML = `
                <span class="photo-reorder-badge">${photoReorderOrdinal(index + 1)}</span>
                <img src="${dataUrl}" alt="Captured photo ${index + 1}">
                <div class="photo-reorder-controls">
                    <button type="button" class="photo-reorder-btn" data-dir="up" aria-label="Move up"${index === 0 ? " disabled" : ""}>&#8593;</button>
                    <button type="button" class="photo-reorder-btn" data-dir="down" aria-label="Move down"${index === dataUrls.length - 1 ? " disabled" : ""}>&#8595;</button>
                </div>
            `;
            item.querySelector('[data-dir="up"]').addEventListener("click", () => move(dataUrls, index, index - 1));
            item.querySelector('[data-dir="down"]').addEventListener("click", () => move(dataUrls, index, index + 1));
            containerEl.appendChild(item);
        });
    }

    function move(dataUrls, fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= dataUrls.length) return;
        const reordered = dataUrls.slice();
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        persist(reordered);
    }

    function persist(dataUrls) {
        withStore("readwrite", (store, tx) => {
            store.clear();
            dataUrls.forEach((dataUrl) => store.add({ data: dataUrl }));
            tx.oncomplete = () => {
                render(dataUrls);
                if (typeof onReordered === "function") onReordered();
            };
        });
    }

    load();
}

function photoReorderOrdinal(n) {
    const suffixes = ["th", "st", "nd", "rd"];
    const mod100 = n % 100;
    return n + (suffixes[(mod100 - 20) % 10] || suffixes[mod100] || suffixes[0]);
}
