document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.querySelector(".site-header");

    if (!navbar) return;

    const FADE_ZONE = 100;

    /*
     * These are COMPLETE visual objects.
     * Their borders, backgrounds, images and text
     * will all fade together.
     */
    const visualSelector = `
        .about-card,
        .project-card,
        .service-card,
        .skill-circle,
        .project-image,
        .hero-button,
        .contact-button,
        .contact-email,
        .hero-content,
        .section-header,
        .about-main,
        .footer,
        .footer-nav,
        .footer-socials
    `;

    const visualElements = [
        ...document.querySelectorAll(visualSelector)
    ].filter(element => !navbar.contains(element));


    /*
     * Individual text/images that aren't inside
     * one of the larger visual objects.
     */
    const textSelector = `
        h1,
        h2,
        h3,
        p,
        span,
        a,
        img
    `;

    const textElements = [
        ...document.querySelectorAll(textSelector)
    ].filter(element => {

        if (navbar.contains(element)) return false;

        /*
         * Don't fade children separately if their
         * parent is already being faded.
         */
        return !visualElements.some(parent =>
            parent !== element &&
            parent.contains(element)
        );
    });


    /*
     * Combine both groups.
     */
    const fadeTargets = [
        ...visualElements,
        ...textElements
    ];


    /*
     * Prepare masks.
     */
    fadeTargets.forEach(element => {
        element.classList.add("navbar-fade-target");
    });


    let ticking = false;


    function createMask(rect, navBottom) {

        const fadeEnd = navBottom + FADE_ZONE;


        /*
         * Element completely below fade area.
         */
        if (rect.top >= fadeEnd) {

            return {
                mask: "none",
                webkitMask: "none"
            };
        }


        /*
         * Element completely above navbar.
         */
        if (rect.bottom <= navBottom) {

            return {
                mask: "linear-gradient(to bottom, transparent, transparent)",
                webkitMask:
                    "linear-gradient(to bottom, transparent, transparent)"
            };
        }


        /*
         * Calculate navbar position
         * inside this element.
         */
        const start =
            ((navBottom - rect.top) / rect.height) * 100;

        const end =
            ((fadeEnd - rect.top) / rect.height) * 100;


        const startPoint =
            Math.max(0, Math.min(100, start));

        const endPoint =
            Math.max(0, Math.min(100, end));


        const distance =
            endPoint - startPoint;


        const p1 =
            Math.min(
                100,
                startPoint + distance * 0.15
            );

        const p2 =
            Math.min(
                100,
                startPoint + distance * 0.40
            );

        const p3 =
            Math.min(
                100,
                startPoint + distance * 0.70
            );


        /*
         * Smooth fade.
         *
         * navbar      = invisible
         * middle      = partially visible
         * fade end    = completely visible
         */
        const mask = `
            linear-gradient(
                to bottom,
                transparent 0%,
                transparent ${startPoint}%,
                rgba(255,255,255,.08) ${p1}%,
                rgba(255,255,255,.30) ${p2}%,
                rgba(255,255,255,.65) ${p3}%,
                white ${endPoint}%,
                white 100%
            )
        `;


        return {
            mask,
            webkitMask: mask
        };
    }


    function updateFade() {

        ticking = false;


        const navBottom =
            navbar.getBoundingClientRect().bottom;


        /*
         * ==========================================
         * FADE EVERYTHING
         * ==========================================
         */
        for (const element of fadeTargets) {

            const rect =
                element.getBoundingClientRect();


            const result =
                createMask(rect, navBottom);


            element.style.maskImage =
                result.mask;

            element.style.webkitMaskImage =
                result.webkitMask;
        }


        /*
         * ==========================================
         * FADE SECTION BORDERS
         * ==========================================
         */

        const sections =
            document.querySelectorAll("section");


        sections.forEach(section => {

            const rect =
                section.getBoundingClientRect();


            /*
             * The divider is at the actual
             * bottom of the section.
             */
            const borderY =
                rect.bottom;


            /*
             * Completely below navbar fade area.
             */
            if (borderY >= navBottom + FADE_ZONE) {

                section.style.setProperty(
                    "--section-border-opacity",
                    "1"
                );

                return;
            }


            /*
             * Completely behind navbar.
             */
            if (borderY <= navBottom) {

                section.style.setProperty(
                    "--section-border-opacity",
                    "0"
                );

                return;
            }


            /*
             * Border is inside fade zone.
             */
            let progress =
                (borderY - navBottom) / FADE_ZONE;


            progress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        progress
                    )
                );


            /*
             * Smoothstep easing.
             */
            const eased =
                progress * progress * (3 - 2 * progress);


            section.style.setProperty(
                "--section-border-opacity",
                eased.toFixed(3)
            );

        });

    }


    function requestFadeUpdate() {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(updateFade);
    }


    /*
     * Scroll
     */
    window.addEventListener(
        "scroll",
        requestFadeUpdate,
        { passive: true }
    );


    /*
     * Resize
     */
    window.addEventListener(
        "resize",
        requestFadeUpdate,
        { passive: true }
    );


    /*
     * Initial update
     */
    requestFadeUpdate();

});