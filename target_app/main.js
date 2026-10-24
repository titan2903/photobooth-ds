document.addEventListener('DOMContentLoaded', () => {
    const homeStart = document.querySelector('#home-start')
    const welcomeStart = document.querySelector('#welcome-start')

    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const hamburgerNav = document.getElementById("hamburger-nav");

    const mobileSpaceContainer = document.getElementById("mobile-space-container");
    const mainSection = document.getElementById("main-section");
    const burgerHomeTrigger = document.getElementById("hamburger-home-trigger");

    const contactSection = document.getElementById("contact-section");
    const mainCenter = document.querySelector('.main-center')
    const canvasCenter = document.querySelector('.canvas-centered')

    let sideNavToggle = false;
    // const resultHome = document.querySelector('#home-btn')

    if (homeStart) {
        homeStart.addEventListener('click', (e) => {
            e.preventDefault()
            window.location.href = 'chooseLayout.html'
            // window.location.href = 'welcome.html'
        })
    }

    if (mainCenter) {
        mainCenter.style.display = "flex";

    }

    if (canvasCenter) {
        canvasCenter.style.zIndex = "4"
        canvasCenter.style.display = "flex";
    }

    // if (welcomeStart) {
    //     welcomeStart.addEventListener('click', (e) => {
    //         e.preventDefault()
    //         window.location.href = 'canvas.html'
    //     })
    // }

    //sidebar nav
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            sideNavToggle = !sideNavToggle;

            if (sideNavToggle) {
                // alert("true");
                console.log("on");

                document.body.classList.add("mobile-nav-open");


                if (mainSection) {
                    mainSection.style.display = "none";
                }

                if (mainCenter) {
                    mainCenter.style.display = "none";
                }

                if (contactSection) {
                    contactSection.style.zIndex = "0";
                }



                // hamburgerNav.style.zIndex = "2";
                // mainSection.style.marginTop = "50px";

            }
            else {
                // alert("false");
                console.log("off");

                document.body.classList.remove("mobile-nav-open");


                if (mainSection) {
                    mainSection.style.display = "";

                }

                if (mainCenter) {
                    mainCenter.style.display = "flex";

                }

                if (contactSection) {
                    contactSection.style.zIndex = "2"
                }

            }

        })
    }


    if (burgerHomeTrigger) {
        burgerHomeTrigger.addEventListener('click', () => {
            sideNavToggle = !sideNavToggle;

            if (sideNavToggle) {
                console.log("on");
                document.body.classList.add("mobile-nav-open");

                if (mainSection) {
                    mainSection.style.display = "none";
                }

                if (mainCenter) {
                    mainCenter.style.display = "none";
                }

                if (contactSection) {
                    contactSection.style.zIndex = "0";
                }

            }
            else {
                console.log("off");

                document.body.classList.remove("mobile-nav-open");

                if (mainSection) {
                    mainSection.style.display = "";

                }

                if (mainCenter) {
                    mainCenter.style.display = "flex";

                }

                if (contactSection) {
                    contactSection.style.zIndex = "2"
                }
            }
        })
    }

    // if (resultHome) {
    //     resultHome.addEventListener('click', (e) => {
    //         e.preventDefault()
    //         window.location.href = 'index.html'
    //     })
    // }
})