/* ==========================================================================
   Landing v3: live world maps (hero card + "Good company" section)
   ----------------------------------------------------------------------
   Reads live numbers from the site-stats Cloudflare Worker (site-stats/,
   Google Analytics realtime + 2026 so far) and refreshes them every minute
   while the tab is open. If the Worker can't be reached it falls back to
   /data/site-stats.json (refreshed daily by
   .github/workflows/update-site-stats.yml). Pins each country on
   assets/premium-pb-assets/world-countries.svg in every [data-map] card, and fills the
   "Good company" total, country list and notes. If the data can't load,
   the maps still show, just without pins, and the section keeps its
   placeholders.

   Card options (attributes on [data-map]):
     data-map-span="220,860"  x-range in map units always kept in view
     data-map-fit="cover"     fill the card's width, cropping the poles
     data-map-labels="1800"   show country names once a country covers at
                              least this many px² (bigger = fewer names)
     data-map-source="live"   show visitors from the last 30 minutes when
                              the live numbers are available
   An element marked [data-map-avoid] (the hero photostrip) is kept clear
   of pins.
   ========================================================================== */

(function () {
    "use strict";

    const STATS_API = window.PB_STATS_API || "https://site-stats.photobooth-io.workers.dev/stats";
    const DATA_URL = "/data/site-stats.json";
    const REFRESH_MS = 60 * 1000;        // the Worker's realtime cache is 60s
    const FALLBACK_REFRESH_MS = 5 * 60 * 1000;
    const MAX_BUBBLES = 50; // every country in the data, like GA's map
    const LIST_MAX = 7;     // rows in the "Good company" list
    const FRAME_TOP = 7;    // the map is framed around the biggest countries

    // world-countries.svg is a Miller projection, 1000 x 466 units.
    const MAP_W = 1000;
    const MAP_H = 466;
    const EDGE_PAD = 34; // px kept clear between pins and the card's right edge
    const V_PAD = 26;    // px kept clear above/below pins when cropping

    // Country anchor points [x, y] in map units, keyed by ISO 3166-1 alpha-2
    // (GA4 `countryId`). Centroid of each country's largest landmass.
    const ANCHORS = {
        AD:[504,166], AE:[651,224], AF:[683,194], AG:[328,244], AI:[325,240], AL:[556,171],
        AM:[625,173], AO:[549,326], AQ:[731,615], AR:[320,392], AS:[26,332], AT:[539,148], AU:[843,326],
        AW:[306,257], AX:[555,100], AZ:[632,173], BA:[549,160], BB:[335,255], BD:[751,224],
        BE:[513,138], BF:[495,257], BG:[570,165], BH:[640,218], BI:[583,301], BJ:[506,265],
        BL:[325,241], BM:[320,199], BN:[818,279], BO:[320,338], BR:[352,321], BS:[283,222],
        BT:[751,214], BW:[566,354], BY:[578,127], BZ:[254,243], CA:[225,107], CD:[566,300],
        CF:[557,273], CG:[542,294], CH:[523,151], CI:[485,270], CK:[56,351], CL:[303,391], CM:[535,276],
        CN:[787,185], CO:[297,281], CR:[266,264], CU:[281,231], CV:[434,249], CW:[308,258],
        CY:[592,191], CZ:[543,141], DE:[529,136], DJ:[618,259], DK:[526,116], DM:[330,248],
        DO:[304,239], DZ:[507,212], EC:[282,296], EE:[572,107], EG:[583,216], EH:[466,223],
        ER:[608,249], ES:[490,173], ET:[610,268], FI:[573,83], FJ:[994,342], FK:[337,450], FM:[940,272],
        FO:[481,92], FR:[507,152], GA:[533,293], GB:[493,126], GD:[329,258], GE:[621,167], GG:[493,142],
        GH:[497,270], GL:[384,40], GM:[457,254], GN:[470,263], GQ:[529,287], GR:[563,176], GS:[398,460],
        GT:[249,248], GU:[902,254], GW:[459,258], GY:[336,278], HK:[817,228], HM:[704,455],
        HN:[259,250], HR:[546,157], HT:[298,238], HU:[554,150], ID:[817,292], IE:[477,128],
        IL:[597,201], IM:[487,124], IN:[721,227], IO:[701,312], IQ:[622,197], IR:[651,198], IS:[448,80],
        IT:[534,163], JE:[494,143], JM:[285,241], JO:[602,202], JP:[883,185], KE:[605,290],
        KG:[707,169], KH:[791,256], KI:[63,286], KM:[620,324], KN:[326,243], KP:[853,174], KR:[855,186],
        KW:[632,208], KY:[274,237], KZ:[687,146], LA:[788,240], LB:[600,194], LC:[331,253],
        LI:[526,150], LK:[724,270], LR:[474,274], LS:[578,376], LT:[566,120], LU:[517,141],
        LV:[569,114], LY:[550,215], MA:[476,206], MC:[521,162], MD:[579,150], ME:[553,165],
        MF:[325,241], MG:[630,346], MH:[976,272], MK:[560,169], ML:[490,243], MM:[768,232],
        MN:[786,151], MO:[815,229], MP:[905,249], MR:[471,235], MS:[327,245], MT:[540,187],
        MU:[660,349], MV:[704,280], MW:[595,329], MX:[216,224], MY:[819,282], MZ:[599,340],
        NA:[548,354], NC:[960,352], NE:[526,243], NF:[967,375], NG:[522,265], NI:[264,256],
        NL:[516,131], NO:[534,85], NP:[733,211], NR:[964,293], NU:[28,345], NZ:[974,422], OM:[656,234],
        PA:[277,268], PE:[293,317], PF:[85,341], PG:[901,310], PH:[837,247], PK:[692,206], PL:[554,132],
        PM:[344,151], PN:[144,361], PR:[315,240], PS:[598,200], PT:[478,175], PW:[874,271],
        PY:[338,357], QA:[642,220], RO:[569,155], RS:[558,160], RU:[765,75], RW:[583,297], SA:[624,223],
        SB:[945,318], SC:[654,305], SD:[583,247], SE:[545,91], SG:[788,288], SH:[484,336], SI:[541,154],
        SK:[554,144], SL:[467,268], SM:[535,161], SN:[460,251], SO:[627,278], SR:[345,280],
        SS:[584,271], ST:[518,291], SV:[253,253], SX:[325,241], SY:[607,190], SZ:[587,367],
        TC:[301,230], TD:[552,249], TF:[693,441], TG:[503,268], TH:[781,249], TJ:[697,179],
        TL:[850,316], TM:[665,177], TN:[527,193], TO:[13,351], TR:[598,177], TT:[330,263], TW:[836,224],
        TZ:[597,309], UA:[587,143], UG:[590,288], US:[225,175], UY:[344,386], UZ:[676,168],
        VA:[535,168], VC:[330,255], VE:[316,272], VG:[320,240], VI:[320,242], VN:[795,245],
        VU:[963,334], WF:[5,332], WS:[21,330], XK:[558,166], YE:[632,247], ZA:[570,374], ZM:[577,329],
        ZW:[583,345]
    };

    // Country name labels: [code, name, x, y, area of largest landmass in
    // map units²], biggest first so large countries win label space.
    const LABELS = [
        ["RU","Russia",766,75,34467], ["CA","Canada",228,108,14481], ["GL","Greenland",383,40,10597],
        ["CN","China",787,185,8488], ["US","United States",226,175,7645], ["AU","Australia",873,364,5694],
        ["BR","Brazil",352,321,5581], ["KZ","Kazakhstan",687,146,3269], ["AR","Argentina",320,392,2434],
        ["IN","India",721,227,2267], ["DZ","Algeria",507,212,1789], ["MN","Mongolia",786,151,1773],
        ["CD","DRC",565,300,1466], ["MX","Mexico",216,224,1435], ["SA","Saudi Arabia",624,223,1399],
        ["IR","Iran",651,198,1338], ["SD","Sudan",583,247,1239], ["LY","Libya",550,215,1237],
        ["SE","Sweden",545,91,963], ["ZA","South Africa",570,374,947], ["TD","Chad",552,249,848],
        ["PE","Peru",293,317,842], ["ML","Mali",490,243,836], ["AO","Angola",549,326,807],
        ["NE","Niger",526,243,800], ["FI","Finland",573,83,795], ["NO","Norway",534,84,771],
        ["EG","Egypt",583,216,749], ["MR","Mauritania",471,235,733], ["BO","Bolivia",320,338,731],
        ["CO","Colombia",297,281,727], ["TR","Türkiye",598,177,725], ["ET","Ethiopia",610,268,724],
        ["CL","Chile",302,396,705], ["UA","Ukraine",587,143,704], ["PK","Pakistan",692,206,692],
        ["FR","France",507,152,627], ["TZ","Tanzania",597,309,591], ["NA","Namibia",548,354,587],
        ["NG","Nigeria",522,265,581], ["VE","Venezuela",316,272,578], ["AF","Afghanistan",683,194,552],
        ["MZ","Mozambique",599,340,550], ["ZM","Zambia",577,329,493], ["ES","Spain",490,173,486],
        ["MM","Myanmar",768,233,477], ["DE","Germany",529,136,469], ["MA","Morocco",476,206,468],
        ["UZ","Uzbekistan",676,168,462], ["TM","Turkmenistan",665,177,452], ["PL","Poland",554,132,422],
        ["BW","Botswana",566,354,420], ["MG","Madagascar",630,346,407], ["SS","South Sudan",584,271,397],
        ["CF","C. African Rep.",557,273,394], ["KE","Kenya",605,290,371], ["IQ","Iraq",622,197,364],
        ["GB","United Kingdom",493,126,345], ["TH","Thailand",781,250,339], ["ID","Indonesia",817,292,333],
        ["SO","Somalia",627,278,306], ["YE","Yemen",632,247,304], ["BY","Belarus",578,127,298],
        ["CM","Cameroon",535,276,291], ["PY","Paraguay",338,357,289], ["IT","Italy",534,163,276],
        ["RO","Romania",569,155,266], ["JP","Japan",880,187,260], ["ZW","Zimbabwe",583,345,258],
        ["IS","Iceland",448,79,258], ["PG","Papua New Guinea",901,310,255], ["VN","Vietnam",795,245,227],
        ["OM","Oman",656,234,215], ["CG","Congo",542,294,213], ["CI","Côte d'Ivoire",484,271,210],
        ["KG","Kyrgyzstan",707,169,195], ["BF","Burkina Faso",495,257,177], ["GA","Gabon",532,293,169],
        ["NZ","New Zealand",974,422,163], ["SY","Syria",607,190,160], ["EC","Ecuador",282,296,157],
        ["LA","Laos",788,240,156], ["GH","Ghana",497,270,155], ["GN","Guinea",469,263,154],
        ["UG","Uganda",590,288,154], ["UY","Uruguay",344,386,147], ["TN","Tunisia",526,193,133],
        ["GY","Guyana",336,278,132], ["SN","Senegal",460,251,128], ["TJ","Tajikistan",697,179,128],
        ["MY","Malaysia",819,282,128], ["KP","North Korea",853,174,121], ["KH","Cambodia",791,256,119],
        ["NP","Nepal",733,211,116], ["GR","Greece",563,176,116], ["BG","Bulgaria",570,165,113],
        ["HU","Hungary",554,150,107], ["LV","Latvia",569,114,103], ["CZ","Czechia",543,141,102],
        ["AT","Austria",539,148,100], ["BD","Bangladesh",751,224,97], ["LT","Lithuania",566,120,97],
        ["SR","Suriname",345,280,91], ["PT","Portugal",478,176,89], ["KR","South Korea",855,186,88],
        ["NI","Nicaragua",264,256,85], ["AZ","Azerbaijan",632,173,83], ["IE","Ireland",478,128,82],
        ["CU","Cuba",281,231,81], ["RS","Serbia",558,160,81], ["ER","Eritrea",607,248,79],
        ["EE","Estonia",572,107,78], ["PH","Philippines",838,248,77], ["HN","Honduras",259,250,75],
        ["BJ","Benin",506,265,75], ["GT","Guatemala",249,248,73], ["MW","Malawi",595,328,73],
        ["JO","Jordan",602,202,72], ["EH","W. Sahara",466,223,70], ["GE","Georgia",621,167,70],
        ["HR","Croatia",546,157,63], ["LR","Liberia",474,274,62], ["AE","UAE",651,224,58],
        ["SK","Slovakia",554,144,57], ["NL","Netherlands",515,131,55], ["BA","Bosnia",550,160,54],
        ["CH","Switzerland",523,151,53], ["DK","Denmark",526,116,52], ["SL","Sierra Leone",467,268,49],
        ["PA","Panama",277,268,48], ["LK","Sri Lanka",724,270,42]
    ];

    // GA-style short numbers: 4.7M, 678K, 92K, 8.4K.
    const compactWhole = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 0 });
    const compactOne = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
    const formatCompact = { format: n => (n >= 1e6 || n < 1e4 ? compactOne : compactWhole).format(n) };
    const formatDate = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

    // Every valid country row, biggest first.
    function cleanCountries(data) {
        const rows = data && Array.isArray(data.topCountries) ? data.topCountries : [];
        return rows
            .filter(row => row && typeof row.code === "string" && /^[A-Za-z]{2}$/.test(row.code) &&
                typeof row.name === "string" && Number.isFinite(row.activeUsers) && row.activeUsers > 0)
            .map(row => ({ code: row.code.toUpperCase(), name: row.name, users: row.activeUsers }))
            .sort((a, b) => b.users - a.users);
    }

    // The ones we can place on the map.
    function mappable(countries) {
        return countries.filter(row => {
            const point = ANCHORS[row.code];
            return point && point[0] >= 0 && point[0] <= MAP_W && point[1] >= 0 && point[1] <= MAP_H;
        }).slice(0, MAX_BUBBLES);
    }

    function periodOf(obj) {
        const p = obj && obj.period;
        return p && typeof p.label === "string" ? p : null;
    }

    // "Jan 1 to Oct 21, 2026"
    function formatRange(period) {
        const start = period && Date.parse(period.startDate);
        const end = period && Date.parse(period.endDate);
        if (!start || !end) return period ? period.label : "";
        const startText = formatDate.format(start).replace(/, \d{4}$/, "");
        return startText + " to " + formatDate.format(end);
    }

    function createMap(card) {
        const map = card.querySelector("[data-map-land]");
        const avoid = card.querySelector("[data-map-avoid]");
        const decor = card.querySelector("[data-map-decor]");
        const pinsLayer = card.querySelector("[data-map-pins]");
        const callout = card.querySelector("[data-map-callout]");
        const srList = card.querySelector("[data-map-list]");
        const caption = card.querySelector("[data-map-caption]");
        const cover = card.dataset.mapFit === "cover";
        const span = (card.dataset.mapSpan || "220,860").split(",").map(Number);
        const labelArea = Number(card.dataset.mapLabels) || 0;
        let labelsLayer = null;
        if (labelArea && map) {
            labelsLayer = document.createElement("div");
            labelsLayer.className = "pb-map-labels";
            labelsLayer.setAttribute("aria-hidden", "true");
            map.after(labelsLayer);
        }

        let countries = [];
        let pins = [];
        let frame = null;
        let activeIndex = 0;

        // Scale and offset the map so the pins (and the card's span) fill
        // the area right of any [data-map-avoid] element.
        function layout() {
            const width = card.clientWidth;
            const height = card.clientHeight;
            if (!width || !height || !map) return;

            const cardLeft = card.getBoundingClientRect().left;
            const start = avoid ? avoid.getBoundingClientRect().right - cardLeft + 12 : 16;
            const usable = Math.max(width - start - (avoid ? EDGE_PAD : 16), width * 0.4);

            let minX = span[0], maxX = span[1];
            let minY = MAP_H, maxY = 0;
            countries.slice(0, FRAME_TOP).forEach(c => {
                const [x, y] = ANCHORS[c.code];
                minX = Math.min(minX, x); maxX = Math.max(maxX, x);
                minY = Math.min(minY, y); maxY = Math.max(maxY, y);
            });

            let scale, top;
            if (cover) {
                // Fill the width; crop the poles but never a pin.
                scale = usable / (maxX - minX);
                if (maxY > minY) scale = Math.min(scale, (height - 2 * V_PAD) / (maxY - minY));
                top = height / 2 - (MAP_H / 2) * scale;
                // Keep every pin at least V_PAD from the top and bottom edges.
                if (maxY >= minY) top = clamp(top, V_PAD - minY * scale, height - V_PAD - maxY * scale);
            } else {
                scale = Math.min(height / MAP_H, usable / (maxX - minX));
                top = (height - MAP_H * scale) / 2;
            }
            const left = start + (usable - (maxX - minX) * scale) / 2 - minX * scale;
            frame = { scale, left, top };

            map.style.left = left + "px";
            map.style.top = top + "px";
            map.style.width = MAP_W * scale + "px";
            card.classList.add("is-framed");

            // GA-style bubbles: area grows with visitors, capped by card size.
            const most = countries.length ? countries[0].users : 1;
            const maxSize = clamp(width * 0.055, 14, 44);
            pins.forEach((pin, i) => {
                const [x, y] = ANCHORS[countries[i].code];
                pin.style.left = left + x * scale + "px";
                pin.style.top = top + y * scale + "px";
                const size = 6 + (maxSize - 6) * Math.sqrt(countries[i].users / most);
                pin.style.setProperty("--pin-size", size.toFixed(1) + "px");
            });
            // Callout first so the second photo can keep clear of it.
            placeCallout(activeIndex);
            placeDecor(scale, left, top, width, height, cardLeft);
            placeLabels(scale, left, top, width, height, cardLeft);
        }

        // Centre the [data-map-decor] photo on its "x,y" map point, sliding it
        // sideways if it would cover one of the top countries or the main
        // strip. Hide it when no nearby spot is clear.
        function placeDecor(scale, left, top, width, height, cardLeft) {
            if (!decor) return;
            const w = decor.offsetWidth;
            const h = decor.offsetHeight;
            if (!w || !h) return;
            const [dx, dy] = decor.dataset.mapDecor.split(",").map(Number);
            const y = clamp(top + dy * scale - h / 2, 8, height - h - 8);
            const pad = h * 0.06 + 4; // the tilt widens the photo a little

            const blocks = pins.slice(0, FRAME_TOP).map(pin => {
                const px = parseFloat(pin.style.left);
                const py = parseFloat(pin.style.top);
                const r = pin.offsetWidth / 2;
                return [px - r, py - r, px + r, py + r];
            });
            if (avoid) {
                const r = avoid.getBoundingClientRect();
                blocks.push([r.left - cardLeft, 0, r.right - cardLeft, height]);
            }
            const cardTop = card.getBoundingClientRect().top;
            [callout, caption].forEach(el => {
                if (!el || el.hidden) return;
                const r = el.getBoundingClientRect();
                blocks.push([r.left - cardLeft, r.top - cardTop, r.right - cardLeft, r.bottom - cardTop]);
            });
            const clear = x => x - pad >= 4 && x + w + pad <= width - 4 &&
                !blocks.some(b => b[0] < x + w + pad && b[2] > x - pad && b[1] < y + h + pad && b[3] > y - pad);

            const ideal = left + dx * scale - w / 2;
            let x = null;
            for (let shift = 0; shift <= w * 1.2 && x === null; shift += 2) {
                if (clear(ideal - shift)) x = ideal - shift;
                else if (clear(ideal + shift)) x = ideal + shift;
            }
            decor.classList.toggle("is-off", x === null);
            if (x === null) return;
            decor.style.left = x + "px";
            decor.style.top = y + "px";
        }

        // Country names where they fit, biggest countries first, never
        // overlapping each other or the photostrips.
        function placeLabels(scale, left, top, width, height, cardLeft) {
            if (!labelsLayer) return;
            const taken = [];
            if (avoid) {
                const r = avoid.getBoundingClientRect();
                taken.push([r.left - cardLeft - 6, 0, r.right - cardLeft + 6, height]);
            }
            if (decor && !decor.classList.contains("is-off")) {
                const r = decor.getBoundingClientRect();
                const cardTop = card.getBoundingClientRect().top;
                taken.push([r.left - cardLeft - 4, r.top - cardTop - 4, r.right - cardLeft + 4, r.bottom - cardTop + 4]);
            }
            // Keep names off the caption and map credit along the bottom.
            const cardTop = card.getBoundingClientRect().top;
            card.querySelectorAll(".pb-hero-caption, .pb-world-credit").forEach(el => {
                const r = el.getBoundingClientRect();
                taken.push([r.left - cardLeft, r.top - cardTop, r.right - cardLeft, r.bottom - cardTop]);
            });
            const minArea = labelArea / (scale * scale);
            const items = [];
            for (const [, name, x, y, area] of LABELS) {
                if (area < minArea) break;
                const px = left + x * scale;
                const py = top + y * scale;
                const w = name.length * 5.4 + 4; // ~10px Inter
                const box = [px - w / 2, py - 7, px + w / 2, py + 7];
                if (box[0] < 6 || box[2] > width - 6 || box[1] < 6 || box[3] > height - 6) continue;
                if (taken.some(t => box[0] < t[2] + 4 && box[2] > t[0] - 4 && box[1] < t[3] + 2 && box[3] > t[1] - 2)) continue;
                taken.push(box);
                const label = document.createElement("span");
                label.className = "pb-map-label";
                label.textContent = name;
                label.style.left = px + "px";
                label.style.top = py + "px";
                items.push(label);
            }
            labelsLayer.replaceChildren(...items);
        }

        function placeCallout(index) {
            if (!callout || !frame || !countries[index]) return;
            const country = countries[index];
            const [x, y] = ANCHORS[country.code];
            const px = frame.left + x * frame.scale;
            const py = frame.top + y * frame.scale;

            callout.firstElementChild.textContent = country.name;
            callout.lastElementChild.textContent = formatCompact.format(country.users);
            callout.hidden = false;

            const W = card.clientWidth;
            const H = card.clientHeight;
            const boxW = callout.offsetWidth;
            const boxH = callout.offsetHeight;
            const EDGE = 8;
            const gap = (pins[index] ? pins[index].offsetWidth / 2 : 5) + 3; // clear of the dot
            let side, left, top;

            // Prefer the label to the right of the dot, then above, below, left.
            let leader = 26;
            if (px + gap + leader + boxW <= W - EDGE) {
                side = "right";
                left = px + gap + leader;
                top = clamp(py - boxH / 2, EDGE, H - boxH - EDGE);
            } else if (py - gap - 14 - boxH >= EDGE) {
                side = "above";
                top = Math.max(EDGE, py - gap - leader - boxH);
                leader = py - gap - (top + boxH);
                left = clamp(px - boxW / 2, EDGE, W - boxW - EDGE);
            } else if (py + gap + 14 + boxH <= H - EDGE) {
                side = "below";
                top = Math.min(H - boxH - EDGE, py + gap + leader);
                leader = top - (py + gap);
                left = clamp(px - boxW / 2, EDGE, W - boxW - EDGE);
            } else {
                side = "left";
                leader = Math.max(10, Math.min(leader, px - gap - boxW - EDGE));
                left = px - gap - leader - boxW;
                top = clamp(py - boxH / 2, EDGE, H - boxH - EDGE);
            }

            ["right", "above", "below", "left"].forEach(name => callout.classList.toggle("is-" + name, name === side));
            callout.style.left = left + "px";
            callout.style.top = top + "px";
            callout.style.setProperty("--leader", leader + "px");
            // Where the line meets the label, so it always points at the dot even
            // when the label is nudged to stay inside the card.
            callout.style.setProperty("--leader-x", clamp(px - left, 6, boxW - 6) + "px");
            callout.style.setProperty("--leader-y", clamp(py - top, 6, boxH - 6) + "px");
        }

        // Safe to call again with new numbers; only the first draw animates.
        function render(list, captionText) {
            if (!list.length) return;
            if (countries.length) card.classList.add("is-settled");
            countries = list;
            activeIndex = 0;
            pins = countries.map((country, i) => {
                const pin = document.createElement("span");
                pin.className = "pb-pin" + (i === 0 ? " is-top" : "");
                pin.style.animationDelay = Math.min(i, 12) * 40 + "ms";
                pin.title = country.name + ": " + formatCompact.format(country.users) + " visitors";
                pin.addEventListener("pointerenter", () => { activeIndex = i; placeCallout(i); });
                pin.addEventListener("pointerleave", event => {
                    // A tap fires leave right after enter; keep the tapped country shown.
                    if (event.pointerType === "touch") return;
                    activeIndex = 0;
                    placeCallout(0);
                });
                return pin;
            });
            pinsLayer.replaceChildren(...pins);

            if (caption && captionText) caption.textContent = captionText;
            if (caption) caption.classList.toggle("is-live", card.classList.contains("is-live"));

            if (srList) {
                srList.replaceChildren(...countries.slice(0, LIST_MAX).map(country => {
                    const item = document.createElement("li");
                    item.textContent = country.name + ": " + formatCompact.format(country.users) + " visitors";
                    return item;
                }));
            }
            layout();
        }

        layout();
        // The photostrip boxes are sized by CSS, but an <img> used directly
        // only has its size once loaded.
        [avoid, decor].forEach(el => {
            if (el && el.tagName === "IMG" && !el.complete) el.addEventListener("load", layout, { once: true });
        });
        if ("ResizeObserver" in window) new ResizeObserver(layout).observe(card);
        else window.addEventListener("resize", layout);
        // The label's width changes once the web font arrives; re-measure then.
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

        // On the live site, Ezoic auto-ads insert ad wrappers inside the card
        // (after its <p> elements). The card clips its content, so an injected
        // ad either stretches the card or ends up hidden under the map. Move
        // anything that isn't part of the map to just after its section, where
        // the ad still shows and the map keeps its size.
        const own = new Set(card.children);
        let landing = card.closest("section") || card;
        function evictForeign() {
            for (const child of [...card.children]) {
                if (own.has(child)) continue;
                landing.after(child);
                landing = child;
            }
        }
        evictForeign();
        if ("MutationObserver" in window) new MutationObserver(evictForeign).observe(card, { childList: true });

        return { render, live: card.dataset.mapSource === "live", card, caption };
    }

    // "Good company" section: yearly total, country list and notes.
    function renderWorld(data, countries) {
        const section = document.querySelector("[data-world]");
        if (!section) return;
        const set = (selector, text) => {
            const el = section.querySelector(selector);
            if (el && text) { el.textContent = text; el.hidden = false; }
        };

        const countryPeriod = periodOf(data);
        const total = data.total && Number.isFinite(data.total.activeUsers) && data.total.activeUsers > 0 ? data.total : null;
        const totalPeriod = periodOf(total);

        if (total) {
            set("[data-world-total]", formatCompact.format(total.activeUsers));
            if (totalPeriod) {
                set("[data-world-total-label]", "visitors in " + totalPeriod.label);
                set("[data-world-total-range]", "From Google Analytics, " + formatRange(totalPeriod));
            }
        }
        if (countryPeriod) set("[data-world-period]", countryPeriod.label);

        const table = section.querySelector("[data-world-list]");
        if (table && countries.length) {
            const top = countries[0].users;
            table.replaceChildren(...countries.slice(0, LIST_MAX).map(country => {
                const row = document.createElement("li");
                row.className = "pb-world-row";
                const name = document.createElement("span");
                name.textContent = country.name;
                const value = document.createElement("strong");
                value.textContent = formatCompact.format(country.users);
                const bar = document.createElement("span");
                bar.className = "pb-world-bar";
                bar.style.width = Math.max(3, (country.users / top) * 100).toFixed(1) + "%";
                bar.setAttribute("aria-hidden", "true");
                row.append(name, value, bar);
                return row;
            }));
        }

        const live = liveOf(data);
        set("[data-world-live]", live && live.activeUsers > 0
            ? formatCompact.format(live.activeUsers) + " people here in the last 30 minutes" : "");
        const liveChip = section.querySelector("[data-world-live]");
        if (liveChip && !(live && live.activeUsers > 0)) liveChip.hidden = true;

        const updated = Date.parse(data.updatedAt);
        if (live) {
            set("[data-world-source]", "Live from Google Analytics. The live count refreshes every minute and the " +
                (countryPeriod ? countryPeriod.label + " " : "") + "numbers every 15 minutes.");
        } else if (data.source === "google-analytics" && updated) {
            set("[data-world-source]", "Numbers come from Google Analytics and refresh once a day. Last updated " +
                formatDate.format(updated) + ".");
        } else if (updated) {
            set("[data-world-source]", "These are sample numbers from " + formatDate.format(updated) +
                ". Live numbers show up after the first daily update.");
        }
        if (total && totalPeriod && countryPeriod && totalPeriod.label !== countryPeriod.label) {
            set("[data-world-period-note]", "Heads up: the country list covers " + countryPeriod.label.toLowerCase() +
                ", while the total covers " + totalPeriod.label + ".");
        }
    }

    function liveOf(data) {
        const live = data && data.realtime;
        return live && Number.isFinite(live.activeUsers) ? live : null;
    }

    function apply(data) {
        const countries = cleanCountries(data);
        const onMap = mappable(countries);
        const period = periodOf(data);
        const live = liveOf(data);
        const liveOnMap = live ? mappable(cleanCountries({ topCountries: live.countries })) : [];

        maps.forEach(m => {
            const useLive = m.live && liveOnMap.length > 0;
            m.card.classList.toggle("is-live", useLive);
            const base = m.caption ? m.caption.dataset.mapCaption : "";
            const text = useLive
                ? "Live · " + formatCompact.format(live.activeUsers) + " visitors in the last 30 min"
                : base && period ? base + " · " + period.label : base;
            m.render(useLive ? liveOnMap : onMap, text);
        });
        renderWorld(data, countries);
    }

    function getJSON(url, timeoutMs) {
        const controller = "AbortController" in window ? new AbortController() : null;
        const timer = controller && setTimeout(() => controller.abort(), timeoutMs);
        return fetch(url, controller ? { signal: controller.signal } : undefined)
            .then(response => (response.ok ? response.json() : Promise.reject(response.status)))
            .finally(() => clearTimeout(timer));
    }

    const maps = [...document.querySelectorAll("[data-map]")].map(createMap);
    if (!maps.length && !document.querySelector("[data-world]")) return;

    let lastLoad = 0;
    let apiDown = false;
    let loading = false;

    async function load() {
        if (loading) return;
        loading = true;
        lastLoad = Date.now();
        try {
            let data = null;
            try {
                data = await getJSON(STATS_API, 6000);
                apiDown = !data || !Array.isArray(data.topCountries);
            } catch (error) {
                apiDown = true;
            }
            if (apiDown) data = await getJSON(DATA_URL, 8000);
            apply(data);
        } catch (error) {
            /* No pins; the maps still show. */
        } finally {
            loading = false;
        }
    }

    // Refresh while the tab is visible; catch up as soon as it's shown again.
    load();
    setInterval(() => {
        const wait = apiDown ? FALLBACK_REFRESH_MS : REFRESH_MS;
        if (document.visibilityState !== "hidden" && Date.now() - lastLoad >= wait - 1000) load();
    }, REFRESH_MS);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && Date.now() - lastLoad >= REFRESH_MS) load();
    });
})();
