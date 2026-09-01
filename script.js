document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const navbar =
        document.querySelector(".navbar");

    const background =
        document.querySelector(".hero-background");

    const hero =
        document.querySelector(".hero");

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-menu a"
        );

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    /* =====================================================
       VIDEO
    ===================================================== */

    if (background) {

        background.style.setProperty(
            "--mouse-x",
            "0px"
        );

        background.style.setProperty(
            "--mouse-y",
            "0px"
        );


        const playVideo = () => {

            const promise =
                background.play();

            if (
                promise &&
                typeof promise.catch ===
                "function"
            ) {

                promise.catch(() => {});

            }

        };


        playVideo();


        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    playVideo();

                }

            }
        );

    }


    /* =====================================================
       NAVBAR SCROLL STATE
    ===================================================== */

    function updateNavbar() {

        if (!navbar) {
            return;
        }

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );


    updateNavbar();


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function openMenu() {

        if (
            !mobileMenu ||
            !menuToggle
        ) {
            return;
        }

        mobileMenu.classList.add(
            "open"
        );

        menuToggle.classList.add(
            "open"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close navigation"
        );

    }


    function closeMenu() {

        if (
            !mobileMenu ||
            !menuToggle
        ) {
            return;
        }

        mobileMenu.classList.remove(
            "open"
        );

        menuToggle.classList.remove(
            "open"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation"
        );

    }


    if (
        menuToggle &&
        mobileMenu
    ) {

        menuToggle.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const isOpen =
                    mobileMenu.classList.contains(
                        "open"
                    );

                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }

            }
        );

    }


    /* =====================================================
       CLOSE MOBILE MENU ON LINK CLICK
    ===================================================== */

    mobileLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    closeMenu();

                }
            );

        }
    );


    /* =====================================================
       CLOSE MENU OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !mobileMenu ||
                !menuToggle
            ) {
                return;
            }

            const clickedMenu =
                mobileMenu.contains(
                    event.target
                );

            const clickedToggle =
                menuToggle.contains(
                    event.target
                );

            if (
                !clickedMenu &&
                !clickedToggle
            ) {

                closeMenu();

            }

        }
    );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeMenu();

            }

        }
    );


    /* =====================================================
       SMOOTH ANCHOR SCROLL
    ===================================================== */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    let target;

                    try {

                        target =
                            document.querySelector(
                                targetId
                            );

                    } catch {

                        return;

                    }


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const navHeight =
                        navbar
                            ? navbar.offsetHeight
                            : 0;


                    const targetTop =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        navHeight -
                        12;


                    window.scrollTo({

                        top:
                            Math.max(
                                targetTop,
                                0
                            ),

                        behavior:
                            "smooth"

                    });


                    closeMenu();

                }
            );

        }
    );


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const trackedSections =
        document.querySelectorAll(
            "main section[id]"
        );


    function updateActiveNav() {

        if (!navLinks.length) {
            return;
        }


        const scrollPosition =
            window.scrollY +
            window.innerHeight * 0.35;


        let currentId =
            "home";


        trackedSections.forEach(
            (section) => {

                const sectionTop =
                    section.offsetTop;

                const sectionBottom =
                    sectionTop +
                    section.offsetHeight;


                if (
                    scrollPosition >=
                    sectionTop &&
                    scrollPosition <
                    sectionBottom
                ) {

                    currentId =
                        section.id;

                }

            }
        );


        navLinks.forEach(
            (link) => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                link.classList.toggle(
                    "active",
                    href ===
                    `#${currentId}`
                );

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveNav,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        updateActiveNav
    );


    updateActiveNav();


    /* =====================================================
       INTERSECTION OBSERVER
    ===================================================== */

    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (
                    entries,
                    observer
                ) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -60px 0px"
                }
            );


        revealElements.forEach(
            (element) => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =====================================================
       DESKTOP MOUSE PARALLAX
       
       ONLY X/Y MOUSE MOVEMENT.
       
       NO SCROLL PARALLAX.
    ===================================================== */

    const finePointer =
        window.matchMedia(
            "(pointer: fine)"
        ).matches;


    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationRunning =
        false;


    function animateBackground() {

        if (!background) {

            animationRunning =
                false;

            return;
        }


        currentX +=
            (targetX - currentX) *
            0.08;


        currentY +=
            (targetY - currentY) *
            0.08;


        background.style.setProperty(
            "--mouse-x",
            `${currentX}px`
        );


        background.style.setProperty(
            "--mouse-y",
            `${currentY}px`
        );


        const xDistance =
            Math.abs(
                targetX - currentX
            );


        const yDistance =
            Math.abs(
                targetY - currentY
            );


        if (
            xDistance > 0.05 ||
            yDistance > 0.05
        ) {

            requestAnimationFrame(
                animateBackground
            );

        } else {

            animationRunning =
                false;

        }

    }


    if (
        hero &&
        background &&
        finePointer
    ) {

        hero.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    hero.getBoundingClientRect();


                const x =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width -
                    0.5;


                const y =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height -
                    0.5;


                targetX =
                    x * 7;


                targetY =
                    y * 5;


                if (!animationRunning) {

                    animationRunning =
                        true;

                    requestAnimationFrame(
                        animateBackground
                    );

                }

            }
        );


        hero.addEventListener(
            "mouseleave",
            () => {

                targetX = 0;
                targetY = 0;


                if (!animationRunning) {

                    animationRunning =
                        true;

                    requestAnimationFrame(
                        animateBackground
                    );

                }

            }
        );

    }


    /* =====================================================
       BUTTON PRESS EFFECT
    ===================================================== */

    const buttons =
        document.querySelectorAll(
            ".button, .nav-cta"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "pointerdown",
                () => {

                    button.style.transform =
                        "scale(.96)";

                }
            );


            const release =
                () => {

                    button.style.transform =
                        "";

                };


            button.addEventListener(
                "pointerup",
                release
            );


            button.addEventListener(
                "pointercancel",
                release
            );


            button.addEventListener(
                "pointerleave",
                release
            );

        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                800
            ) {

                closeMenu();

            }

            updateNavbar();
            updateActiveNav();

        }
    );


    /* =====================================================
       PAGE READY
    ===================================================== */

    requestAnimationFrame(
        () => {

            document.body.classList.add(
                "page-loaded"
            );

            document
                .querySelectorAll(
                    ".hero .reveal"
                )
                .forEach(
                    (element, index) => {

                        setTimeout(
                            () => {

                                element.classList.add(
                                    "visible"
                                );

                            },
                            120 + index * 100
                        );

                    }
                );

        }
    );

});
