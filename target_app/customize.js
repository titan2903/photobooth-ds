document.addEventListener('DOMContentLoaded', function() {
    
    const photoCustomPreview = document.getElementById('photoPreview')
    const pinkBtn = document.getElementById('pinkBtnFrame')
    const blueBtn = document.getElementById('blueBtnFrame')
    const yellowBtn = document.getElementById('yellowBtnFrame')
    const brownBtn = document.getElementById('brownBtnFrame')
    const redBtn = document.getElementById('redBtnFrame')

    const matchaBtn = document.getElementById('matchaBtnFrame')
    const purpleBtn = document.getElementById('purpleBtnFrame')
    // const ribbonBtn = document.getElementById('ribbonBtnFrame')
    const whiteBtn = document.getElementById('whiteBtnFrame')
    const blackBtn = document.getElementById('blackBtnFrame')

    const pinkGlitter = document.getElementById('pinkGlitter');
    const pinkPlaid = document.getElementById('pinkPlaid');
    const bluePlaid = document.getElementById('bluePlaid');
    const brownLeopard = document.getElementById('brownLeopard');
    const cowPrint = document.getElementById('cowPrint');
    const redLeather = document.getElementById('redLeather');
    const pinkGumamela = document.getElementById('pinkGumamela');
    const whiteKnitted = document.getElementById('whiteKnitted');
    const blackCq = document.getElementById('black-cq');
    const whiteCq = document.getElementById('white-cq');
    const pinkLeather = document.getElementById('pinkLeather');
    const ribbonDenim = document.getElementById('ribbonDenim');
    const blackPinkRibbon = document.getElementById('blackPinkRibbon');
    const blueYellowSquares = document.getElementById('blueYellowSquares');
    const blueWhiteSquares = document.getElementById('blueWhiteSquares');
    const fourLockers = document.getElementById('fourLockers');
    const crumpledPaper = document.getElementById('crumpledPaper');
    const blueBackdrop = document.getElementById('blueBackdrop');
    const greenHills = document.getElementById('greenHills');
    const sandShells = document.getElementById('sandShells');
    const waterBeach = document.getElementById('waterBeach');
    const cocoTrees = document.getElementById('cocoTrees');
    const pinkLiliesFrame = document.getElementById('pinkLiliesFrame');
    const roseCardFrame = document.getElementById('roseCardFrame');
    const princessVintageFrame = document.getElementById('princessVintageFrame');
    const gridPaperFrame = document.getElementById('gridPaperFrame');
    const stardustFrame = document.getElementById('stardustFrame');
    const roughTextureFrame = document.getElementById('roughTextureFrame');
    const ribbonSweaterFrame = document.getElementById('ribbonSweaterFrame');
    const vsPinkFrame = document.getElementById('vsPinkFrame');
    const vsYellowFrame = document.getElementById('vsYellowFrame');
    const redRosesPaintFrame = document.getElementById('redRosesPaintFrame');
    const grayTrashFrame = document.getElementById('grayTrashFrame');
    const blackTrashFrame = document.getElementById('blackTrashFrame');
    const whiteTrashFrame = document.getElementById('whiteTrashFrame');
    const brownKnittedFrame = document.getElementById('brownKnittedFrame');
    const hotPinkKnittedFrame = document.getElementById('hotPinkKnittedFrame');
    const redKnittedFrame = document.getElementById('redKnittedFrame');
    const pinkKnittedFrame = document.getElementById('pinkKnittedFrame');
    const redStripesFrame = document.getElementById('redStripesFrame');
    const greenStripesFrame = document.getElementById('greenStripesFrame');
    const blueStripesFrame = document.getElementById('blueStripesFrame');
    const partyDrapeFrame = document.getElementById('partyDrapeFrame');
    const partyDotsFrame = document.getElementById('partyDotsFrame');
    const blingDenimFrame = document.getElementById('blingDenimFrame');

    const customBack = document.getElementById('customBack');
    // const customNext = document.getElementById('customNext');
    const downloadCopyBtn = document.getElementById('downloadCopyBtn');
    const downloadGIFBtn = document.getElementById('downloadGIFBtn');
    const printCopyBtn = document.getElementById('printCopyBtn');
    const shareCopyBtn = document.getElementById('shareCopyBtn');

    const noneSticker = document.getElementById('noneSticker')
    const kissSticker = document.getElementById('kissSticker')
    const ribbonSticker = document.getElementById('ribbonSticker')
    const sweetSticker = document.getElementById('sweetSticker')
    // const islandSticker = document.getElementById('islandSticker')
    const sparkleSticker = document.getElementById('sparkleSticker')
    const pearlSticker = document.getElementById('pearlSticker')
    // const matchaSticker = document.getElementById('matchaSticker')
    const softSticker = document.getElementById('softSticker');
    const bunnySticker = document.getElementById('bunnySticker');
    const classicSticker = document.getElementById('classicSticker');
    const classicBSticker = document.getElementById('classicBSticker');
    const luckySticker = document.getElementById('luckySticker');
    const confettiSticker = document.getElementById('confettiSticker');
    const ribbonCoquetteSticker = document.getElementById('ribbonCoquetteSticker');
    const blueRibbonCoquetteSticker = document.getElementById('blueRibbonCoquetteSticker');
    const blackStarSticker = document.getElementById('blackStarSticker');
    const yellowChickenSticker = document.getElementById('yellowChickenSticker');
    const brownBearSticker = document.getElementById('brownBearSticker');
    const lotsHeartSticker = document.getElementById('lotsHeartSticker');
    const tabbyCatSticker = document.getElementById('tabbyCatSticker');
    const ballerinaCappuccinoSticker = document.getElementById('ballerinaCappuccinoSticker');
    const doggyWhiteSticker = document.getElementById('doggyWhiteSticker');
    const sakuraBlossomSticker = document.getElementById('sakuraBlossomSticker');
    const myGirlsSticker = document.getElementById('myGirlsSticker');

    const birthdaySticker = document.getElementById('birthdaySticker');
    const pinkDateSticker = document.getElementById('pinkDateSticker');
    const strawberrySticker = document.getElementById('strawberrySticker');
    const peachSticker = document.getElementById('peachSticker');
    const miffySticker = document.getElementById('miffySticker');
    const gumamelaSticker = document.getElementById('gumamelaSticker');
    const koiSticker = document.getElementById('koiSticker');
    const moneySticker = document.getElementById('moneySticker');
    const swagSticker = document.getElementById('swagSticker');
    const matchaSticker = document.getElementById('matchaSticker');

    const vsangelSticker = document.getElementById('vsangelSticker');
    const marioSticker = document.getElementById('marioSticker');
    const gem1Sticker = document.getElementById('gem1Sticker');
    const gem2Sticker = document.getElementById('gem2Sticker');
    const holidays1Sticker = document.getElementById('holidays1Sticker');
    const holidays2Sticker = document.getElementById('holidays2Sticker');
    const grinchSticker = document.getElementById('grinchSticker');

    const engLogo = document.getElementById('engLogo');
    const korLogo = document.getElementById('korLogo');
    const cnLogo = document.getElementById('cnLogo');

    const normalFrameBtn = document.getElementById('noneFrameShape');
    const roundEdgeFrameBtn = document.getElementById('softFrameShape');
    const circleFrameBtn = document.getElementById('circleFrameShape');
    const heartFrameBtn = document.getElementById('heartFrameShape');
    // const petalFrameBtn = document.getElementById('petalFrameShape');
    // const catFrameBtn = document.getElementById('catFrameShape');

    let engLogoToggle = false;
    let korLogoToggle = false;
    let cnLogoToggle = false;

    let selectedShape = 'default'; // or 'circle', 'rounded', 'heart'

    const dateCheckbox = document.getElementById('dateCheckbox');
    const dateTimeCheckbox = document.getElementById('dateTimeCheckbox');

    const colorPickerBtn = document.getElementById("colorPickerBtn");

    let finalCanvas = null;
    let selectedSticker = null;

    // Drag & Drop Stickers: freely placed, resizable, flippable stickers,
    // independent of the single fixed-layout `selectedSticker` above. See
    // the full module (state + interactions + export drawing) near
    // drawSticker() below for why these live in an overlay instead of the
    // canvas.
    const photoStage = document.getElementById('photoStage');
    const stickerOverlay = document.getElementById('stickerOverlay');
    const dragDropStickerPicker = document.getElementById('dragDropStickerPicker');
    const stickerPreviewToggle = document.getElementById('stickerPreviewToggle');
    const placedStickers = [];
    let stickerUiHidden = false;
    let stickerIdSeq = 0;

    // Doodle: a persistent full-resolution <canvas> (see #doodleCanvas)
    // layered above the sticker overlay. Its pixel dimensions are kept in
    // sync with the export canvas's own size (see ensureDoodleCanvasSize,
    // called from redrawCanvas), so drawn strokes need no extra scaling to
    // land correctly in the final export - see drawDoodle() near
    // buildPhotoStripCanvas below.
    const doodleCanvas = document.getElementById('doodleCanvas');
    const doodleCtx = doodleCanvas ? doodleCanvas.getContext('2d') : null;
    const doodleColorSwatches = document.getElementById('doodleColorSwatches');
    const doodleColorPicker = document.getElementById('doodleColorPicker');
    const doodleSizeButtons = document.getElementById('doodleSizeButtons');
    const doodleToggleBtn = document.getElementById('doodleToggleBtn');
    const doodleUndoBtn = document.getElementById('doodleUndoBtn');
    const doodleClearBtn = document.getElementById('doodleClearBtn');
    const DOODLE_MAX_UNDO_STEPS = 15;
    let doodleColor = '#000000';
    let doodleSize = 9;
    let doodleActive = false;
    let doodleDrawing = false;
    let doodleUndoStack = [];

    let selectedText = 'photobooth';

    if (dateCheckbox) {
        dateCheckbox.addEventListener('change', () => {
            redrawCanvas(storedImages);
        });
    }

    if (dateTimeCheckbox) {
        dateTimeCheckbox.addEventListener('change', () => {
            redrawCanvas(storedImages);
        });
    }
    
    // 🔹 1. Declare ALL global variables
    let db;

    let backgroundType = 'color';
    let backgroundColor = '#FFFFFF';
    let backgroundImage = null;

    let storedImages = [];
    let imageArrayLength = 0;


    // 🔹 2. Open IndexedDB
    const request = indexedDB.open("PhotoboothDB", 1);

    request.onsuccess = function (event) {
        db = event.target.result;
        loadIndexedImages();
    };

    request.onerror = function (event) {
        console.error("IndexedDB error:", event.target.errorCode);
    };


    // 🔹 3. Load images from IndexedDB
    function loadIndexedImages() {
        const tx = db.transaction(["images"], "readonly");
        const store = tx.objectStore("images");

        const getAllReq = store.getAll();

        getAllReq.onsuccess = function () {
            storedImages = getAllReq.result.map(item => item.data);
            imageArrayLength = storedImages.length;

            if (imageArrayLength === 0) {
                console.log("No valid images found in IndexedDB");
                return;
            }

            console.log("Loaded images:", storedImages);
            redrawCanvas(storedImages);
        };
    }

    // Updated by redrawCanvas (below) every time it runs, since borderWidth/
    // spacing/photoWidth/photoHeight are local to that function and can
    // change (photo count, layout). Read by the drag/pinch/scroll handler
    // below to know which photo a given canvas point belongs to.
    let currentPhotoLayout = null;

    if (photoCustomPreview && typeof PhotoAdjust !== 'undefined') {
        PhotoAdjust.attachCanvasInteraction(photoCustomPreview, {
            getSlots: () => {
                if (!currentPhotoLayout) return [];
                const { borderWidth, spacing, photoWidth, photoHeight, count } = currentPhotoLayout;
                return Array.from({ length: count }, (_, index) => ({
                    index,
                    x: borderWidth,
                    y: borderWidth + index * (photoHeight + spacing),
                    width: photoWidth,
                    height: photoHeight
                }));
            },
            onAdjust: () => redrawCanvas(storedImages)
        });
    }



    function displayImages(imageArray) {
        const container = document.getElementById("customize-container");

        container.innerHTML = ""; // Clear old content

        imageArray.forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.classList.add("customize-photo");
            container.appendChild(img);
        });
    }

    if (customBack) {
        customBack.addEventListener('click', () => {
            // Get the layout we came from
            const returnLayout = sessionStorage.getItem('returnLayout');
            
            if (returnLayout) {
                window.location.href = returnLayout;
            } else {
                // Fallback to inferred logic if sessionStorage is empty
                if (imageArrayLength === 3) {
                    window.location.href = 'canvas.html';
                } else if (imageArrayLength === 4) {
                    window.location.href = 'canvas4.html';
                } else if (imageArrayLength === 6) {
                    window.location.href = 'canvas6.html';
                } else {
                    window.location.href = 'canvas2.html';
                }
            }
        });
    }

    // Default background color
    // let backgroundType = 'white';

    // Function to set new background and redraw canvas
    // function setBackground(type) {
    //     console.log(`Changing to: ${type}`);
    //     backgroundType = type;
    //     redrawCanvas();
    // }

    function setBackground(option) {
        console.log('Setting background:', option);
    
        if (option.type === 'color') {
            backgroundType = 'color';
            backgroundColor = option.value;
            redrawCanvas(storedImages);
        } else if (option.type === 'image') {
            backgroundType = 'image';
            backgroundImage = new Image();
            backgroundImage.src = option.src;
    
            backgroundImage.onload = () => {
                redrawCanvas(storedImages);
            };
        }
    }

    // Initialize Vanilla Picker
    // const picker = new Picker({
    //     parent: colorPickerBtn,
    //     popup: 'bottom', // Shows popup below the div
    //     color: '#FFFFFF', // Default color
    //     onChange: (color) => {
    //         setBackground(color.hex); // Call your function with the selected color
    //     },
    //     onDone: (color) => {
    //         colorPickerBtn.style.backgroundColor = color.hex; // Update button color
    //     }
    // });
    const picker = new Picker({
        parent: colorPickerBtn,
        popup: 'bottom',
        color: '#FFFFFF',
        onChange: (color) => {
            setBackground({ type: 'color', value: color.hex });
        },
        onDone: (color) => {
            colorPickerBtn.style.backgroundColor = color.hex;
        }
    });

    // Show picker on click
    colorPickerBtn.addEventListener("click", () => picker.show());

    // function setSticker(type) {
    //     console.log(`Sticker changed to: ${type}`);
    //     selectedSticker = type;
    //     redrawCanvas();
    // }
    function setSticker(type) {
        if (selectedSticker === type) {
            selectedSticker = null; // Remove sticker if already selected
            console.log(`Removed sticker: ${type}`);
        } else {
            selectedSticker = type;
            console.log(`Selected sticker: ${type}`);
        }
        redrawCanvas(storedImages);
    }

    // Event listeners for stickers
    // if (noneSticker) noneSticker.addEventListener('click', () => { selectedSticker = null; redrawCanvas(); }); 
    // if (kissSticker) kissSticker.addEventListener('click', () => setSticker('kiss')); // Kiss sticker
    // if (sweetSticker) sweetSticker.addEventListener('click', () => setSticker('sweet'));
    // if (ribbonSticker) ribbonSticker.addEventListener('click', () => setSticker('ribbon'));
    // // if (islandSticker) islandSticker.addEventListener('click', () => setSticker('island'));
    // if (sparkleSticker) sparkleSticker.addEventListener('click', () => setSticker('sparkle'));
    // if (pearlSticker) pearlSticker.addEventListener('click', () => setSticker('pearl'));
    // // if (matchaSticker) matchaSticker.addEventListener('click', () => setSticker('matcha'));
    // if (classicSticker) classicSticker.addEventListener('click', () => setSticker('classic'));
    // if (classicBSticker) classicBSticker.addEventListener('click', () => setSticker('classicB'));
    // if (softSticker) softSticker.addEventListener('click', () => setSticker('soft'));
    // if (bunnySticker) bunnySticker.addEventListener('click', () => setSticker('bunny'));
    // if (luckySticker) luckySticker.addEventListener('click', () => setSticker('lucky'));
    // if (confettiSticker) confettiSticker.addEventListener('click', () => setSticker('confetti'));
    // if (ribbonCoquetteSticker) ribbonCoquetteSticker.addEventListener('click', () => setSticker('ribboncoquette'));
    // if (blueRibbonCoquetteSticker) blueRibbonCoquetteSticker.addEventListener('click', () => setSticker('blueribboncoquette'));
    // if (blackStarSticker) blackStarSticker.addEventListener('click', () => setSticker('blackstar'));
    // if (yellowChickenSticker) yellowChickenSticker.addEventListener('click', () => setSticker('yellowchicken'));
    // if (brownBearSticker) brownBearSticker.addEventListener('click', () => setSticker('brownbear'));
    // if (lotsHeartSticker) lotsHeartSticker.addEventListener('click', () => setSticker('lotsheart'));
    // if (tabbyCatSticker) tabbyCatSticker.addEventListener('click', () => setSticker('tabbycat'));
    // if (ballerinaCappuccinoSticker) ballerinaCappuccinoSticker.addEventListener('click', () => setSticker('ballerinacp'));
    // if (doggyWhiteSticker) doggyWhiteSticker.addEventListener('click', () => setSticker('doggywhite'));
    // if (sakuraBlossomSticker) sakuraBlossomSticker.addEventListener('click', () => setSticker('sakurablossom'));
    // if (myGirlsSticker) myGirlsSticker.addEventListener('click', () => setSticker('mygirls'));

    const allStickers = [
        kissSticker,
        sweetSticker,
        ribbonSticker,
        sparkleSticker,
        pearlSticker,
        classicSticker,
        classicBSticker,
        softSticker,
        bunnySticker,
        luckySticker,
        confettiSticker,
        ribbonCoquetteSticker,
        blueRibbonCoquetteSticker,
        blackStarSticker,
        yellowChickenSticker,
        brownBearSticker,
        lotsHeartSticker,
        tabbyCatSticker,
        ballerinaCappuccinoSticker,
        doggyWhiteSticker,
        sakuraBlossomSticker,
        myGirlsSticker,
        birthdaySticker,
        pinkDateSticker,
        strawberrySticker,
        peachSticker,
        miffySticker,
        gumamelaSticker,
        koiSticker,
        moneySticker,
        swagSticker,
        matchaSticker,
        vsangelSticker,
        marioSticker,
        gem1Sticker,
        gem2Sticker,
        holidays1Sticker,
        holidays2Sticker,
        grinchSticker,
        noneSticker
        // islandSticker,
        // matchaSticker,
    ];
      
    function resetStickerBackgrounds() {
        allStickers.forEach(el => {
          if (el) el.classList.remove('is-selected');
        });
    }

    // Ring + check on the sticker in use (styles.css, same as Frame Color),
    // or on "None" once a second click has taken it off (setSticker toggles).
    function markSticker(button, type) {
        resetStickerBackgrounds();
        const chosen = selectedSticker === type ? button : noneSticker;
        if (chosen) chosen.classList.add('is-selected');
    }
      
    if (kissSticker) {
        kissSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('kiss');
          markSticker(kissSticker, 'kiss');
        });
    }
      
    if (sweetSticker) {
        sweetSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('sweet');
          markSticker(sweetSticker, 'sweet');
        });
    }
      
    if (ribbonSticker) {
        ribbonSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('ribbon');
          markSticker(ribbonSticker, 'ribbon');
        });
    }
      
    if (sparkleSticker) {
        sparkleSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('sparkle');
          markSticker(sparkleSticker, 'sparkle');
        });
    }
      
    if (pearlSticker) {
        pearlSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('pearl');
          markSticker(pearlSticker, 'pearl');
        });
    }
      
    if (classicSticker) {
        classicSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('classic');
          markSticker(classicSticker, 'classic');
        });
    }
      
    if (classicBSticker) {
        classicBSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('classicB');
          markSticker(classicBSticker, 'classicB');
        });
    }
      
    if (softSticker) {
        softSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('soft');
          markSticker(softSticker, 'soft');
        });
    }
      
    if (bunnySticker) {
        bunnySticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('bunny');
          markSticker(bunnySticker, 'bunny');
        });
    }
      
    if (luckySticker) {
        luckySticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('lucky');
          markSticker(luckySticker, 'lucky');
        });
    }
      
    if (confettiSticker) {
        confettiSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('confetti');
          markSticker(confettiSticker, 'confetti');
        });
    }
      
    if (ribbonCoquetteSticker) {
        ribbonCoquetteSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('ribboncoquette');
          markSticker(ribbonCoquetteSticker, 'ribboncoquette');
        });
    }
      
    if (blueRibbonCoquetteSticker) {
        blueRibbonCoquetteSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('blueribboncoquette');
          markSticker(blueRibbonCoquetteSticker, 'blueribboncoquette');
        });
    }
      
    if (blackStarSticker) {
        blackStarSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('blackstar');
          markSticker(blackStarSticker, 'blackstar');
        });
    }
      
    if (yellowChickenSticker) {
        yellowChickenSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('yellowchicken');
          markSticker(yellowChickenSticker, 'yellowchicken');
        });
    }
      
    if (brownBearSticker) {
        brownBearSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('brownbear');
          markSticker(brownBearSticker, 'brownbear');
        });
    }
      
    if (lotsHeartSticker) {
        lotsHeartSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('lotsheart');
          markSticker(lotsHeartSticker, 'lotsheart');
        });
    }
      
    if (tabbyCatSticker) {
        tabbyCatSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('tabbycat');
          markSticker(tabbyCatSticker, 'tabbycat');
        });
    }
      
    if (ballerinaCappuccinoSticker) {
        ballerinaCappuccinoSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('ballerinacp');
          markSticker(ballerinaCappuccinoSticker, 'ballerinacp');
        });
    }
      
    if (doggyWhiteSticker) {
        doggyWhiteSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('doggywhite');
          markSticker(doggyWhiteSticker, 'doggywhite');
        });
    }
      
    if (sakuraBlossomSticker) {
        sakuraBlossomSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('sakurablossom');
          markSticker(sakuraBlossomSticker, 'sakurablossom');
        });
    }

    if (myGirlsSticker) {
        myGirlsSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('mygirls');
          markSticker(myGirlsSticker, 'mygirls');
        });
    }
      
    if (birthdaySticker) {
        birthdaySticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('birthday');
          markSticker(birthdaySticker, 'birthday');
        });
    }

    if (pinkDateSticker) {
        pinkDateSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('pinkdate');
          markSticker(pinkDateSticker, 'pinkdate');
        });
    }
    
    if (strawberrySticker) {
        strawberrySticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('strawberry');
          markSticker(strawberrySticker, 'strawberry');
        });
    }

    if (peachSticker) {
        peachSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('peach');
          markSticker(peachSticker, 'peach');
        });
    }

    if (miffySticker) {
        miffySticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('miffy');
          markSticker(miffySticker, 'miffy');
        });
    }

    if (gumamelaSticker) {
        gumamelaSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('gumamela');
          markSticker(gumamelaSticker, 'gumamela');
        });
    }

    if (koiSticker) {
        koiSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('koi');
          markSticker(koiSticker, 'koi');
        });
    }

    if (moneySticker) {
        moneySticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('money');
          markSticker(moneySticker, 'money');
        });
    }

    if (swagSticker) {
        swagSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('swag');
          markSticker(swagSticker, 'swag');
        });
    }

    if (matchaSticker) {
        matchaSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('matcha');
          markSticker(matchaSticker, 'matcha');
        });
    }
      
    if (vsangelSticker) {
        vsangelSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('vsangel');
          markSticker(vsangelSticker, 'vsangel');
        });
    }
      
    if (marioSticker) {
        marioSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('mario');
          markSticker(marioSticker, 'mario');
        });
    }
      
    if (gem1Sticker) {
        gem1Sticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('gem1');
          markSticker(gem1Sticker, 'gem1');
        });
    }
      
    if (gem2Sticker) {
        gem2Sticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('gem2');
          markSticker(gem2Sticker, 'gem2');
        });
    }
      
    if (holidays1Sticker) {
        holidays1Sticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('holidays1');
          markSticker(holidays1Sticker, 'holidays1');
        });
    }
      
    if (holidays2Sticker) {
        holidays2Sticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('holidays2');
          markSticker(holidays2Sticker, 'holidays2');
        });
    }
      
    if (grinchSticker) {
        grinchSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          setSticker('grinch');
          markSticker(grinchSticker, 'grinch');
        });
    }
      
    if (noneSticker) {
        noneSticker.addEventListener('click', () => {
          resetStickerBackgrounds();
          noneSticker.classList.add('is-selected');
          selectedSticker = null;
          redrawCanvas(storedImages);
        });
    }

    // Event listeners for background change buttons
    // if (pinkBtn) pinkBtn.addEventListener('click', () => setBackground('#FFC2D1'));
    // if (blueBtn) blueBtn.addEventListener('click', () => setBackground('#CAF0F8'));
    // if (yellowBtn) yellowBtn.addEventListener('click', () => setBackground('#FFF8A5'));
    // if (matchaBtn) matchaBtn.addEventListener('click', () => setBackground('#90a955'));
    // if (purpleBtn) purpleBtn.addEventListener('click', () => setBackground('#c19ee0'));
    // if (brownBtn) brownBtn.addEventListener('click', () => setBackground('#DDBEA9'));
    // if (redBtn) redBtn.addEventListener('click', () => setBackground('#780000'));
    // if (whiteBtn) whiteBtn.addEventListener('click', () => setBackground('#FFFFFF'));
    // if (blackBtn) blackBtn.addEventListener('click', () => setBackground('#000000'));
    // if (ribbonBtn) ribbonBtn.addEventListener('click', () => setBackground('ribbon'));
    if (pinkBtn) {
        pinkBtn.addEventListener('click', () => {
            setBackground({ type: 'color', value: '#FFC2D1' });
        });
    }

    if (blueBtn) {
        blueBtn.addEventListener('click', () => {
            setBackground({ type: 'color', value: '#CAF0F8' });
        });
    }

    if (yellowBtn) {
        yellowBtn.addEventListener('click', () => {
            setBackground({ type: 'color', value: '#FFF8A5' });
        });
    }

    if (matchaBtn) {
        matchaBtn.addEventListener('click', () => {
            setBackground({ type: 'color', value: '#90a955' });
        });
    }

    if (purpleBtn) {
        purpleBtn.addEventListener('click', () => {
            setBackground({ type: 'color', value: '#c19ee0' });
        });
    }

    if (brownBtn) {
        brownBtn.addEventListener('click', () => {
            setBackground({ type: 'color', value: '#DDBEA9' });
        });
    }

    if (redBtn) {
        redBtn.addEventListener('click', () => {
            setBackground({ type: 'color', value: '#780000' });
        });
    }

    if (whiteBtn) {
        whiteBtn.addEventListener('click', () => {
            setBackground({ type: 'color', value: '#FFFFFF' });
        });
    }

    if (blackBtn) {
        blackBtn.addEventListener('click', () => {
            setBackground({ type: 'color', value: '#000000' });
        });
    }

    // BG IMG FRAMES
    if (pinkPlaid) {
        pinkPlaid.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/pink-plaid.jpg'});
        });
    }
    if (pinkGlitter) {
        pinkGlitter.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/pink-glitter.jpg'});
        });
    }
    if (bluePlaid) {
        bluePlaid.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/blue-plaid.jpg'});
        });
    }
    if (brownLeopard) {
        brownLeopard.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/brown-leopard.jpg'});
        });
    }
    if (cowPrint) {
        cowPrint.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/cow-print.jpg'});
        });
    }
    if (redLeather) {
        redLeather.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/red-leather.jpg'});
        });
    }
    if (pinkGumamela) {
        pinkGumamela.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/pink-gumamela.jpg'});
        });
    }
    if (whiteKnitted) {
        whiteKnitted.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/white-knitted-cloth.jpg'});
        });
    }
    if (blackCq) {
        blackCq.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/black-couqutte.jpg'});
        });
    }
    if (whiteCq) {
        whiteCq.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/white-couquette.jpg'});
        });
    }
    if (pinkLeather) {
        pinkLeather.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/pink-diamond-leather.jpg'});
        });
    }
    if (ribbonDenim) {
        ribbonDenim.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/ribbon-denim.jpg'});
        });
    }
    if (blackPinkRibbon) {
        blackPinkRibbon.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/black-pink-ribbon.jpg'});
        });
    }
    if (blueYellowSquares) {
        blueYellowSquares.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/blue-yellow-squares.jpg'});
        });
    }
    if (blueWhiteSquares) {
        blueWhiteSquares.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/blue-white-squares.jpg'});
        });
    }
    if (fourLockers) {
        fourLockers.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/4-lockers.jpg'});
        });
    }
    if (crumpledPaper) {
        crumpledPaper.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/crumpled-paper.jpg'});
        });
    }
    if (blueBackdrop) {
        blueBackdrop.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/blue-backdrop.jpg'});
        });
    }
    if (greenHills) {
        greenHills.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/green-hills.jpg'});
        });
    }
    if (sandShells) {
        sandShells.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/sand-shells.jpg'});
        });
    }
    if (waterBeach) {
        waterBeach.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/water.jpg'});
        });
    }
    if (cocoTrees) {
        cocoTrees.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/coco-trees.jpg'});
        });
    }
    if (pinkLiliesFrame) {
        pinkLiliesFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/pink-lilies.jpg'});
        });
    }
    if (roseCardFrame) {
        roseCardFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/rose-card.jpg'});
        });
    }
    if (princessVintageFrame) {
        princessVintageFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/princess-vintage.jpg'});
        });
    }
    if (gridPaperFrame) {
        gridPaperFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/grid-paper.jpg'});
        });
    }
    if (stardustFrame) {
        stardustFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/stardust.jpg'});
        });
    }
    if (roughTextureFrame) {
        roughTextureFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/rough-texture.jpg'});
        });
    }
    if (ribbonSweaterFrame) {
        ribbonSweaterFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/ribbon-sweater.jpg'});
        });
    }
    if (vsPinkFrame) {
        vsPinkFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/vs-pink.jpg'});
        });
    }
    if (vsYellowFrame) {
        vsYellowFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/vs-yellow.jpg'});
        });
    }
    if (redRosesPaintFrame) {
        redRosesPaintFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/red-roses-paint.jpg'});
        });
    }
    if (grayTrashFrame) {
        grayTrashFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/gray-trash.jpg'});
        });
    }
    if (blackTrashFrame) {
        blackTrashFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/black-trash.jpg'});
        });
    }
    if (whiteTrashFrame) {
        whiteTrashFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/white-trash.jpg'});
        });
    }
    if (brownKnittedFrame) {
        brownKnittedFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/brown-knitted.jpg'});
        });
    }
    if (hotPinkKnittedFrame) {
        hotPinkKnittedFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/hot-pink-knitted.jpg'});
        });
    }
    if (redKnittedFrame) {
        redKnittedFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/red-knitted.jpg'});
        });
    }
    if (pinkKnittedFrame) {
        pinkKnittedFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/pink-knitted.jpg'});
        });
    }
    if (redStripesFrame) {
        redStripesFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/red-stripes.jpg'});
        });
    }
    if (greenStripesFrame) {
        greenStripesFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/green-stripes.jpg'});
        });
    }
    if (blueStripesFrame) {
        blueStripesFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/blue-stripes.jpg'});
        });
    }
    if (partyDrapeFrame) {
        partyDrapeFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/party-drape.jpg'});
        });
    }
    if (partyDotsFrame) {
        partyDotsFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/party-dots.jpg'});
        });
    }
    if (blingDenimFrame) {
        blingDenimFrame.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/bling-denim.jpg'});
        });
    }

    // New background frames - registered in a loop rather than one
    // if/addEventListener block per button like the ones above, since
    // there's nothing button-specific beyond the id/file pairing.
    const NEW_BG_FRAMES = [
        { id: 'violetGradientFrame', file: 'violet-gradient.jpg' },
        { id: 'blueGradientFrame', file: 'blue-gradient.jpg' },
        { id: 'brownGradientFrame', file: 'brown-gradient.jpg' },
        { id: 'greenGradientFrame', file: 'green-gradient.jpg' },
        { id: 'graySparkleFrame', file: 'gray-sparkle.jpg' },
        { id: 'gray3dFrame', file: 'gray-3d.jpg' },
        { id: 'pinkGradientFrame', file: 'pink-gradient.jpg' },
        { id: 'pinkLeopardFrame', file: 'pink-leopard.jpg' },
        { id: 'bgreenGradientFrame', file: 'bgreen-gradient.jpg' },
        { id: 'bigBrpPolkaFrame', file: 'big-brp-polka.jpg' },
        { id: 'bigBrwpPolkaFrame', file: 'big-brwp-polka.jpg' },
        { id: 'bigWbPolkaFrame', file: 'big-wb-polka.jpg' },
        { id: 'blackBedazzledFrame', file: 'black-bedazzled.png' },
        { id: 'blueGradient2Frame', file: 'blue-gradient.png' },
        { id: 'blueVStripeFrame', file: 'blue-v-stripe.jpg' },
        { id: 'bpPolkaFrame', file: 'bp-polka.jpg' },
        { id: 'brpPolkaFrame', file: 'brp-polka.jpg' },
        { id: 'bwPolkaFrame', file: 'bw-polka.jpg' },
        { id: 'foreverBlessedFrame', file: 'forever-blessed.jpg' },
        { id: 'lgreenGradientFrame', file: 'lgreen-gradient.jpg' },
        { id: 'magicalFrame', file: 'magical.jpg' },
        { id: 'orangeGradientFrame', file: 'orange-gradient.jpg' },
        { id: 'pinkBedazzledFrame', file: 'pink-bedazzled.jpg' },
        { id: 'pinkGradient2Frame', file: 'pink-gradient.png' },
        { id: 'pinkVStripeFrame', file: 'pink-v-stripe.png' },
        { id: 'purpleGradientFrame', file: 'purple-gradient.png' },
        { id: 'redGradientFrame', file: 'red-gradient.jpg' },
        { id: 'silverBedazzledFrame', file: 'silver-bedazzled.jpg' },
        { id: 'vegasFrame', file: 'vegas.jpg' },
        { id: 'whiteBedazzledFrame', file: 'white-bedazzled.png' },
        { id: 'yellowVStripeFrame', file: 'yellow-v-stripe.png' },
        { id: 'digicamFrame', file: 'digicam.jpg' },
        { id: 'redCurtainFrame', file: 'red-curtain.jpg' },
    ];
    NEW_BG_FRAMES.forEach(({ id, file }) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => {
            setBackground({ type: 'image', src: 'assets/frame-backgrounds/' + file });
        });
    });

    // if(engLogo) engLogo.addEventListener('click', () => updateText('photobooth'));
    // if(korLogo) korLogo.addEventListener('click', () => updateText('포토부스'));
    // if(engLogo) cnLogo.addEventListener('click', () => updateText('照相亭'));

    const allLogoButtons = [engLogo, korLogo, cnLogo];

    function resetLogoBackgrounds() {
      allLogoButtons.forEach(btn => {
        if (btn) btn.style.backgroundColor = '';
      });
    }
    
    if (engLogo) {
      engLogo.addEventListener('click', () => {
        resetLogoBackgrounds();
        updateText('photobooth');
        engLogo.style.backgroundColor = '#E28585';
        engLogo.classList.add('active');
      });
    }
    
    if (korLogo) {
      korLogo.addEventListener('click', () => {
        resetLogoBackgrounds();
        updateText('포토부스');
        korLogo.style.backgroundColor = '#E28585';
        korLogo.classList.add('active');
      });
    }
    
    if (cnLogo) {
      cnLogo.addEventListener('click', () => {
        resetLogoBackgrounds();
        updateText('照相亭');
        cnLogo.style.backgroundColor = '#E28585';
        cnLogo.classList.add('active');
      });
    }

    function updateText(text) {
        selectedText = text;
        // redrawCanvas (below) already draws selectedText onto the live
        // preview, and buildPhotoStripCanvas draws it onto the download via
        // its own drawTextAndDate(ctx, stackedCanvas) call - this used
        // to also call drawTextAndDate(ctx, canvas), but ctx/canvas are
        // never declared anywhere in this file's scope, so every click threw
        // a ReferenceError here. Harmless in practice (redrawCanvas had
        // already finished by this point) but dead/broken regardless.
        redrawCanvas(storedImages);
    }

    function drawTextAndDate(ctx, canvas) {
        if (backgroundType === 'color') {
            if(backgroundColor !== '#000000' && backgroundColor !== '#780000' && backgroundColor !== '#90a955') {
                ctx.fillStyle = 'black';
            }
            else {
                ctx.fillStyle = '#FFFFFF';
            }
        } else if (backgroundType === 'image' && backgroundImage) {
            const imageName = backgroundImage.src.split('/').pop(); // just the filename

            const darkImages = [
                'pink-glitter.jpg',
                'brown-leopard.jpg',
                'red-leather.jpg',
                'ribbon-denim.jpg',
                'black-pink-ribbon.jpg',
                'green-hills.jpg',
                'sand-shells.jpg',
                'coco-trees.jpg',
                'brown-knitted.jpg',
                'red-knitted.jpg',
                'blue-yellow-squares.jpg',
                '4-lockers.jpg',
                'black-trash.jpg',
                'party-drape.jpg',
                'party-dots.jpg',
                'bling-denim.jpg',
                'gray-3d.jpg',
                'pink-leopard.jpg',
                'big-brwp-polka.jpg',
                'big-brp-polka.jpg',
                'black-bedazzled.png',
                'brp-polka.jpg',
                'forever-blessed.jpg',
                'pink-bedazzled.jpg',
                'vegas.jpg',
                'red-curtain.jpg'
            ];

            if (darkImages.includes(imageName)) {
                ctx.fillStyle = '#FFFFFF';
            } else {
                ctx.fillStyle = '#000000';
            }
        }
        // ctx.fillStyle = (backgroundType === '#000000' || backgroundType === '#780000' || backgroundType === '#90a955') ? '#FFFFFF' : 'black';
        ctx.font = 'bold 32px Arial, Roboto, sans-serif'; //prev 24px
        ctx.textAlign = 'center';
        ctx.fillText(selectedText, canvas.width / 2, canvas.height - 55); //previously 65
    }

    function drawSticker(ctx, stackedCanvas) {
        return new Promise((resolve) => {
            if (!selectedSticker) {
                resolve(); // No sticker selected, resolve immediately
                return;
            }
    
            const stickerLayouts = {
                'kiss': [{ src: 'assets/stickers/kiss1.png', x: 30, y: 300, size: 170 }],
                'sweet': [
                    { src: 'assets/stickers/sweet1.png', x: 17, y: 80, size: 90 },
                    { src: 'assets/stickers/sweet2.png', x: stackedCanvas.width - 100, y: 390, size: 90 },
                    { src: 'assets/stickers/sweet3.png', x: 30, y: stackedCanvas.height - 200, size: 90 }
                ],
                'ribbon': [
                    { src: 'assets/stickers/ribbon1.png', x: 17, y: 80, size: 90 },
                    { src: 'assets/stickers/ribbon3.png', x: stackedCanvas.width - 100, y: 550, size: 95 },
                    { src: 'assets/stickers/ribbon2.png', x: 15, y: stackedCanvas.height - 380, size: 90 }
                ],
                'sparkle': [    
                    { src: 'assets/stickers/sparkle1.png', x: stackedCanvas.width - 200, y: 150, size: 250 },
                    { src: 'assets/stickers/sparkle2.png', x: 2, y: stackedCanvas.height - 850, size: 200 },
                    { src: 'assets/stickers/sparkle2.png', x: stackedCanvas.width - 150, y: stackedCanvas.height - 180, size: 110 }
                ],
                'pearl': [    
                    { src: 'assets/stickers/pearl1.png', x: 35, y: 30, size: 30 },
                    { src: 'assets/stickers/pearl1.png', x: 25, y: 50, size: 25 },
                    { src: 'assets/stickers/pearl1.png', x: 65, y: 40, size: 20 },
                    { src: 'assets/stickers/pearl1.png', x: 95, y: 40, size: 15 },
                    { src: 'assets/stickers/pearl1.png', x: 75, y: 26, size: 15 },
                    { src: 'assets/stickers/pearl1.png', x: 25, y: 65, size: 55 },
                    { src: 'assets/stickers/pearl1.png', x: 25, y: 120, size: 15 },
                    //middle
                    { src: 'assets/stickers/pearl1.png', x: 525, y: stackedCanvas.height - 620, size: 15 },
                    { src: 'assets/stickers/pearl1.png', x: 500, y: stackedCanvas.height - 690, size: 15 },
                    { src: 'assets/stickers/pearl1.png', x: 540, y: stackedCanvas.height - 650, size: 25 },
                    { src: 'assets/stickers/pearl1.png', x: 530, y: stackedCanvas.height - 700, size: 45 },
                    { src: 'assets/stickers/pearl1.png', x: 510, y: stackedCanvas.height - 670, size: 30 },
                    { src: 'assets/stickers/pearl1.png', x: 510, y: stackedCanvas.height - 710, size: 30 },
                    // heart pearl
                    { src: 'assets/stickers/pearl1.png', x: 15, y: stackedCanvas.height - 200, size: 30 },
                    { src: 'assets/stickers/pearl1.png', x: 35, y: stackedCanvas.height - 220, size: 20 },
                    { src: 'assets/stickers/pearl1.png', x: 20, y: stackedCanvas.height - 240, size: 15 },
                    //hearts
                    { src: 'assets/stickers/pearl2.png', x: stackedCanvas.width - 570, y: stackedCanvas.height - 180, size: 150 },
                    { src: 'assets/stickers/pearl2.png', x: stackedCanvas.width - 150, y: 270, size: 120 }
                ],
                'classic': [
                    { src: 'assets/stickers/classic1.png', x: 1, y: 50, size: 32},
                    { src: 'assets/stickers/classic1.png', x: 1, y: 450, size: 32},
                    { src: 'assets/stickers/classic1.png', x: 1, y: 950, size: 32},
                    { src: 'assets/stickers/classic2.png', x: 4, y: 80, size: 20},
                    { src: 'assets/stickers/classic2.png', x: 4, y: 980, size: 20},
                    { src: 'assets/stickers/classic3.png', x: stackedCanvas.width - 75, y: 70, size: 120},
                    { src: 'assets/stickers/classic3.png', x: stackedCanvas.width - 75, y: 570, size: 120}
                ],
                'classicB': [
                    { src: 'assets/stickers/classic4.png', x: 1, y: 50, size: 32},
                    { src: 'assets/stickers/classic4.png', x: 1, y: 450, size: 32},
                    { src: 'assets/stickers/classic4.png', x: 1, y: 950, size: 32},
                    { src: 'assets/stickers/classic5.png', x: 4, y: 80, size: 20},
                    { src: 'assets/stickers/classic5.png', x: 4, y: 980, size: 20},
                    { src: 'assets/stickers/classic6.png', x: stackedCanvas.width - 75, y: 70, size: 120},
                    { src: 'assets/stickers/classic6.png', x: stackedCanvas.width - 75, y: 570, size: 120}
                ],
                'soft': [
                    { src: 'assets/stickers/soft1.png', x: 5, y: 20, size: 145},
                    { src: 'assets/stickers/soft2.png', x: stackedCanvas.width - 120, y: 30, size: 100},
                    { src: 'assets/stickers/soft3.png', x: 10, y: 500, size: 120},
                    { src: 'assets/stickers/soft4.png', x: 15, y: stackedCanvas.height - 200, size: 120},
                    { src: 'assets/stickers/soft5.png', x: stackedCanvas.width - 130, y: stackedCanvas.height - 200, size: 120},
                    { src: 'assets/stickers/soft6.png', x: stackedCanvas.width - 130, y: 430, size: 120}
                ],
                'bunny': [
                    { src: 'assets/stickers/bunny1.png', x: stackedCanvas.width - 170, y: 10, size: 150},
                    { src: 'assets/stickers/bunny2.png', x: 15, y: 300, size: 95},
                    { src: 'assets/stickers/bunny2.png', x: stackedCanvas.width - 100, y: 700, size: 75},
                    { src: 'assets/stickers/bunny3.png', x: 15, y: stackedCanvas.height - 200, size: 135}
                ],
                'lucky' : [
                    { src: 'assets/stickers/lucky2.png', x: stackedCanvas.width - 170, y: 20, size: 150},
                    { src: 'assets/stickers/lucky1.png', x: 15, y: stackedCanvas.height - 215, size: 170},

                    // lucky text
                    { src: 'assets/stickers/lucky3.png', x: stackedCanvas.width - 120, y: 420, size: 90},
                    { src: 'assets/stickers/lucky4.png', x: stackedCanvas.width - 120, y: 495, size: 90},
                    { src: 'assets/stickers/lucky5.png', x: stackedCanvas.width - 128, y: 560, size: 110},
                    { src: 'assets/stickers/lucky6.png', x: stackedCanvas.width - 120, y: 650, size: 100},
                    { src: 'assets/stickers/lucky7.png', x: stackedCanvas.width - 120, y: 730, size: 95}

                ],
                'confetti' : [
                    { src: 'assets/stickers/confetti/star5.png', x: 100, y: 20, size: 40},
                    { src: 'assets/stickers/confetti/circle2.png', x: stackedCanvas.width - 120, y: 45, size: 50},
                    { src: 'assets/stickers/confetti/circle1.png', x: 30, y: 150, size: 35},
                    { src: 'assets/stickers/confetti/circle1.png', x: stackedCanvas.width - 70, y: 180, size: 32},
                    { src: 'assets/stickers/confetti/star2.png', x: stackedCanvas.width - 100, y: 320, size: 40},


                    { src: 'assets/stickers/confetti/star1.png', x: 100, y: 450, size: 32},
                    { src: 'assets/stickers/confetti/circle2.png', x: stackedCanvas.width - 30, y: 530, size: 27},
                    { src: 'assets/stickers/confetti/star4.png', x: stackedCanvas.width - 70, y: 580, size: 27},
                    { src: 'assets/stickers/confetti/star3.png', x: 22, y: 690, size: 47},
                    { src: 'assets/stickers/confetti/circle1.png', x: stackedCanvas.width - 200, y: 800, size: 32},
                    { src: 'assets/stickers/confetti/circle1.png', x: stackedCanvas.width - 200, y: 800, size: 32},
                    { src: 'assets/stickers/confetti/star2.png', x: 100, y: 850, size: 49},
                    { src: 'assets/stickers/confetti/circle2.png', x: 22, y: 990, size: 30},
                    { src: 'assets/stickers/confetti/star1.png', x: stackedCanvas.width - 100, y: stackedCanvas.height - 200, size: 35}
                ],
                // NEW STICKERS
                'ribboncoquette' : [
                    { src: 'assets/stickers/ribboncq2.png', x: 1, y: 0, size: 80},
                    { src: 'assets/stickers/ribboncq3.png', x: 295, y: 15, size: 95},
                    { src: 'assets/stickers/ribboncq1.png', x: stackedCanvas.width - 39, y: 25, size: 82},
                    { src: 'assets/stickers/ribboncq1.png', x: -22, y: 290, size: 75},
                    { src: 'assets/stickers/ribboncq2.png', x: stackedCanvas.width - 100, y: 240, size: 55},
                    { src: 'assets/stickers/ribboncq3.png', x: 5, y: 640, size: 52},
                    { src: 'assets/stickers/ribboncq3.png', x: stackedCanvas.width - 78, y: 520, size: 69},
                    { src: 'assets/stickers/ribboncq1.png', x: 140, y: 570, size: 82},
                    { src: 'assets/stickers/ribboncq2.png', x: stackedCanvas.width - 42, y: 760, size: 55},
                    { src: 'assets/stickers/ribboncq1.png', x: -15, y: 890, size: 72},
                    { src: 'assets/stickers/ribboncq3.png', x: stackedCanvas.width - 70, y: 1020, size: 55},
                    { src: 'assets/stickers/ribboncq2.png', x: -8, y: stackedCanvas.height - 200, size: 80},
                    { src: 'assets/stickers/ribboncq3.png', x: stackedCanvas.width - 70, y: stackedCanvas.height - 100, size: 55}
                ],
                'blueribboncoquette' : [
                    { src: 'assets/stickers/blueRibbon.png', x: 1, y: 0, size: 80},
                    { src: 'assets/stickers/blueRibbon.png', x: 295, y: 15, size: 95},
                    { src: 'assets/stickers/blueRibbon.png', x: stackedCanvas.width - 39, y: 25, size: 82},
                    { src: 'assets/stickers/blueRibbon.png', x: -22, y: 290, size: 75},
                    { src: 'assets/stickers/blueRibbon.png', x: stackedCanvas.width - 100, y: 240, size: 55},
                    { src: 'assets/stickers/blueRibbon.png', x: 5, y: 640, size: 52},
                    { src: 'assets/stickers/blueRibbon.png', x: stackedCanvas.width - 78, y: 520, size: 69},
                    { src: 'assets/stickers/blueRibbon.png', x: 140, y: 570, size: 82},
                    { src: 'assets/stickers/blueRibbon.png', x: stackedCanvas.width - 42, y: 760, size: 55},
                    { src: 'assets/stickers/blueRibbon.png', x: -15, y: 890, size: 72},
                    { src: 'assets/stickers/blueRibbon.png', x: stackedCanvas.width - 70, y: 1020, size: 55},
                    { src: 'assets/stickers/blueRibbon.png', x: -8, y: stackedCanvas.height - 200, size: 80},
                    { src: 'assets/stickers/blueRibbon.png', x: stackedCanvas.width - 70, y: stackedCanvas.height - 100, size: 55}
                ],
                'blackstar' : [
                    { src: 'assets/stickers/blackStar1.png', x: 180, y: -90, size: 250},
                    { src: 'assets/stickers/blackStar2.png', x: stackedCanvas.width - 90, y: -30, size: 110},
                    { src: 'assets/stickers/blackStar3.png', x: 18, y: 130, size: 98},
                    { src: 'assets/stickers/blackStar4.png', x: stackedCanvas.width - 120, y: 230, size: 115},
                    { src: 'assets/stickers/blackStar2.png', x: -17, y: 390, size: 65},
                    { src: 'assets/stickers/blackStar3.png', x: stackedCanvas.width - 190, y: 590, size: 145},
                    { src: 'assets/stickers/blackStar2.png', x: 15, y: 750, size: 45},
                    { src: 'assets/stickers/blackStar2.png', x: stackedCanvas.width - 80, y: 950, size: 55},
                    // { src: 'assets/stickers/blackstar1.png', x: 180, y: stackedCanvas.height - 230, size: 250},
                    { src: 'assets/stickers/blackStar4.png', x: -50, y: stackedCanvas.height - 150, size: 190}
                ],
                'yellowchicken' : [
                    { src: 'assets/stickers/yellowChicken1.png', x: 1, y: 2, size: 90},
                    { src: 'assets/stickers/yellowChicken2.png', x: 220, y: -2, size: 66},
                    { src: 'assets/stickers/yellowChicken1.png', x: stackedCanvas.width - 160, y: 25, size: 55},
                    { src: 'assets/stickers/yellowChicken2.png', x: stackedCanvas.width - 90, y: 145, size: 85},
                    { src: 'assets/stickers/yellowChicken2.png', x: -20, y: 245, size: 95},
                    { src: 'assets/stickers/yellowChicken2.png', x: 140, y: 360, size: 55},
                    { src: 'assets/stickers/yellowChicken3.png', x: stackedCanvas.width - 70, y: 490, size: 85},
                    { src: 'assets/stickers/yellowChicken1.png', x: -5, y: 630, size: 80},
                    { src: 'assets/stickers/yellowChicken1.png', x: stackedCanvas.width - 70, y: 830, size: 75},
                    { src: 'assets/stickers/yellowChicken2.png', x: stackedCanvas.width - 120, y: stackedCanvas.height - 190, size: 65},
                    { src: 'assets/stickers/yellowChicken4.png', x: 1, y: stackedCanvas.height - 230, size: 95}
                ],
                'brownbear' : [
                    { src: 'assets/stickers/brownyBear1.png', x: 1, y: 5, size: 120},
                    { src: 'assets/stickers/brownyBear2.png', x: stackedCanvas.width - 100, y: 25, size: 80},
                    { src: 'assets/stickers/brownyBear3.png', x: -8, y: 315, size: 82},
                    { src: 'assets/stickers/brownyBear4.png', x: stackedCanvas.width - 100, y: 490, size: 91},
                    { src: 'assets/stickers/brownyBear5.png', x: -2, y: 590, size: 91},
                    { src: 'assets/stickers/brownyBear2.png', x: stackedCanvas.width - 70, y: 790, size: 87},
                    { src: 'assets/stickers/brownyBear3.png', x: -1, y: stackedCanvas.height - 320, size: 82},
                    { src: 'assets/stickers/brownyBear6.png', x: stackedCanvas.width - 90, y: stackedCanvas.height - 200, size: 92}
                ],
                'lotsheart' : [
                    { src: 'assets/stickers/lotsHeart1.png', x: 1, y: 15, size: 78},
                    { src: 'assets/stickers/lotsHeart5.png', x: -18, y: 450, size: 78},
                    { src: 'assets/stickers/lotsHeart7.png', x: -8, y: 860, size: 60},
                    { src: 'assets/stickers/lotsHeart6.png', x: 25, y: stackedCanvas.height - 170, size: 70},

                    { src: 'assets/stickers/lotsHeart2.png', x: stackedCanvas.width - 250, y: 20, size: 60},
                    { src: 'assets/stickers/lotsHeart4.png', x: stackedCanvas.width - 70, y: 200, size: 57},
                    // { src: 'assets/stickers/lotsHeart4.png', x: 390, y: 200, size: 50},
                    { src: 'assets/stickers/lotsHeart6.png', x: stackedCanvas.width - 80, y: 650, size: 60},
                    { src: 'assets/stickers/lotsHeart3.png', x: stackedCanvas.width - 50, y: 990, size: 50},
                    { src: 'assets/stickers/lotsHeart8.png', x: stackedCanvas.width - 90, y: stackedCanvas.height - 140, size: 70},
                ],
                'tabbycat' : [
                    { src: 'assets/stickers/tabbyCat1.png', x: 1, y: 2, size: 95},
                    { src: 'assets/stickers/tabbyCat2.png', x: 220, y: -2, size: 66},
                    { src: 'assets/stickers/tabbyCat3.png', x: stackedCanvas.width - 160, y: 25, size: 60},
                    { src: 'assets/stickers/tabbyCat4.png', x: stackedCanvas.width - 90, y: 145, size: 95},
                    { src: 'assets/stickers/tabbyCat9.png', x: -20, y: 245, size: 100},
                    { src: 'assets/stickers/tabbyCat2.png', x: 140, y: 360, size: 55},
                    { src: 'assets/stickers/tabbyCat5.png', x: stackedCanvas.width - 90, y: 490, size: 95},
                    { src: 'assets/stickers/tabbyCat6.png', x: -5, y: 630, size: 84},
                    { src: 'assets/stickers/tabbyCat9.png', x: stackedCanvas.width - 70, y: 830, size: 75},
                    { src: 'assets/stickers/tabbyCat3.png', x: -5, y: 830, size: 75},
                    { src: 'assets/stickers/tabbyCat3.png', x: stackedCanvas.width - 120, y: stackedCanvas.height - 190, size: 65},
                    { src: 'assets/stickers/tabbyCat7.png', x: 1, y: stackedCanvas.height - 230, size: 120}
                ],
                'ballerinacp' : [
                    { src: 'assets/stickers/ballerinaCappuccino/balerinaCappuccino1.png', x: 1, y: 2, size: 125},
                    { src: 'assets/stickers/ballerinaCappuccino/balerinaCappuccino3.png', x: 250, y: -2, size: 90},
                    { src: 'assets/stickers/ballerinaCappuccino/balerinaCappuccino4.png', x: stackedCanvas.width - 130, y: 25, size: 150},
                    { src: 'assets/stickers/ballerinaCappuccino/balerinaCappuccino2.png', x: stackedCanvas.width - 120, y: 345, size: 129},
                    { src: 'assets/stickers/ballerinaCappuccino/balerinaCappuccino5.png', x: -10, y: 595, size: 150},
                    { src: 'assets/stickers/ballerinaCappuccino/balerinaCappuccino7.png', x: -10, y: 295, size: 100},
                    { src: 'assets/stickers/ballerinaCappuccino/balerinaCappuccino6.png', x: stackedCanvas.width - 115, y: 750, size: 110},
                    { src: 'assets/stickers/ballerinaCappuccino/balerinaCappuccino3.png', x: -5, y: stackedCanvas.height - 200, size: 145},
                    { src: 'assets/stickers/ballerinaCappuccino/balerinaCappuccino4.png', x: stackedCanvas.width - 90, y: stackedCanvas.height - 200, size: 95}
                ],
                'doggywhite' : [
                    { src: 'assets/stickers/doggyWhite/doggyWhite3.png', x: 1, y: 230, size: 115},
                    { src: 'assets/stickers/doggyWhite/doggyWhite1.png', x: stackedCanvas.width - 130, y: 25, size: 125},
                    { src: 'assets/stickers/doggyWhite/doggyWhite4.png', x: stackedCanvas.width - 110, y: 545, size: 115},
                    { src: 'assets/stickers/doggyWhite/doggyWhite2.png', x: -10, y: 695, size: 125},
                    { src: 'assets/stickers/doggyWhite/doggyWhite3.png', x: -5, y: stackedCanvas.height - 200, size: 115},
                    { src: 'assets/stickers/doggyWhite/doggyWhite1.png', x: stackedCanvas.width - 130, y: stackedCanvas.height - 200, size: 125}
                ],
                'mygirls' : [
                    { src: 'assets/stickers/myGirls/myGirls4.png', x: -30, y: 15, size: 200},
                    { src: 'assets/stickers/myGirls/myGirls7.png', x: 200, y: -25, size: 215},

                    { src: 'assets/stickers/myGirls/myGirls8.png', x: stackedCanvas.width - 110, y: 25, size: 105},
                    { src: 'assets/stickers/myGirls/myGirls10.png', x: stackedCanvas.width - 150, y: 95, size: 155},
                    { src: 'assets/stickers/myGirls/myGirls11.png', x: stackedCanvas.width - 95, y: 185, size: 115},

                    { src: 'assets/stickers/myGirls/myGirls6.png', x: stackedCanvas.width - 110, y: 395, size: 135},
                    { src: 'assets/stickers/myGirls/myGirls4.png', x: stackedCanvas.width - 110, y: 545, size: 135},
                    { src: 'assets/stickers/myGirls/myGirls1.png', x: stackedCanvas.width - 110, y: 695, size: 135},

                    { src: 'assets/stickers/myGirls/myGirls2.png', x: -20, y: 305, size: 125},
                    { src: 'assets/stickers/myGirls/myGirls4.png', x: -20, y: 450, size: 125},
                    { src: 'assets/stickers/myGirls/myGirls6.png', x: -20, y: 580, size: 125},

                    { src: 'assets/stickers/myGirls/myGirls10.png', x: -15, y: stackedCanvas.height - 370, size: 115},
                    { src: 'assets/stickers/myGirls/myGirls11.png', x: 15, y: stackedCanvas.height - 300, size: 155},
                    { src: 'assets/stickers/myGirls/myGirls9.png', x: -5, y: stackedCanvas.height - 200, size: 115},

                    { src: 'assets/stickers/myGirls/myGirls5.png', x: stackedCanvas.width - 190, y: stackedCanvas.height - 290, size: 222}
                ],
                'sakurablossom' : [
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom1.png', x: 1, y: 5, size: 120},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom2.png', x: stackedCanvas.width - 100, y: 25, size: 80},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom4.png', x: stackedCanvas.width - 120, y: 95, size: 40},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom2.png', x: -8, y: 315, size: 82},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom3.png', x: 35, y: 390, size: 50},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom2.png', x: stackedCanvas.width - 100, y: 490, size: 91},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom4.png', x: stackedCanvas.width - 140, y: 430, size: 35},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom2.png', x: -2, y: 590, size: 91},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom3.png', x: -15, y: 700, size: 45},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom5.png', x: 50, y: 900, size: 45},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom1.png', x: stackedCanvas.width - 70, y: 790, size: 87},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom2.png', x: -1, y: stackedCanvas.height - 320, size: 82},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom5.png', x: 30, y: stackedCanvas.height - 100, size: 48},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom5.png', x: 90, y: stackedCanvas.height - 40, size: 44},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom2.png', x: stackedCanvas.width - 90, y: stackedCanvas.height - 200, size: 92},
                    { src: 'assets/stickers/sakuraBlossom/sakuraBlossom4.png', x: stackedCanvas.width - 40, y: stackedCanvas.height - 290, size: 40}
                ],
                'birthday' : [
                    { src: 'assets/stickers/happyBirthday/birthday2.png', x: 10, y: 55, size: 80},
                    { src: 'assets/stickers/happyBirthday/birthday3.png', x: stackedCanvas.width - 190, y: 15, size: 210},
                    { src: 'assets/stickers/happyBirthday/birthday5.png', x: stackedCanvas.width - 140, y: 430, size: 85},
                    { src: 'assets/stickers/happyBirthday/birthday4.png', x: -2, y: 590, size: 130},
                    { src: 'assets/stickers/happyBirthday/birthday5.png', x: 50, y: 1000, size: 85},
                    { src: 'assets/stickers/happyBirthday/birthday7.png', x: stackedCanvas.width - 150, y: stackedCanvas.height - 590, size: 127},
                    { src: 'assets/stickers/happyBirthday/birthday6.png', x: -15, y: stackedCanvas.height - 250, size: 200},
                    { src: 'assets/stickers/happyBirthday/birthday1.png', x: stackedCanvas.width - 240, y: stackedCanvas.height - 200, size: 252}
                ],
                'pinkdate' : [
                    { src: 'assets/stickers/pinkDate/pinkDate1.png', x: 1, y: -70, size: 295},
                    { src: 'assets/stickers/pinkDate/pinkDate2.png', x: stackedCanvas.width - 100, y: 225, size: 100},
                    { src: 'assets/stickers/pinkDate/pinkDate2.png', x: stackedCanvas.width - 90, y: 650, size: 90},
                    { src: 'assets/stickers/pinkDate/pinkDate4.png', x: -70, y: stackedCanvas.height - 800, size: 220},
                    { src: 'assets/stickers/pinkDate/pinkDate3.png', x: 1, y: stackedCanvas.height - 600, size: 100},
                    { src: 'assets/stickers/pinkDate/pinkDate3.png', x: -10, y: 295, size: 100},
                    { src: 'assets/stickers/pinkDate/pinkDate5.png', x: stackedCanvas.width - 170, y: stackedCanvas.height - 600, size: 230},
                    { src: 'assets/stickers/pinkDate/pinkDate5.png', x: -65, y: stackedCanvas.height - 220, size: 235},
                    { src: 'assets/stickers/pinkDate/pinkDate6.png', x: stackedCanvas.width - 190, y: stackedCanvas.height - 200, size: 200}
                ],
                'strawberry' : [
                    { src: 'assets/stickers/strawberry/strawberry1.png', x: -30, y: -70, size: 170},
                    { src: 'assets/stickers/strawberry/strawberry2.png', x: stackedCanvas.width - 150, y: 115, size: 170},
                    { src: 'assets/stickers/strawberry/strawberry2.png', x: stackedCanvas.width - 150, y: 550, size: 170},
                    { src: 'assets/stickers/strawberry/strawberry1.png', x: -30, y: 370, size: 170},
                    { src: 'assets/stickers/strawberry/strawberry1.png', x: -30, y: 770, size: 170},
                    { src: 'assets/stickers/strawberry/strawberry2.png', x: stackedCanvas.width - 150, y: 1050, size: 170},
                    { src: 'assets/stickers/strawberry/strawberry1.png', x: -30, y: stackedCanvas.height - 220, size: 170}
                ],
                'peach' : [
                    { src: 'assets/stickers/peach/peach.png', x: -30, y: -70, size: 170},
                    { src: 'assets/stickers/peach/peach.png', x: stackedCanvas.width - 150, y: 115, size: 170},
                    { src: 'assets/stickers/peach/peach.png', x: stackedCanvas.width - 150, y: 550, size: 170},
                    { src: 'assets/stickers/peach/peach.png', x: -30, y: 370, size: 170},
                    { src: 'assets/stickers/peach/peach.png', x: -30, y: 770, size: 170},
                    { src: 'assets/stickers/peach/peach.png', x: stackedCanvas.width - 150, y: 1050, size: 170},
                    { src: 'assets/stickers/peach/peach.png', x: -30, y: stackedCanvas.height - 220, size: 170}
                ],
                'miffy' : [
                    { src: 'assets/stickers/miffy/miffy1.png', x: stackedCanvas.width - 170, y: 10, size: 230},
                    { src: 'assets/stickers/miffy/miffy2.png', x: -15, y: 490, size: 215},
                    { src: 'assets/stickers/miffy/miffy3.png', x: stackedCanvas.width - 120, y: 1000, size: 135},
                    { src: 'assets/stickers/miffy/miffy4.png', x: -35, y: stackedCanvas.height - 300, size: 245}
                ],
                'gumamela' : [
                    { src: 'assets/stickers/gumamela/gumamela1.png', x: stackedCanvas.width - 190, y: 15, size: 210},
                    { src: 'assets/stickers/gumamela/gumamela2.png', x: -15, y: 320, size: 190},
                    { src: 'assets/stickers/gumamela/gumamela3.png', x: stackedCanvas.width - 120, y: stackedCanvas.height - 500, size: 135},
                    { src: 'assets/stickers/gumamela/gumamela4.png', x: -15, y: stackedCanvas.height - 250, size: 200}
                ],
                'koi' : [
                    { src: 'assets/stickers/koi/koi1.png', x: stackedCanvas.width - 190, y: 15, size: 210},
                    { src: 'assets/stickers/koi/koi2.png', x: -15, y: 320, size: 140},
                    { src: 'assets/stickers/koi/koi3.png', x: stackedCanvas.width - 120, y: stackedCanvas.height - 500, size: 135},
                    { src: 'assets/stickers/koi/koi4.png', x: -15, y: stackedCanvas.height - 250, size: 200}
                ],
                'money' : [
                    { src: 'assets/stickers/money/money1.png', x: -30, y: -10, size: 250},
                    { src: 'assets/stickers/money/money2.png', x: stackedCanvas.width - 140, y: 350, size: 130},
                    { src: 'assets/stickers/money/money2.png', x: -2, y: 590, size: 130},
                    { src: 'assets/stickers/money/money3.png', x: stackedCanvas.width - 140, y: stackedCanvas.height - 200, size: 130}
                ],
                'swag' : [
                    { src: 'assets/stickers/swag/swag1.png', x: stackedCanvas.width - 190, y: 15, size: 210},
                    { src: 'assets/stickers/swag/swag2.png', x: 10, y: 320, size: 170},
                    { src: 'assets/stickers/swag/swag3.png', x: stackedCanvas.width - 120, y: stackedCanvas.height - 500, size: 135},
                    { src: 'assets/stickers/swag/swag4.png', x: 8, y: stackedCanvas.height - 250, size: 200}
                ],
                'matcha' : [
                    { src: 'assets/stickers/matcha/matcha1.png', x: 15, y: -5, size: 190},
                    { src: 'assets/stickers/matcha/matcha2.png', x: stackedCanvas.width - 170, y: stackedCanvas.height - 200, size: 190}
                ],
                'vsangel' : [
                    { src: 'assets/stickers/vsangel/angel1.png', x: -30, y: -8, size: 200},
                    { src: 'assets/stickers/vsangel/angel2.png', x: stackedCanvas.width - 180, y: 15, size: 150},
                    { src: 'assets/stickers/vsangel/angel3.png',x: stackedCanvas.width - 140, y: 450, size: 130},
                    { src: 'assets/stickers/vsangel/angel4.png', x: -30, y: 770, size: 150},
                    { src: 'assets/stickers/vsangel/angel5.png', x: stackedCanvas.width - 420, y: stackedCanvas.height - 245, size: 250}
                ],
                'mario' : [
                    { src: 'assets/stickers/mario/mario1.png', x: stackedCanvas.width - 190, y: -4, size: 200},
                    { src: 'assets/stickers/mario/mario2.png', x: stackedCanvas.width - 220, y: 210, size: 100},
                    { src: 'assets/stickers/mario/mario3.png', x: -2, y: 590, size: 130},
                    { src: 'assets/stickers/mario/mario2.png', x: 50, y: 800, size: 95},
                    { src: 'assets/stickers/mario/mario4.png', x: stackedCanvas.width - 150, y: stackedCanvas.height - 250, size: 150}
                ],
                'gem1' : [
                    { src: 'assets/stickers/gem/gem1.png', x: stackedCanvas.width - 150, y: 15, size: 170},
                    { src: 'assets/stickers/gem/gem2.png', x: -15, y: 320, size: 140},
                    { src: 'assets/stickers/gem/gem1.png', x: stackedCanvas.width - 120, y: stackedCanvas.height - 500, size: 135},
                    { src: 'assets/stickers/gem/gem2.png', x: -15, y: stackedCanvas.height - 250, size: 160}
                ],
                'gem2' : [
                    { src: 'assets/stickers/gem/gem3.png', x: stackedCanvas.width - 150, y: 15, size: 170},
                    { src: 'assets/stickers/gem/gem4.png', x: -15, y: 320, size: 140},
                    { src: 'assets/stickers/gem/gem3.png', x: stackedCanvas.width - 120, y: stackedCanvas.height - 500, size: 135},
                    { src: 'assets/stickers/gem/gem4.png', x: -15, y: stackedCanvas.height - 250, size: 160}
                ],
                'holidays1' : [
                    { src: 'assets/stickers/holidays1/holidays11.png', x: 235, y: -5, size: 120},

                    { src: 'assets/stickers/holidays1/holidays13.png', x: stackedCanvas.width - 110, y: 395, size: 85},
                    { src: 'assets/stickers/holidays1/holidays14.png', x: stackedCanvas.width - 110, y: 810, size: 120},

                    { src: 'assets/stickers/holidays1/holidays12.png', x: -20, y: 255, size: 125},
                    { src: 'assets/stickers/holidays1/holidays13.png', x: 10, y: 700, size: 80},

                    { src: 'assets/stickers/holidays1/holidays15.png', x: -5, y: stackedCanvas.height - 205, size: 145},
                    { src: 'assets/stickers/holidays1/holidays13.png', x: stackedCanvas.width - 110, y: stackedCanvas.height - 150, size: 70}
                ],
                'holidays2' : [
                    { src: 'assets/stickers/holidays2/holidays21.png', x: 235, y: -5, size: 120},

                    { src: 'assets/stickers/holidays2/holidays22.png', x: stackedCanvas.width - 110, y: 380, size: 120},
                    { src: 'assets/stickers/holidays2/holidays24.png', x: stackedCanvas.width - 110, y: 940, size: 90},

                    { src: 'assets/stickers/holidays2/holidays23.png', x: 5, y: 200, size: 85},
                    { src: 'assets/stickers/holidays2/holidays22.png', x: -10, y: 640, size: 125},

                    { src: 'assets/stickers/holidays2/holidays23.png', x: -5, y: stackedCanvas.height - 205, size: 80},
                    { src: 'assets/stickers/holidays2/holidays25.png', x: stackedCanvas.width - 150, y: stackedCanvas.height - 190, size: 150}
                ],
                'grinch' : [
                    { src: 'assets/stickers/grinch/grinch2.png', x: -3, y: 50, size: 100},
                    { src: 'assets/stickers/grinch/grinch1.png', x: stackedCanvas.width - 150, y: -1, size: 160},
                    { src: 'assets/stickers/grinch/grinch2.png', x: stackedCanvas.width - 90, y: 300, size: 90},
                    { src: 'assets/stickers/grinch/grinch2.png', x: 3, y: 680, size: 95},
                    { src: 'assets/stickers/grinch/grinch3.png', x: 1, y: stackedCanvas.height - 250, size: 100},
                    { src: 'assets/stickers/grinch/grinch3.png', x: -10, y: 395, size: 100},
                    { src: 'assets/stickers/grinch/grinch2.png', x: stackedCanvas.width - 110, y: stackedCanvas.height - 390, size: 70},
                    { src: 'assets/stickers/grinch/grinch4.png', x: stackedCanvas.width - 90, y: 600, size: 90}
                ]




                // ,
                // 'island': [
                //     { src: 'assets/stickers/aloha1.png', x: 10, y: 80, size: 80 },
                //     { src: 'assets/stickers/aloha1.png', x: stackedCanvas.width - 100, y: 320, size: 50 },
                //     { src: 'assets/stickers/aloha1.png', x: stackedCanvas.width - 580, y: 750, size: 50 },
                //     { src: 'assets/stickers/aloha2.png', x: stackedCanvas.width - 100, y: stackedCanvas.height - 180, size: 95 },
                //     { src: 'assets/stickers/aloha2.png', x: stackedCanvas.width - 580, y: stackedCanvas.height - 180, size: 95 }
                // ]
            };
    
            const stickersToDraw = stickerLayouts[selectedSticker];
            if (!stickersToDraw) {
                resolve(); // No stickers found, resolve immediately
                return;
            }
    
            let loadedCount = 0;
            
            stickersToDraw.forEach(({ src, x, y, size }) => {
                const stickerImg = new Image();
                stickerImg.src = src;
                
                stickerImg.onload = function () {
                    ctx.drawImage(stickerImg, x, y, size, size);
                    loadedCount++;
    
                    // Resolve the promise only when all stickers have been drawn
                    if (loadedCount === stickersToDraw.length) {
                        resolve();
                    }
                };
                
                stickerImg.onerror = function () {
                    console.error(`Failed to load sticker: ${src}`);
                    loadedCount++;
                    if (loadedCount === stickersToDraw.length) {
                        resolve(); // Still resolve even if an image fails
                    }
                };
            });
        });
    }

    // ---------------------------------------------------------------
    // Drag & Drop Stickers
    //
    // #photoPreview's <canvas> is destroyed and rebuilt on every unrelated
    // edit (see redrawCanvas/updatePreview above), so a sticker baked into
    // its pixels can't stay interactive. Instead, placed stickers are real
    // DOM nodes in #stickerOverlay - a persistent sibling that sits on top
    // of #photoPreview and never gets torn down - positioned in percentages
    // of #photoStage. That makes dragging/resizing plain style writes (no
    // canvas redraw per frame, no JS resize math to track mobile vs
    // desktop or layout changes), and they only touch actual canvas pixels
    // once, at export time, via drawDragDropStickers().
    // ---------------------------------------------------------------

    const MIN_STICKER_PCT = 6;
    const MAX_STICKER_PCT = 70;
    const DEFAULT_STICKER_PCT = 28;

    function clampStickerPct(value) {
        return Math.min(MAX_STICKER_PCT, Math.max(MIN_STICKER_PCT, value));
    }

    function clampPositionPct(value) {
        return Math.min(100, Math.max(0, value));
    }

    function removePlacedSticker(id) {
        const index = placedStickers.findIndex((s) => s.id === id);
        if (index === -1) return;
        placedStickers[index].el.remove();
        placedStickers.splice(index, 1);
        updateStickerPreviewToggle();
    }

    // The preview toggle only makes sense once something is actually
    // placed - keep it out of the way otherwise, and drop back out of
    // preview mode if the last sticker gets removed while it's active.
    function updateStickerPreviewToggle() {
        if (!stickerPreviewToggle) return;
        const hasStickers = placedStickers.length > 0;
        stickerPreviewToggle.classList.toggle('visible', hasStickers);
        if (!hasStickers && stickerUiHidden) {
            stickerUiHidden = false;
            stickerOverlay.classList.remove('hide-sticker-ui');
            stickerPreviewToggle.setAttribute('aria-pressed', 'false');
            stickerPreviewToggle.title = 'Preview without sticker controls';
        }
    }

    if (stickerPreviewToggle) {
        // The open/closed eye icons swap purely via CSS keyed off
        // aria-pressed (see styles.css) - this only owns the state.
        stickerPreviewToggle.addEventListener('click', () => {
            stickerUiHidden = !stickerUiHidden;
            stickerOverlay.classList.toggle('hide-sticker-ui', stickerUiHidden);
            stickerPreviewToggle.setAttribute('aria-pressed', String(stickerUiHidden));
            stickerPreviewToggle.title = stickerUiHidden ? 'Show sticker controls' : 'Preview without sticker controls';
        });
    }

    // Shared drag helper: captures the pointer on `target` and forwards raw
    // pointermove events to `onMove` until pointerup/cancel, then calls
    // `onEnd`. Each gesture (move/resize/rotate) does its own math on the
    // raw client coordinates since they need different math (linear delta
    // for moving, distance-from-center for resizing, angle-from-center for
    // rotating).
    function trackPointerDrag(target, downEvent, onMove, onEnd) {
        downEvent.preventDefault();
        target.setPointerCapture(downEvent.pointerId);

        function handleMove(moveEvent) {
            onMove(moveEvent);
        }

        function stop(upEvent) {
            target.releasePointerCapture(upEvent.pointerId);
            target.removeEventListener('pointermove', handleMove);
            target.removeEventListener('pointerup', stop);
            target.removeEventListener('pointercancel', stop);
            if (onEnd) onEnd();
        }

        target.addEventListener('pointermove', handleMove);
        target.addEventListener('pointerup', stop);
        target.addEventListener('pointercancel', stop);
    }

    // The sticker's center in screen (client) coordinates - resizing and
    // rotating both pivot around this point, and it only needs recomputing
    // once per gesture since neither gesture changes xPct/yPct.
    function stickerCenter(sticker) {
        const stageRect = photoStage.getBoundingClientRect();
        return {
            x: stageRect.left + (sticker.xPct / 100) * stageRect.width,
            y: stageRect.top + (sticker.yPct / 100) * stageRect.height,
        };
    }

    function applyStickerTransform(sticker) {
        sticker.el.style.transform = `translate(-50%, -50%) rotate(${sticker.rotationDeg}deg)`;
    }

    function createPlacedStickerEl(sticker) {
        const el = document.createElement('div');
        el.className = 'placed-sticker';
        el.style.left = sticker.xPct + '%';
        el.style.top = sticker.yPct + '%';
        el.style.width = sticker.wPct + '%';
        sticker.el = el;
        applyStickerTransform(sticker);

        const img = document.createElement('img');
        img.src = sticker.src;
        img.alt = '';
        img.draggable = false;
        el.appendChild(img);

        const flipBtn = document.createElement('button');
        flipBtn.type = 'button';
        flipBtn.className = 'sticker-control-btn sticker-flip-btn';
        flipBtn.setAttribute('aria-label', 'Flip sticker');
        flipBtn.textContent = '⇋';
        flipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sticker.flipped = !sticker.flipped;
            el.classList.toggle('flipped', sticker.flipped);
        });
        el.appendChild(flipBtn);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'sticker-control-btn sticker-remove-btn';
        removeBtn.setAttribute('aria-label', 'Remove sticker');
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removePlacedSticker(sticker.id);
        });
        el.appendChild(removeBtn);

        // Resizing is distance-from-center based (not a plain horizontal
        // delta) so it works the same regardless of the sticker's current
        // rotation - dragging the handle away from center always grows it.
        // The center is re-measured (via stickerCenter, which itself calls
        // getBoundingClientRect fresh) on every pointermove rather than
        // once at gesture start - iOS Safari can shift the page's scroll
        // position mid-gesture (address bar show/hide, etc.), which would
        // make a cached getBoundingClientRect() stale and throw off every
        // distance/angle computed against it for the rest of the gesture.
        // getBoundingClientRect() is cheap enough to call per-move.
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'sticker-resize-handle';
        resizeHandle.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            const startCenter = stickerCenter(sticker);
            const startDist = Math.hypot(e.clientX - startCenter.x, e.clientY - startCenter.y) || 1;
            const startWPct = sticker.wPct;
            trackPointerDrag(resizeHandle, e, (moveEvent) => {
                const center = stickerCenter(sticker);
                const dist = Math.hypot(moveEvent.clientX - center.x, moveEvent.clientY - center.y);
                sticker.wPct = clampStickerPct(startWPct * (dist / startDist));
                el.style.width = sticker.wPct + '%';
            });
        });
        el.appendChild(resizeHandle);

        // Rotation tracks the angle from the sticker's center to the
        // pointer, relative to where that angle started - so grabbing the
        // handle anywhere and swinging it around feels natural at any
        // starting angle, not just straight up. Center re-measured every
        // move for the same reason as the resize handle above.
        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'sticker-rotate-handle';
        rotateHandle.setAttribute('role', 'button');
        rotateHandle.setAttribute('aria-label', 'Rotate sticker');
        rotateHandle.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            const startCenter = stickerCenter(sticker);
            const startAngle = Math.atan2(e.clientY - startCenter.y, e.clientX - startCenter.x) * (180 / Math.PI);
            const startRotation = sticker.rotationDeg;
            trackPointerDrag(rotateHandle, e, (moveEvent) => {
                const center = stickerCenter(sticker);
                const angle = Math.atan2(moveEvent.clientY - center.y, moveEvent.clientX - center.x) * (180 / Math.PI);
                sticker.rotationDeg = startRotation + (angle - startAngle);
                applyStickerTransform(sticker);
            });
        });
        el.appendChild(rotateHandle);

        el.addEventListener('pointerdown', (e) => {
            // Let the buttons/handles above handle their own pointerdown -
            // this only starts a move-drag when the sticker body itself
            // (or its image) was pressed.
            if (e.target !== el && e.target !== img) return;
            el.classList.add('dragging');
            const startX = e.clientX;
            const startY = e.clientY;
            const startXPct = sticker.xPct;
            const startYPct = sticker.yPct;
            // stageRect is re-measured on every move (not cached once here)
            // for the same scroll/viewport-shift reason as stickerCenter
            // above - this is what ultimately sets sticker.xPct/yPct, the
            // values baked into the downloaded photo, so a stale rect here
            // is exactly how a sticker ends up placed somewhere other than
            // where it visually looked like it was dropped.
            trackPointerDrag(el, e, (moveEvent) => {
                const stageRect = photoStage.getBoundingClientRect();
                sticker.xPct = clampPositionPct(startXPct + ((moveEvent.clientX - startX) / stageRect.width) * 100);
                sticker.yPct = clampPositionPct(startYPct + ((moveEvent.clientY - startY) / stageRect.height) * 100);
                el.style.left = sticker.xPct + '%';
                el.style.top = sticker.yPct + '%';
            }, () => el.classList.remove('dragging'));
        });

        return el;
    }

    function addDragDropSticker(src) {
        if (!stickerOverlay || !photoStage) return;
        const sticker = {
            id: ++stickerIdSeq,
            src,
            xPct: 50,
            yPct: 50,
            wPct: DEFAULT_STICKER_PCT,
            rotationDeg: 0,
            flipped: false,
            el: null,
        };
        placedStickers.push(sticker);
        stickerOverlay.appendChild(createPlacedStickerEl(sticker));
        updateStickerPreviewToggle();
    }

    if (dragDropStickerPicker) {
        // One delegated listener instead of one per button (there are 30+
        // stickers, and more may be added to assets/drag-drop-stickers/
        // later without needing new listeners here).
        dragDropStickerPicker.addEventListener('click', (e) => {
            const btn = e.target.closest('.dd-sticker-btn');
            if (btn) addDragDropSticker(btn.dataset.src);
        });
    }

    // Cache loaded sticker images (as promises, so concurrent exports -
    // e.g. download then immediately share - reuse the same in-flight
    // load instead of double-fetching) since the same sticker can be
    // placed more than once and exported more than once per session.
    const stickerImageCache = new Map();
    function loadStickerImage(src) {
        if (!stickerImageCache.has(src)) {
            stickerImageCache.set(src, new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            }));
        }
        return stickerImageCache.get(src);
    }

    // Bakes every placed sticker onto the export canvas at its stored
    // percentage position/size, preserving each image's own aspect ratio
    // and mirroring it when flipped.
    async function drawDragDropStickers(ctx, canvas) {
        if (!placedStickers.length) return;

        const images = await Promise.all(
            placedStickers.map((sticker) => loadStickerImage(sticker.src).catch(() => null))
        );

        placedStickers.forEach((sticker, i) => {
            const img = images[i];
            if (!img) return;

            const w = (sticker.wPct / 100) * canvas.width;
            const h = w * (img.height / img.width);
            const cx = (sticker.xPct / 100) * canvas.width;
            const cy = (sticker.yPct / 100) * canvas.height;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((sticker.rotationDeg * Math.PI) / 180);
            if (sticker.flipped) ctx.scale(-1, 1);
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
            ctx.restore();
        });
    }

    // ---------------------------------------------------------------
    // Doodle
    //
    // #doodleCanvas is a real <canvas>, not a DOM overlay like the
    // stickers - freehand strokes are pixels, so there's nothing to keep
    // "interactive" after the fact the way a placed sticker is. Its
    // intrinsic size is kept identical to the export canvas's own size
    // (see ensureDoodleCanvasSize, called from redrawCanvas whenever the
    // photo count/layout changes canvasWidth/canvasHeight), so drawing
    // coordinates convert straight from screen space with one scale
    // factor and drawDoodle() can just copy the whole canvas onto the
    // export with no further transform.
    // ---------------------------------------------------------------

    // Resizing a <canvas> clears it, so this only actually resizes (and
    // wipes any doodle + undo history) when the export dimensions genuinely
    // change - not on every redrawCanvas() call, which would otherwise
    // erase the user's drawing on every unrelated edit.
    function ensureDoodleCanvasSize(width, height) {
        if (!doodleCanvas) return;
        if (doodleCanvas.width === width && doodleCanvas.height === height) return;
        doodleCanvas.width = width;
        doodleCanvas.height = height;
        doodleUndoStack = [];
        updateDoodleUndoButtonState();
    }

    function getDoodlePoint(evt) {
        const rect = doodleCanvas.getBoundingClientRect();
        const scaleX = doodleCanvas.width / rect.width;
        const scaleY = doodleCanvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY,
            scale: scaleX,
        };
    }

    function pushDoodleUndoSnapshot() {
        if (!doodleCtx) return;
        doodleUndoStack.push(doodleCtx.getImageData(0, 0, doodleCanvas.width, doodleCanvas.height));
        if (doodleUndoStack.length > DOODLE_MAX_UNDO_STEPS) doodleUndoStack.shift();
        updateDoodleUndoButtonState();
    }

    function updateDoodleUndoButtonState() {
        if (doodleUndoBtn) doodleUndoBtn.disabled = doodleUndoStack.length === 0;
    }

    function setDoodleActive(active) {
        doodleActive = active;
        if (doodleCanvas) doodleCanvas.classList.toggle('active', active);
        if (stickerOverlay) stickerOverlay.classList.toggle('doodle-active', active);
        if (doodleToggleBtn) {
            doodleToggleBtn.classList.toggle('active', active);
            doodleToggleBtn.setAttribute('aria-pressed', String(active));
            doodleToggleBtn.textContent = active ? 'Stop Drawing' : 'Start Drawing';
        }
    }

    if (doodleCanvas && doodleCtx) {
        doodleCanvas.addEventListener('pointerdown', (e) => {
            if (!doodleActive) return;
            e.preventDefault();
            doodleCanvas.setPointerCapture(e.pointerId);
            pushDoodleUndoSnapshot();
            doodleDrawing = true;

            const { x, y, scale } = getDoodlePoint(e);
            doodleCtx.lineJoin = 'round';
            doodleCtx.lineCap = 'round';
            doodleCtx.strokeStyle = doodleColor;
            doodleCtx.lineWidth = doodleSize * scale;
            doodleCtx.beginPath();
            doodleCtx.moveTo(x, y);
            doodleCtx.lineTo(x, y); // draws a dot on a plain tap/click
            doodleCtx.stroke();
        });

        doodleCanvas.addEventListener('pointermove', (e) => {
            if (!doodleActive || !doodleDrawing) return;
            const { x, y } = getDoodlePoint(e);
            doodleCtx.lineTo(x, y);
            doodleCtx.stroke();
        });

        const endDoodleStroke = () => { doodleDrawing = false; };
        doodleCanvas.addEventListener('pointerup', endDoodleStroke);
        doodleCanvas.addEventListener('pointercancel', endDoodleStroke);
    }

    if (doodleColorSwatches) {
        doodleColorSwatches.addEventListener('click', (e) => {
            const btn = e.target.closest('.doodle-color-btn');
            if (!btn || !btn.dataset.color) return;
            doodleColor = btn.dataset.color;
            doodleColorSwatches.querySelectorAll('.doodle-color-btn').forEach((el) => {
                el.classList.toggle('active', el === btn);
                el.setAttribute('aria-pressed', String(el === btn));
            });
        });
    }

    if (doodleColorPicker) {
        doodleColorPicker.addEventListener('input', () => {
            doodleColor = doodleColorPicker.value;
            if (doodleColorSwatches) {
                doodleColorSwatches.querySelectorAll('.doodle-color-btn').forEach((el) => {
                    el.classList.remove('active');
                    el.setAttribute('aria-pressed', 'false');
                });
            }
        });
    }

    if (doodleSizeButtons) {
        doodleSizeButtons.addEventListener('click', (e) => {
            const btn = e.target.closest('.doodle-size-btn');
            if (!btn || !btn.dataset.size) return;
            doodleSize = Number(btn.dataset.size);
            doodleSizeButtons.querySelectorAll('.doodle-size-btn').forEach((el) => {
                el.classList.toggle('active', el === btn);
                el.setAttribute('aria-pressed', String(el === btn));
            });
        });
    }

    if (doodleToggleBtn) {
        doodleToggleBtn.addEventListener('click', () => setDoodleActive(!doodleActive));
    }

    if (doodleUndoBtn) {
        updateDoodleUndoButtonState();
        doodleUndoBtn.addEventListener('click', () => {
            const snapshot = doodleUndoStack.pop();
            if (!snapshot || !doodleCtx) return;
            doodleCtx.putImageData(snapshot, 0, 0);
            updateDoodleUndoButtonState();
        });
    }

    if (doodleClearBtn) {
        doodleClearBtn.addEventListener('click', () => {
            if (!doodleCtx || !doodleCanvas) return;
            pushDoodleUndoSnapshot();
            doodleCtx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
        });
    }

    // Composites the doodle onto the export canvas. No scaling/positioning
    // math needed here - ensureDoodleCanvasSize keeps #doodleCanvas's pixel
    // dimensions identical to the export canvas's, so this is a direct 1:1
    // copy.
    function drawDoodle(ctx, canvas) {
        if (!doodleCanvas || doodleCanvas.width !== canvas.width || doodleCanvas.height !== canvas.height) return;
        ctx.drawImage(doodleCanvas, 0, 0);
    }

    function clipAndDrawImage(ctx, img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, shapeType) {
        ctx.save();
        ctx.beginPath();
    
        const centerX = dx + dWidth / 2;
        const centerY = dy + dHeight / 2;
    
        if (shapeType === 'circle') {
            const radius = Math.min(dWidth, dHeight) / 2;
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        } else if (shapeType === 'rounded') {
            const radius = 30;
            ctx.moveTo(dx + radius, dy);
            ctx.lineTo(dx + dWidth - radius, dy);
            ctx.quadraticCurveTo(dx + dWidth, dy, dx + dWidth, dy + radius);
            ctx.lineTo(dx + dWidth, dy + dHeight - radius);
            ctx.quadraticCurveTo(dx + dWidth, dy + dHeight, dx + dWidth - radius, dy + dHeight);
            ctx.lineTo(dx + radius, dy + dHeight);
            ctx.quadraticCurveTo(dx, dy + dHeight, dx, dy + dHeight - radius);
            ctx.lineTo(dx, dy + radius);
            ctx.quadraticCurveTo(dx, dy, dx + radius, dy);
        } else if (shapeType === 'heart') {
            ctx.beginPath();

            // Start at the bottom point
            ctx.moveTo(dx + dWidth / 2, dy + dHeight);

            // Right side of heart with deeper curve
            ctx.bezierCurveTo(
                dx + dWidth * 1.25, dy + dHeight * 0.7,    // More pronounced right bulge
                dx + dWidth * 0.9, dy - dHeight * 0.1,     // Higher right top control point
                dx + dWidth / 2, dy + dHeight * 0.25       // Deeper V dip at top
            );

            // Left side of heart, mirror of right side
            ctx.bezierCurveTo(
                dx + dWidth * 0.1, dy - dHeight * 0.1,     // Higher left top control point
                dx - dWidth * 0.25, dy + dHeight * 0.7,    // More pronounced left bulge
                dx + dWidth / 2, dy + dHeight              // Back to bottom point
            );

            ctx.closePath();
        } 
        // else if (shapeType === 'petal') {
        //     const size = Math.min(dWidth, dHeight) * 0.32; // Adjust size to fill the frame
        //     const sizeX = Math.min(dWidth, dHeight) * 0.52; // Adjust size to fill the frame
    
        //     ctx.beginPath();
            
        //     // Helper function to draw each lobe of the clover
        //     function drawLobe(x, y, radius) {
        //         ctx.moveTo(centerX, centerY);
        //         ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        //     }
            
        //     // Draw the four lobes of the clover
        //     drawLobe(centerX - sizeX * 0.5, centerY - size * 0.5, size); // Top-left
        //     drawLobe(centerX + sizeX * 0.5, centerY - size * 0.5, size); // Top-right
        //     drawLobe(centerX - sizeX * 0.5, centerY + size * 0.5, size); // Bottom-left
        //     drawLobe(centerX + sizeX * 0.5, centerY + size * 0.5, size); // Bottom-right
            
        //     // Fill the clover shape
        //     ctx.fill();
            
        //     // Use it as a clip path
        //     ctx.clip();
        // }
        // else if (shapeType === 'cat') {
            
        // }
        else {
            ctx.rect(dx, dy, dWidth, dHeight); // default rectangle
        }
    
        ctx.clip();
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        ctx.restore();
    }

    // heartFrameBtn.addEventListener('click', () => {
    //     selectedShape = 'heart';
    //     redrawCanvas();
    // });
    
    // circleFrameBtn.addEventListener('click', () => {
    //     selectedShape = 'circle';
    //     redrawCanvas();
    // });
    
    // roundEdgeFrameBtn.addEventListener('click', () => {
    //     selectedShape = 'rounded';
    //     redrawCanvas();
    // });

    const allFrameButtons = [heartFrameBtn, circleFrameBtn, roundEdgeFrameBtn, normalFrameBtn];

    function resetFrameBackgrounds() {
      allFrameButtons.forEach(btn => {
        if (btn) btn.classList.remove('is-selected');
      });
    }
    
    if (heartFrameBtn) {
      heartFrameBtn.addEventListener('click', () => {
        resetFrameBackgrounds();
        selectedShape = 'heart';
        heartFrameBtn.classList.add('is-selected');
        redrawCanvas(storedImages);
      });
    }
    
    if (circleFrameBtn) {
      circleFrameBtn.addEventListener('click', () => {
        resetFrameBackgrounds();
        selectedShape = 'circle';
        circleFrameBtn.classList.add('is-selected');
        redrawCanvas(storedImages);
      });
    }
    
    if (roundEdgeFrameBtn) {
      roundEdgeFrameBtn.addEventListener('click', () => {
        resetFrameBackgrounds();
        selectedShape = 'rounded';
        roundEdgeFrameBtn.classList.add('is-selected');
        redrawCanvas(storedImages);
      });
    }
    
    if (normalFrameBtn) {
      normalFrameBtn.addEventListener('click', () => {
        resetFrameBackgrounds();
        selectedShape = 'default'; // or 'none'
        normalFrameBtn.classList.add('is-selected');
        redrawCanvas(storedImages);
      });
    }

    // petalFrameBtn.addEventListener('click', () => {
    //     selectedShape = 'petal';
    //     redrawCanvas();
    // });

    // catFrameBtn.addEventListener('click', () => {
    //     selectedShape = 'cat';
    //     redrawCanvas();
    // });

    // normalFrameBtn.addEventListener('click', () => {
    //     selectedShape = 'default'; // or 'none'
    //     redrawCanvas();
    // });
    

    // Function to redraw the canvas with stored images & selected background
    function redrawCanvas(storedImages) {
        console.log(`Redrawing canvas with background: ${backgroundType}`);

        const stackedCanvas = document.createElement('canvas');
        const ctx = stackedCanvas.getContext('2d');

        let canvasWidth;
        let canvasHeight;

        if (imageArrayLength > 3) {
            canvasWidth = 624;
            canvasHeight = 1800;
        }
        
        else {
            canvasWidth = 592;
            canvasHeight = 1352;
        }

        ensureDoodleCanvasSize(canvasWidth, canvasHeight);

        const borderWidth = 30; //previously 40
        const spacing = 12; //previously 20
        const bottomPadding = 100;

        const availableHeight = canvasHeight - (borderWidth * 2) - (spacing * 2) - bottomPadding;
        const photoHeight = availableHeight / imageArrayLength;
        const photoWidth = canvasWidth - (borderWidth * 2);

        currentPhotoLayout = { borderWidth, spacing, photoWidth, photoHeight, count: imageArrayLength };



        stackedCanvas.width = canvasWidth;
        stackedCanvas.height = canvasHeight;

        // ctx.fillStyle = backgroundType;
        // ctx.fillRect(0, 0, stackedCanvas.width, stackedCanvas.height);
        // Clear the entire canvas first
        ctx.clearRect(0, 0, stackedCanvas.width, stackedCanvas.height);

        if (backgroundType === 'color') {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, stackedCanvas.width, stackedCanvas.height);
            if(backgroundColor !== '#000000' && backgroundColor !== '#780000' && backgroundColor !== '#90a955') {
                ctx.fillStyle = 'black';
            }
            else {
                ctx.fillStyle = '#FFFFFF';
            }
        } else if (backgroundType === 'image' && backgroundImage) {
            drawImageCover(ctx, backgroundImage, 0, 0, stackedCanvas.width, stackedCanvas.height);
            const imageName = backgroundImage.src.split('/').pop(); // just the filename

            const darkImages = [
                'pink-glitter.jpg',
                'brown-leopard.jpg',
                'red-leather.jpg',
                'ribbon-denim.jpg',
                'black-pink-ribbon.jpg',
                'green-hills.jpg',
                'sand-shells.jpg',
                'coco-trees.jpg',
                'brown-knitted.jpg',
                'red-knitted.jpg',
                'blue-yellow-squares.jpg',
                '4-lockers.jpg',
                'black-trash.jpg',
                'party-drape.jpg',
                'party-dots.jpg',
                'bling-denim.jpg',
                'gray-3d.jpg',
                'pink-leopard.jpg',
                'big-brwp-polka.jpg',
                'big-brp-polka.jpg',
                'black-bedazzled.png',
                'brp-polka.jpg',
                'forever-blessed.jpg',
                'pink-bedazzled.jpg',
                'vegas.jpg',
                'red-curtain.jpg'
            ];

            if (darkImages.includes(imageName)) {
                ctx.fillStyle = '#FFFFFF';
            } else {
                ctx.fillStyle = '#000000';
            }
        }

        // if(backgroundType !== '#000000' && backgroundType !== '#780000' && backgroundType !== '#90a955') {
        //     ctx.fillStyle = 'black';
        // }
        // else {
        //     ctx.fillStyle = '#FFFFFF';
        // }
        ctx.font = 'bold 32px Arial, Roboto, sans-serif'; //prev 24px
        ctx.textAlign = 'center';
        ctx.fillText(selectedText, stackedCanvas.width / 2, stackedCanvas.height - 55);
        // ctx.fillText('photobooth', stackedCanvas.width / 2, stackedCanvas.height - 65);

        // ctx.fillStyle = '#D3D3D3';
        // ctx.font = '13px "DM Sans", Arial, Roboto, sans-serif';
        // ctx.textAlign = 'center';
        // ctx.fillText('©jmm', stackedCanvas.width / 2, stackedCanvas.height - 45);

        // Check if either date or time checkbox is checked
        if (dateCheckbox.checked || dateTimeCheckbox.checked) {
            const currentDate = new Date();
            let displayText = '';

            // Add date if Date checkbox is checked
            if (dateCheckbox.checked) {
                displayText += currentDate.toLocaleDateString();
            }

            // Add time if DateTime checkbox is checked
            if (dateTimeCheckbox.checked) {
                const timeString = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                displayText += dateCheckbox.checked ? ' ' + timeString : timeString;
            }

            // Set text color based on background
            if (backgroundType === 'color') {
                ctx.fillStyle = (backgroundColor !== '#000000' && backgroundColor !== '#780000' && backgroundColor !== '#90a955') 
                    ? 'black' 
                    : '#FFFFFF';
            } else if (backgroundType === 'image' && backgroundImage) {
                const imageName = backgroundImage.src.split('/').pop();
                const darkImages = [
                    'pink-glitter.jpg',
                    'brown-leopard.jpg',
                    'red-leather.jpg',
                    'ribbon-denim.jpg',
                    'black-pink-ribbon.jpg',
                    'green-hills.jpg',
                    'sand-shells.jpg',
                    'coco-trees.jpg',
                    'brown-knitted.jpg',
                    'red-knitted.jpg',
                    'blue-yellow-squares.jpg',
                    '4-lockers.jpg',
                    'black-trash.jpg',
                    'party-drape.jpg',
                    'party-dots.jpg',
                    'bling-denim.jpg',
                    'gray-3d.jpg',
                    'pink-leopard.jpg',
                    'big-brwp-polka.jpg',
                    'big-brp-polka.jpg',
                    'black-bedazzled.png',
                    'brp-polka.jpg',
                    'forever-blessed.jpg',
                    'pink-bedazzled.jpg',
                    'vegas.jpg',
                    'red-curtain.jpg'
                ];
                ctx.fillStyle = darkImages.includes(imageName) ? '#FFFFFF' : '#000000';
            }

            ctx.font = '18px "DM Sans", Arial, Roboto, sans-serif';
            ctx.textAlign = 'center';

            // Draw the text at the center-bottom of the canvas
            ctx.fillText(displayText, stackedCanvas.width / 2, stackedCanvas.height - 30);
        }
        
        // updatePreview(stackedCanvas);

        // Draw stored images if available
        if (storedImages && storedImages.length === imageArrayLength) {
            let loadedImages = 0;
            
            storedImages.forEach((imgData, index) => {
                const img = new Image();
                img.src = imgData;
                img.onload = function () {
                    const imgAspect = img.width / img.height;
                    const targetAspect = photoWidth / photoHeight;

                    let sx, sy, sWidth, sHeight;

                    if (imgAspect > targetAspect) {
                        // Image is wider -> Crop the sides
                        sHeight = img.height;
                        sWidth = img.height * targetAspect;
                        sx = (img.width - sWidth) / 2;
                        sy = 0;
                    } else {
                        // Image is taller -> Crop the top and bottom
                        sWidth = img.width;
                        sHeight = img.width / targetAspect;
                        sx = 0;
                        sy = (img.height - sHeight) / 2;
                    }

                    if (typeof PhotoAdjust !== 'undefined') {
                        ({ sx, sy, sWidth, sHeight } = PhotoAdjust.applyToSourceRect({ sx, sy, sWidth, sHeight }, img.width, img.height, index));
                    }

                    const x = borderWidth;
                    const y = borderWidth + index * (photoHeight + spacing);
                    // ctx.drawImage(img, x, y, photoWidth, photoHeight);
                    // ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, photoWidth, photoHeight);
                    clipAndDrawImage(ctx, img, sx, sy, sWidth, sHeight, x, y, photoWidth, photoHeight, selectedShape);

                    loadedImages++;
                    if (loadedImages === imageArrayLength) {
                        drawSticker(ctx, stackedCanvas);
                        updatePreview(stackedCanvas);
                        
                    }

                    
                };
            });
        } else {
            console.log("No stored images found.");
        }
    }

    
    // update preview of canvas
    function updatePreview(canvas) {
        if (photoCustomPreview) {
            photoCustomPreview.innerHTML = ''; // Clear old content
            photoCustomPreview.appendChild(canvas); // Append new canvas

            // canvas.style.width = "230px"; //prev 170px
            // Detect if the device is mobile based on screen width
            if (window.innerWidth <= 768) {
                // Mobile size
                canvas.style.width = "150px";
            } else {
                // Default/desktop size
                canvas.style.width = "230px";
            }
            if(backgroundType == '#FFFFFF') {
                canvas.style.border = '1px solid black';
            }
            
        }
    }

    // Draws `img` scaled and cropped to fully cover the destination box
    // (like CSS background-size: cover) instead of stretching it to fit.
    // Background frame images (gradients/patterns) don't share the photo
    // strip canvas's aspect ratio, so a plain drawImage(img, 0, 0, w, h)
    // squashes/stretches them - this crops instead, same approach already
    // used for the individual photo tiles above.
    function drawImageCover(ctx, img, dx, dy, dWidth, dHeight) {
        const imgAspect = img.width / img.height;
        const boxAspect = dWidth / dHeight;
        let sx, sy, sWidth, sHeight;

        if (imgAspect > boxAspect) {
            sHeight = img.height;
            sWidth = img.height * boxAspect;
            sx = (img.width - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = img.width;
            sHeight = img.width / boxAspect;
            sx = 0;
            sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }

    // Detect if the user is on an iOS device
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
    
    // async function downloadCanvasCopy() {
    //     const stackedCanvas = document.createElement('canvas');
    //     const ctx = stackedCanvas.getContext('2d');
    
    //     let canvasWidth;
    //     let canvasHeight;

    //     if (imageArrayLength > 3) {
    //         canvasWidth = 624;
    //         canvasHeight = 1800;
    //     }

    //     else {
    //         canvasWidth = 592;
    //         canvasHeight = 1352;
    //     }
    //     const borderWidth = 30; //previously 40
    //     const spacing = 12; //previously 20
    //     const bottomPadding = 100;
    
    //     const availableHeight = canvasHeight - (borderWidth * 2) - (spacing * 2) - bottomPadding;
    //     const photoHeight = availableHeight / imageArrayLength;
    //     const photoWidth = canvasWidth - (borderWidth * 2);
    
    //     stackedCanvas.width = canvasWidth;
    //     stackedCanvas.height = canvasHeight;
    
    //     // ctx.fillStyle = backgroundType;
    //     // ctx.fillRect(0, 0, stackedCanvas.width, stackedCanvas.height);
    //     ctx.clearRect(0, 0, stackedCanvas.width, stackedCanvas.height);

    //     if (backgroundType === 'color') {
    //         ctx.fillStyle = backgroundColor;
    //         ctx.fillRect(0, 0, stackedCanvas.width, stackedCanvas.height);
    //     } else if (backgroundType === 'image' && backgroundImage) {
    //         ctx.drawImage(backgroundImage, 0, 0, stackedCanvas.width, stackedCanvas.height);
    //     }
    
    //     // Draw watermark text
    //     // ctx.fillStyle = '#D3D3D3';
    //     // ctx.font = '13px "DM Sans", Arial, Roboto, sans-serif';
    //     // ctx.textAlign = 'center';
    //     // ctx.fillText('©jmm', stackedCanvas.width / 2, stackedCanvas.height - 45);
    
    //     // Check if either date or time checkbox is checked
    //     if (dateCheckbox.checked || dateTimeCheckbox.checked) {
    //         const currentDate = new Date();
    //         let displayText = '';

    //         // Add date if Date checkbox is checked
    //         if (dateCheckbox.checked) {
    //             displayText += currentDate.toLocaleDateString();
    //         }

    //         // Add time if DateTime checkbox is checked
    //         if (dateTimeCheckbox.checked) {
    //             const timeString = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    //             displayText += dateCheckbox.checked ? ' ' + timeString : timeString;
    //         }

    //         // Set text color based on background
    //         if (backgroundType === 'color') {
    //             ctx.fillStyle = (backgroundColor !== '#000000' && backgroundColor !== '#780000' && backgroundColor !== '#90a955') 
    //                 ? 'black' 
    //                 : '#FFFFFF';
    //         } else if (backgroundType === 'image' && backgroundImage) {
    //             const imageName = backgroundImage.src.split('/').pop();
    //             const darkImages = [
    //                 'pink-glitter.jpg',
    //                 'brown-leopard.jpg',
    //                 'red-leather.jpg',
    //                 'ribbon-denim.jpg',
    //                 'black-pink-ribbon.jpg',
    //                 'green-hills.jpg',
    //                 'sand-shells.jpg',
    //                 'coco-trees.jpg',
    //                 'brown-knitted.jpg',
    //                 'red-knitted.jpg',
    //                 'blue-yellow-squares.jpg',
    //                 '4-lockers.jpg',
    //                 'black-trash.jpg',
    //                 'party-drape.jpg',
    //                 'party-dots.jpg',
    //                 'bling-denim.jpg'
    //             ];
    //             ctx.fillStyle = darkImages.includes(imageName) ? '#FFFFFF' : '#000000';
    //         }

    //         ctx.font = '18px "DM Sans", Arial, Roboto, sans-serif';
    //         ctx.textAlign = 'center';

    //         // Draw the text at the center-bottom of the canvas
    //         ctx.fillText(displayText, stackedCanvas.width / 2, stackedCanvas.height - 30);
    //     }
    
    //     if (storedImages && storedImages.length === imageArrayLength) {
    //         let loadedImages = 0;
    
    //         storedImages.forEach((imgData, index) => {
    //             const img = new Image();
    //             img.src = imgData;
    //             img.onload = async function () {
    //                 // const x = borderWidth;
    //                 // const y = borderWidth + index * (photoHeight + spacing);
    //                 // ctx.drawImage(img, x, y, photoWidth, photoHeight);
    //                 const imgAspect = img.width / img.height;
    //                 const targetAspect = photoWidth / photoHeight;

    //                 let sx, sy, sWidth, sHeight;

    //                 if (imgAspect > targetAspect) {
    //                     // Image is wider -> Crop the sides
    //                     sHeight = img.height;
    //                     sWidth = img.height * targetAspect;
    //                     sx = (img.width - sWidth) / 2;
    //                     sy = 0;
    //                 } else {
    //                     // Image is taller -> Crop the top and bottom
    //                     sWidth = img.width;
    //                     sHeight = img.width / targetAspect;
    //                     sx = 0;
    //                     sy = (img.height - sHeight) / 2;
    //                 }

    //                 const x = borderWidth;
    //                 const y = borderWidth + index * (photoHeight + spacing);
    //                 // ctx.drawImage(img, x, y, photoWidth, photoHeight);
    //                 //ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, photoWidth, photoHeight);
    //                 clipAndDrawImage(ctx, img, sx, sy, sWidth, sHeight, x, y, photoWidth, photoHeight, selectedShape);

    
    //                 loadedImages++;
    //                 if (loadedImages === imageArrayLength) {
    //                     drawTextAndDate(ctx, stackedCanvas);
    //                     // **NOW draw stickers after images load**
    //                     await drawSticker(ctx, stackedCanvas);

    //                     const imageData = stackedCanvas.toDataURL('image/png');

    //                     //fix ios download setting
    //                     if (isIOS()) {
    //                         // // iOS Fix: Open the image in a new tab instead of downloading
    //                         // const newWindow = window.open();
    //                         // newWindow.document.write('<img src="' + imageData + '" style="width:100%;"/>');
    //                         // Convert Base64 to Blob
    //                         const byteCharacters = atob(imageData.split(',')[1]);
    //                         const byteNumbers = new Array(byteCharacters.length);
    //                         for (let i = 0; i < byteCharacters.length; i++) {
    //                             byteNumbers[i] = byteCharacters.charCodeAt(i);
    //                         }
    //                         const byteArray = new Uint8Array(byteNumbers);
    //                         const blob = new Blob([byteArray], { type: 'image/png' });

    //                         // Create a temporary file link
    //                         const link = document.createElement('a');
    //                         const url = URL.createObjectURL(blob);
    //                         link.href = url;
    //                         link.download = 'photobooth.png';
                            
    //                         // Append and trigger the download
    //                         document.body.appendChild(link);
    //                         link.click();
                            
    //                         // Cleanup
    //                         document.body.removeChild(link);
    //                         URL.revokeObjectURL(url);

    //                     } else {
    //                         // Normal Download for Android and Desktop
    //                         const link = document.createElement('a');
    //                         link.href = imageData;
    //                         link.download = 'photobooth.png';
    //                         document.body.appendChild(link);
    //                         link.click();
    //                         document.body.removeChild(link);
    //                     }
    
    //                     // // Download canvas after everything is drawn
    //                     // const link = document.createElement('a');
    //                     // link.href = stackedCanvas.toDataURL('image/png');
    //                     // link.download = 'photobooth.png';
    //                     // link.click();
    //                     // console.log('Canvas downloaded successfully!');
    //                 }
    //             };
    
    //             img.onerror = function () {
    //                 console.error(`Failed to load image: ${img.src}`);
    //             };
    //         });
    //     } else {
    //         console.log("No stored images found.");
    //     }
    // }
    
    async function buildPhotoStripCanvas() {
        const stackedCanvas = document.createElement('canvas');
        const ctx = stackedCanvas.getContext('2d');

        let canvasWidth;
        let canvasHeight;

        if (imageArrayLength > 3) {
            canvasWidth = 624;
            canvasHeight = 1800;
        } else {
            canvasWidth = 592;
            canvasHeight = 1352;
        }

        const borderWidth = 30;
        const spacing = 12;
        const bottomPadding = 100;

        const availableHeight = canvasHeight - (borderWidth * 2) - (spacing * 2) - bottomPadding;
        const photoHeight = availableHeight / imageArrayLength;
        const photoWidth = canvasWidth - (borderWidth * 2);

        stackedCanvas.width = canvasWidth;
        stackedCanvas.height = canvasHeight;

        ctx.clearRect(0, 0, stackedCanvas.width, stackedCanvas.height);

        // Draw background
        if (backgroundType === 'color') {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, stackedCanvas.width, stackedCanvas.height);
        } else if (backgroundType === 'image' && backgroundImage) {
            drawImageCover(ctx, backgroundImage, 0, 0, stackedCanvas.width, stackedCanvas.height);
        }

        // Draw date/time
        if (dateCheckbox.checked || dateTimeCheckbox.checked) {
            const currentDate = new Date();
            let displayText = '';

            if (dateCheckbox.checked) {
                displayText += currentDate.toLocaleDateString();
            }

            if (dateTimeCheckbox.checked) {
                const timeString = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                displayText += dateCheckbox.checked ? ' ' + timeString : timeString;
            }

            if (backgroundType === 'color') {
                ctx.fillStyle = (backgroundColor !== '#000000' && backgroundColor !== '#780000' && backgroundColor !== '#90a955') 
                    ? 'black' 
                    : '#FFFFFF';
            } else if (backgroundType === 'image' && backgroundImage) {
                const imageName = backgroundImage.src.split('/').pop();
                const darkImages = [
                    'pink-glitter.jpg', 'brown-leopard.jpg', 'red-leather.jpg', 'ribbon-denim.jpg',
                    'black-pink-ribbon.jpg', 'green-hills.jpg', 'sand-shells.jpg', 'coco-trees.jpg',
                    'brown-knitted.jpg', 'red-knitted.jpg', 'blue-yellow-squares.jpg', '4-lockers.jpg',
                    'black-trash.jpg', 'party-drape.jpg', 'party-dots.jpg', 'bling-denim.jpg',
                    'gray-3d.jpg',
                    'pink-leopard.jpg',
                    'big-brwp-polka.jpg',
                    'big-brp-polka.jpg',
                    'black-bedazzled.png',
                    'brp-polka.jpg',
                    'forever-blessed.jpg',
                    'pink-bedazzled.jpg',
                    'vegas.jpg',
                    'red-curtain.jpg'
                ];
                ctx.fillStyle = darkImages.includes(imageName) ? '#FFFFFF' : '#000000';
            }

            ctx.font = '18px "DM Sans", Arial, Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(displayText, stackedCanvas.width / 2, stackedCanvas.height - 30);
        }

        // Return promise that resolves when all images are loaded and drawn
        return new Promise((resolve) => {
            if (storedImages && storedImages.length === imageArrayLength) {
                let loadedImages = 0;

                storedImages.forEach((imgData, index) => {
                    const img = new Image();
                    img.src = imgData;
                    img.onload = async function () {
                        const imgAspect = img.width / img.height;
                        const targetAspect = photoWidth / photoHeight;

                        let sx, sy, sWidth, sHeight;

                        if (imgAspect > targetAspect) {
                            sHeight = img.height;
                            sWidth = img.height * targetAspect;
                            sx = (img.width - sWidth) / 2;
                            sy = 0;
                        } else {
                            sWidth = img.width;
                            sHeight = img.width / targetAspect;
                            sx = 0;
                            sy = (img.height - sHeight) / 2;
                        }

                        if (typeof PhotoAdjust !== 'undefined') {
                            ({ sx, sy, sWidth, sHeight } = PhotoAdjust.applyToSourceRect({ sx, sy, sWidth, sHeight }, img.width, img.height, index));
                        }

                        const x = borderWidth;
                        const y = borderWidth + index * (photoHeight + spacing);
                        clipAndDrawImage(ctx, img, sx, sy, sWidth, sHeight, x, y, photoWidth, photoHeight, selectedShape);

                        loadedImages++;
                        if (loadedImages === imageArrayLength) {
                            drawTextAndDate(ctx, stackedCanvas);
                            await drawSticker(ctx, stackedCanvas);
                            await drawDragDropStickers(ctx, stackedCanvas);
                            drawDoodle(ctx, stackedCanvas);
                            resolve(stackedCanvas);
                        }
                    };

                    img.onerror = function () {
                        console.error(`Failed to load image: ${img.src}`);
                    };
                });
            } else {
                console.log("No stored images found.");
                resolve(stackedCanvas);
            }
        });
    }

    // <CHANGE> Refactored download function (now uses helper)
    async function downloadCanvasCopy() {
        const stackedCanvas = await buildPhotoStripCanvas();
        const imageData = stackedCanvas.toDataURL('image/png');

        if (isIOS()) {
            const byteCharacters = atob(imageData.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });

            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = 'photobooth.png';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // iOS Safari (WebKit) processes blob downloads asynchronously;
            // revoking the object URL synchronously here races WebKit's own
            // read of it and throws "WebKitBlobResource error 1" / "The
            // operation couldn't be completed". Give it a moment first.
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else {
            const link = document.createElement('a');
            link.href = imageData;
            link.download = 'photobooth.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    async function downloadGIF() {
        if (!storedImages || storedImages.length === 0) {
            console.error("No images found in IndexedDB.");
            return;
        }

        // Get the same canvas you use for PNG download (for width + height only)
        // const stackedCanvas = await buildPhotoStripCanvas();
        let canvasWidth;
        let canvasHeight;

        if (imageArrayLength > 3) {
            canvasWidth = 624;
            canvasHeight = 1800;
        } else {
            canvasWidth = 592;
            canvasHeight = 1352;
        }

        const borderWidth = 30;
        const spacing = 12;
        const bottomPadding = 100;

        const availableHeight = canvasHeight - (borderWidth * 2) - (spacing * 2) - bottomPadding;
        const photoHeight = availableHeight / imageArrayLength;
        const photoWidth = canvasWidth - (borderWidth * 2);

        const GIF_WIDTH = photoWidth;
        const GIF_HEIGHT = photoHeight;

        const gif = new GIF({
            workers: 2,
            quality: 10,
            workerScript: "assets/gif/gif.worker.js"
        });

        // Create GIF frames from your raw images
        for (let i = 0; i < storedImages.length; i++) {
            await new Promise((resolve) => {
                const img = new Image();
                img.src = storedImages[i];

                img.onload = function () {
                    const tempCanvas = document.createElement("canvas");
                    tempCanvas.width = GIF_WIDTH;
                    tempCanvas.height = GIF_HEIGHT;

                    const ctx = tempCanvas.getContext("2d");

                    // ---- Resize & Crop EXACTLY to match canvas aspect ratio ---- //
                    const imgRatio = img.width / img.height;
                    const targetRatio = GIF_WIDTH / GIF_HEIGHT;

                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (imgRatio > targetRatio) {
                        // Image is wider -> fit height, crop sides
                        drawHeight = GIF_HEIGHT;
                        drawWidth = img.width * (GIF_HEIGHT / img.height);
                        offsetX = (GIF_WIDTH - drawWidth) / 2;
                        offsetY = 0;
                    } else {
                        // Image is taller -> fit width, crop top/bottom
                        drawWidth = GIF_WIDTH;
                        drawHeight = img.height * (GIF_WIDTH / img.width);
                        offsetX = 0;
                        offsetY = (GIF_HEIGHT - drawHeight) / 2;
                    }

                    ctx.clearRect(0, 0, GIF_WIDTH, GIF_HEIGHT);
                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                    gif.addFrame(tempCanvas, { delay: 800 });
                    resolve();
                };

                img.onerror = function () {
                    console.error("Failed to load image:", img.src);
                    resolve();
                };
            });
        }

        gif.on("finished", function (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "photobooth-io-gif.gif";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // See the PNG download path above: don't revoke synchronously,
            // iOS Safari needs time to actually read the blob first.
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });

        gif.render();
    }

    // <CHANGE> Share function (now uses helper)
    async function shareCanvasCopy() {
        const stackedCanvas = await buildPhotoStripCanvas();
        
        stackedCanvas.toBlob(async (blob) => {
            const shareMessage = "Just had so much fun at Photobooth-io.cc! ♡ Check out my photobooth moment ・₊✧ #photoboothio";

            if (navigator.share) {
                try {
                    const file = new File([blob], 'photobooth.png', { type: 'image/png' });
                    await navigator.share({
                        files: [file],
                        text: shareMessage,
                        title: 'My Photobooth Moment'
                    });
                } catch (err) {
                    console.error('Share failed:', err);
                }
            } else {
                alert('Web Share API not supported on this device.\n\n' + shareMessage);
                
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'photobooth.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // Same iOS Safari race as the PNG/GIF downloads above.
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
        }, 'image/png');
    }

    // <CHANGE> Print function (now uses helper)
    // <CHANGE> Print function with proper sizing for printing
    async function printCanvasCopy() {
        const stackedCanvas = await buildPhotoStripCanvas();
        const imageData = stackedCanvas.toDataURL('image/png');

        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('* { margin: 0; padding: 0; box-sizing: border-box; }');
        printWindow.document.write('body { font-family: Arial, sans-serif; background: white; }');
        printWindow.document.write('.print-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 0.5in; }');
        printWindow.document.write('img { max-width: 2in; height: auto; display: block; border: 1px solid black; }');
        printWindow.document.write('@media print { body { margin: 0; padding: 0; } .print-container { padding: 0.5in; min-height: auto; } img { max-width: 2in; border: 1px solid black; } }');
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<div class="print-container"><img src="' + imageData + '" /></div>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
    

    //download final copy
    if (downloadCopyBtn) {
        downloadCopyBtn.addEventListener('click', downloadCanvasCopy);
    }

    if (downloadGIFBtn) {
        downloadGIFBtn.addEventListener('click', downloadGIF);
    }

    if (shareCopyBtn) {
        shareCopyBtn.addEventListener('click', shareCanvasCopy);
    }

    if (printCopyBtn) {
        printCopyBtn.addEventListener('click', printCanvasCopy);
    }

    window.onload = () => {
        redrawCanvas(storedImages);
    };

    // customize.html is shared by Layout A, Layout B, Layout C, Hearts
    // Filter, and Dog Filter (see each capture page's own
    // sessionStorage.setItem('returnLayout', ...) call before redirecting
    // here). All five get Change Layout and Reorder Photos, keyed off which
    // capture page sent the visitor here.
    const layoutSwitcherGrid = document.getElementById('layoutSwitcherGrid');
    const photoReorderGrid = document.getElementById('photoReorderGrid');
    const CURRENT_LAYOUT_KEY_BY_RETURN_LAYOUT = {
        'canvas.html': 'layoutA',
        'canvas4.html': 'layoutB',
        'canvas2.html': 'layoutC',
        'hearts-layout.html': 'heartsFilter',
        'dog-filter-layout.html': 'dogFilter',
    };
    // Normalize away a leading slash - the capture pages set this to a bare
    // filename ("canvas4.html"), but js/layout-catalog.js's capturePage
    // values are absolute ("/canvas4.html") so they work from any directory
    // depth, and the switcher writes that absolute form here when a user
    // switches layouts.
    const returnLayoutValue = (sessionStorage.getItem('returnLayout') || '').replace(/^\//, '');
    const currentLayoutKey = CURRENT_LAYOUT_KEY_BY_RETURN_LAYOUT[returnLayoutValue];
    if (currentLayoutKey) {
        initLayoutSwitcher(layoutSwitcherGrid, currentLayoutKey);
        initPhotoReorder(photoReorderGrid, () => loadIndexedImages());
    } else {
        if (layoutSwitcherGrid) {
            const section = layoutSwitcherGrid.closest('.custom-options-container');
            if (section) section.style.display = 'none';
        }
        if (photoReorderGrid) {
            const section = photoReorderGrid.closest('.custom-options-container');
            if (section) section.style.display = 'none';
        }
    }
})