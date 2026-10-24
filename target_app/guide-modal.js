// Website Guide Modal Handler
// Manages the floating "guide" button, the multi-slide walkthrough modal,
// its carousel navigation (Prev/Next/dots), and all the ways to close it
// (close button, overlay click, Skip, Escape key).

;(() => {
  const fabBtn = document.getElementById("guideFabBtn")
  const modal = document.getElementById("guideModal")
  const overlay = document.getElementById("guideModalOverlay")
  const closeBtn = document.getElementById("guideModalClose")
  const slidesContainer = document.getElementById("guideSlides")
  const dotsContainer = document.getElementById("guideDots")
  const prevBtn = document.getElementById("guidePrevBtn")
  const nextBtn = document.getElementById("guideNextBtn")
  const skipBtn = document.getElementById("guideSkipBtn")

  if (!modal || !slidesContainer) return

  const slides = Array.from(slidesContainer.querySelectorAll(".guide-slide"))
  if (slides.length === 0) return

  let current = 0

  // Build dot indicators to match the number of slides
  const dots = slides.map((_, i) => {
    const dot = document.createElement("button")
    dot.type = "button"
    dot.className = "guide-dot"
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`)
    dot.addEventListener("click", () => goToSlide(i))
    if (dotsContainer) dotsContainer.appendChild(dot)
    return dot
  })

  function render() {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current))
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current))

    if (prevBtn) prevBtn.disabled = current === 0

    const isLast = current === slides.length - 1
    if (nextBtn) nextBtn.textContent = isLast ? "Finish" : "Next"
    if (skipBtn) skipBtn.style.visibility = isLast ? "hidden" : "visible"
  }

  function goToSlide(index) {
    current = Math.max(0, Math.min(slides.length - 1, index))
    render()
  }

  function openModal() {
    current = 0
    render()
    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }

  function closeModal() {
    modal.classList.add("hidden")
    document.body.style.overflow = ""
  }

  if (fabBtn) fabBtn.addEventListener("click", openModal)
  if (closeBtn) closeBtn.addEventListener("click", closeModal)
  if (overlay) overlay.addEventListener("click", closeModal)
  if (skipBtn) skipBtn.addEventListener("click", closeModal)
  if (prevBtn) prevBtn.addEventListener("click", () => goToSlide(current - 1))
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (current === slides.length - 1) {
        closeModal()
      } else {
        goToSlide(current + 1)
      }
    })
  }

  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return
    if (e.key === "Escape") closeModal()
    if (e.key === "ArrowRight") goToSlide(current + 1)
    if (e.key === "ArrowLeft") goToSlide(current - 1)
  })

  render()
})()
