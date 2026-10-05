document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       HEADER LOAD
    ===================================================== */

    fetch("components/header.html")
        .then(function (response) {

            if (!response.ok) {
                throw new Error("Header not found");
            }

            return response.text();

        })
        .then(function (data) {

            const header =
                document.getElementById("header");

            if (header) {
                header.innerHTML = data;
            }


            /* MOBILE MENU */

            const menuToggle =
                document.getElementById("menuToggle");

            const navigation =
                document.querySelector(".main-navigation");


            if (menuToggle && navigation) {

                menuToggle.addEventListener(
                    "click",
                    function () {

                        navigation.classList.toggle(
                            "active"
                        );

                    }
                );

            }

        })
        .catch(function (error) {

            console.error(
                "Header Error:",
                error
            );

        });





    /* =====================================================
       HERO SLIDER
    ===================================================== */

    const heroSlider =
        document.getElementById("heroSlider");

    const slides =
        document.querySelectorAll(".hero-slide");

    const dots =
        document.querySelectorAll(".hero-dot");

    const prevButton =
        document.getElementById("heroPrev");

    const nextButton =
        document.getElementById("heroNext");


    if (!heroSlider || !slides.length) {
        return;
    }


    let currentSlide = 0;

    let autoSlideTimer = null;

    let slideLocked = false;

    let wheelLocked = false;



    /* =====================================================
       MOUSE DRAG VARIABLES
    ===================================================== */

    let mouseDown = false;

    let mouseStartX = 0;

    let mouseCurrentX = 0;

    let mouseMoved = false;



    /* =====================================================
       TOUCH VARIABLES
    ===================================================== */

    let touchStartX = 0;

    let touchEndX = 0;

    let touchStartY = 0;

    let touchEndY = 0;



    /* =====================================================
       SETTINGS
    ===================================================== */

    const AUTO_SLIDE_TIME = 5000;

    const ANIMATION_TIME = 550;

    /*
     * Wheel lock sirf slide ko double change
     * hone se rokega.
     *
     * Is duration ke andar hum page ko
     * block nahi karenge.
     */

    const WHEEL_LOCK_TIME = 450;

    const DRAG_THRESHOLD = 80;



    /* =====================================================
       SHOW SLIDE
    ===================================================== */

    function showSlide(index) {

        if (!slides.length) {
            return;
        }


        /*
         * LOOP
         */

        if (index >= slides.length) {
            index = 0;
        }


        if (index < 0) {
            index = slides.length - 1;
        }


        /*
         * REMOVE ACTIVE
         */

        slides.forEach(function (slide) {

            slide.classList.remove("active");

        });


        dots.forEach(function (dot) {

            dot.classList.remove("active");

        });


        /*
         * ADD ACTIVE
         */

        slides[index].classList.add("active");


        if (dots[index]) {

            dots[index].classList.add("active");

        }


        currentSlide = index;

    }



    /* =====================================================
       CHANGE SLIDE
    ===================================================== */

    function changeSlide(direction) {

        if (slideLocked) {
            return;
        }


        slideLocked = true;


        if (direction === "next") {

            /*
             * Normal next
             */

            if (currentSlide < slides.length - 1) {

                showSlide(currentSlide + 1);

            } else {

                /*
                 * Last slide par arrow se
                 * first slide par loop
                 */

                showSlide(0);

            }

        }

        else {

            /*
             * Normal previous
             */

            if (currentSlide > 0) {

                showSlide(currentSlide - 1);

            } else {

                /*
                 * First slide par arrow se
                 * last slide par loop
                 */

                showSlide(slides.length - 1);

            }

        }


        setTimeout(function () {

            slideLocked = false;

        }, ANIMATION_TIME);

    }



    /* =====================================================
       NEXT
    ===================================================== */

    function nextSlide() {

        changeSlide("next");

    }



    /* =====================================================
       PREVIOUS
    ===================================================== */

    function previousSlide() {

        changeSlide("previous");

    }



    /* =====================================================
       AUTO SLIDER
    ===================================================== */

    function startAutoSlide() {

        clearInterval(autoSlideTimer);


        autoSlideTimer = setInterval(
            function () {

                if (!slideLocked) {

                    nextSlide();

                }

            },
            AUTO_SLIDE_TIME
        );

    }



    /* =====================================================
       RESTART AUTO SLIDER
    ===================================================== */

    function restartAutoSlide() {

        clearInterval(autoSlideTimer);

        startAutoSlide();

    }



    /* =====================================================
       NEXT ARROW
    ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                nextSlide();

                restartAutoSlide();

            }
        );

    }



    /* =====================================================
       PREVIOUS ARROW
    ===================================================== */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                previousSlide();

                restartAutoSlide();

            }
        );

    }



    /* =====================================================
       DOT NAVIGATION
    ===================================================== */

    dots.forEach(function (dot, index) {

        dot.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (slideLocked) {
                    return;
                }


                showSlide(index);

                restartAutoSlide();

            }
        );

    });



    /* =====================================================
       MOUSE WHEEL - FIXED
       
       IMPORTANT:
       
       Slide 1 + UP
       = normal page UP

       Slide 2/3 + UP
       = previous hero slide

       Slide 1/2/3 + DOWN
       = next hero slide

       Last slide + DOWN
       = normal page DOWN
    ===================================================== */

    heroSlider.addEventListener(
        "wheel",
        function (event) {


            /*
             * Horizontal wheel ko ignore karo
             */

            if (
                Math.abs(event.deltaX) >
                Math.abs(event.deltaY)
            ) {

                return;

            }


            /*
             * Small movement ignore
             */

            if (
                Math.abs(event.deltaY) < 10
            ) {

                return;

            }


            /* =============================================
               DOWN
            ============================================= */

            if (event.deltaY > 0) {


                /*
                 * LAST SLIDE
                 *
                 * IMPORTANT:
                 *
                 * Yahan preventDefault NAHI hai.
                 *
                 * Browser normal page ko
                 * niche scroll karega.
                 */

                if (
                    currentSlide ===
                    slides.length - 1
                ) {

                    return;

                }


                /*
                 * Agar wheel already locked hai
                 * to kuch mat karo.
                 *
                 * Lekin preventDefault bhi mat karo.
                 *
                 * Isse page stuck nahi hoga.
                 */

                if (wheelLocked) {

                    return;

                }


                /*
                 * Hero next slide
                 */

                event.preventDefault();

                wheelLocked = true;

                nextSlide();

                restartAutoSlide();


                setTimeout(
                    function () {

                        wheelLocked = false;

                    },
                    WHEEL_LOCK_TIME
                );

            }



            /* =============================================
               UP
            ============================================= */

            else {


                /*
                 * FIRST SLIDE
                 *
                 * IMPORTANT:
                 *
                 * Yahan preventDefault NAHI hai.
                 *
                 * Browser normal page ko
                 * upar scroll karega.
                 */

                if (currentSlide === 0) {

                    return;

                }


                /*
                 * Wheel lock
                 */

                if (wheelLocked) {

                    return;

                }


                /*
                 * Hero previous slide
                 */

                event.preventDefault();

                wheelLocked = true;

                previousSlide();

                restartAutoSlide();


                setTimeout(
                    function () {

                        wheelLocked = false;

                    },
                    WHEEL_LOCK_TIME
                );

            }

        },
        {
            passive: false
        }
    );



    /* =====================================================
       MOUSE DRAG / SWIPE
    ===================================================== */

    heroSlider.addEventListener(
        "mousedown",
        function (event) {


            /*
             * Only LEFT mouse button
             */

            if (event.button !== 0) {
                return;
            }


            mouseDown = true;

            mouseMoved = false;

            mouseStartX =
                event.clientX;

            mouseCurrentX =
                event.clientX;


            heroSlider.classList.add(
                "is-dragging"
            );

        }
    );



    /* =====================================================
       MOUSE MOVE
    ===================================================== */

    heroSlider.addEventListener(
        "mousemove",
        function (event) {

            if (!mouseDown) {
                return;
            }


            mouseCurrentX =
                event.clientX;


            const distance =
                mouseCurrentX -
                mouseStartX;


            if (
                Math.abs(distance) > 10
            ) {

                mouseMoved = true;

            }

        }
    );



    /* =====================================================
       MOUSE UP
    ===================================================== */

    heroSlider.addEventListener(
        "mouseup",
        function () {

            if (!mouseDown) {
                return;
            }


            mouseDown = false;


            heroSlider.classList.remove(
                "is-dragging"
            );


            const distance =
                mouseCurrentX -
                mouseStartX;


            /*
             * RIGHT DRAG
             * = PREVIOUS
             */

            if (
                distance >
                DRAG_THRESHOLD
            ) {

                previousSlide();

                restartAutoSlide();

            }


            /*
             * LEFT DRAG
             * = NEXT
             */

            else if (
                distance <
                -DRAG_THRESHOLD
            ) {

                nextSlide();

                restartAutoSlide();

            }


            mouseStartX = 0;

            mouseCurrentX = 0;

            mouseMoved = false;

        }
    );



    /* =====================================================
       MOUSE LEAVE
    ===================================================== */

    heroSlider.addEventListener(
        "mouseleave",
        function () {

            /*
             * Drag cancel
             */

            if (mouseDown) {

                mouseDown = false;

                heroSlider.classList.remove(
                    "is-dragging"
                );

            }

        }
    );



    /* =====================================================
       SAFETY MOUSE UP
    ===================================================== */

    document.addEventListener(
        "mouseup",
        function () {

            if (!mouseDown) {
                return;
            }


            mouseDown = false;

            heroSlider.classList.remove(
                "is-dragging"
            );


            const distance =
                mouseCurrentX -
                mouseStartX;


            if (
                distance >
                DRAG_THRESHOLD
            ) {

                previousSlide();

                restartAutoSlide();

            }

            else if (
                distance <
                -DRAG_THRESHOLD
            ) {

                nextSlide();

                restartAutoSlide();

            }


            mouseStartX = 0;

            mouseCurrentX = 0;

            mouseMoved = false;

        }
    );



    /* =====================================================
       TOUCH START
    ===================================================== */

    heroSlider.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.touches[0].clientX;

            touchStartY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );



    /* =====================================================
       TOUCH END
    ===================================================== */

    heroSlider.addEventListener(
        "touchend",
        function (event) {

            touchEndX =
                event.changedTouches[0].clientX;

            touchEndY =
                event.changedTouches[0].clientY;


            const distanceX =
                touchEndX -
                touchStartX;


            const distanceY =
                touchEndY -
                touchStartY;


            /*
             * Horizontal swipe only
             */

            if (
                Math.abs(distanceX) >
                Math.abs(distanceY)
            ) {


                /*
                 * LEFT
                 * = NEXT
                 */

                if (
                    distanceX <
                    -DRAG_THRESHOLD
                ) {

                    nextSlide();

                    restartAutoSlide();

                }


                /*
                 * RIGHT
                 * = PREVIOUS
                 */

                else if (
                    distanceX >
                    DRAG_THRESHOLD
                ) {

                    previousSlide();

                    restartAutoSlide();

                }

            }

        },
        {
            passive: true
        }
    );



    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {


            const activeElement =
                document.activeElement;


            /*
             * Input me type karte waqt
             * slider change nahi hoga.
             */

            if (
                activeElement &&
                (
                    activeElement.tagName ===
                    "INPUT" ||

                    activeElement.tagName ===
                    "TEXTAREA" ||

                    activeElement.tagName ===
                    "SELECT"
                )
            ) {

                return;

            }



            /* RIGHT */

            if (
                event.key ===
                "ArrowRight"
            ) {

                event.preventDefault();

                nextSlide();

                restartAutoSlide();

            }



            /* LEFT */

            if (
                event.key ===
                "ArrowLeft"
            ) {

                event.preventDefault();

                previousSlide();

                restartAutoSlide();

            }



            /* DOWN */

            if (
                event.key ===
                "ArrowDown"
            ) {

                event.preventDefault();

                nextSlide();

                restartAutoSlide();

            }



            /* UP */

            if (
                event.key ===
                "ArrowUp"
            ) {

                event.preventDefault();

                previousSlide();

                restartAutoSlide();

            }

        }
    );



    /* =====================================================
       INITIALIZE
    ===================================================== */

    showSlide(0);

    startAutoSlide();



    /* =====================================================
       PAUSE AUTO SLIDE ON HERO
    ===================================================== */

    heroSlider.addEventListener(
        "mouseenter",
        function () {

            clearInterval(
                autoSlideTimer
            );

        }
    );


    heroSlider.addEventListener(
        "mouseleave",
        function () {

            if (!mouseDown) {

                startAutoSlide();

            }

        }
    );

});




/* =====================================================
   BACK TO TOP
===================================================== */

const servicesTopButton = document.getElementById("servicesTopButton");

if (servicesTopButton) {

    servicesTopButton.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       HEADER
    ===================================================== */

    fetch("components/header.html")
        .then(response => response.text())
        .then(data => {

            const header = document.getElementById("header");

            if (header) {
                header.innerHTML = data;
            }

            const menuToggle =
                document.getElementById("menuToggle");

            const navigation =
                document.querySelector(".main-navigation");

            if (menuToggle && navigation) {

                menuToggle.addEventListener("click", function () {
                    navigation.classList.toggle("active");
                });

            }

        })
        .catch(error => {
            console.error("Header Error:", error);
        });



 


    /* =====================================================
       HERO SLIDER
    ===================================================== */

    const hero =
        document.querySelector(".hero-slider");

    const slides =
        document.querySelectorAll(".hero-slide");

    const heroDots =
        document.querySelectorAll(".hero-dot");

    const heroNext =
        document.getElementById("heroNext");

    const heroPrev =
        document.getElementById("heroPrev");


    let heroIndex = 0;
    let heroTimer;


    function showHero(index) {

        if (!slides.length) return;

        if (index >= slides.length) {
            index = 0;
        }

        if (index < 0) {
            index = slides.length - 1;
        }


        slides.forEach(slide => {
            slide.classList.remove("active");
        });


        heroDots.forEach(dot => {
            dot.classList.remove("active");
        });


        slides[index].classList.add("active");


        if (heroDots[index]) {
            heroDots[index].classList.add("active");
        }


        heroIndex = index;

    }


    function nextHero() {

        showHero(heroIndex + 1);

        restartHero();

    }


    function previousHero() {

        showHero(heroIndex - 1);

        restartHero();

    }


    function startHero() {

        clearInterval(heroTimer);

        heroTimer = setInterval(function () {

            showHero(heroIndex + 1);

        }, 5000);

    }


    function restartHero() {

        clearInterval(heroTimer);

        startHero();

    }


    if (heroNext) {

        heroNext.addEventListener("click", nextHero);

    }


    if (heroPrev) {

        heroPrev.addEventListener("click", previousHero);

    }


    heroDots.forEach((dot, index) => {

        dot.addEventListener("click", function () {

            showHero(index);

            restartHero();

        });

    });


    if (slides.length) {

        showHero(0);

        startHero();

    }



    /* =====================================================
       HERO TOUCH
    ===================================================== */

    let heroTouchStart = 0;


    if (hero) {

        hero.addEventListener(
            "touchstart",
            function (event) {

                heroTouchStart =
                    event.touches[0].clientX;

            },
            {
                passive: true
            }
        );


        hero.addEventListener(
            "touchend",
            function (event) {

                const end =
                    event.changedTouches[0].clientX;

                const distance =
                    heroTouchStart - end;


                if (Math.abs(distance) > 50) {

                    if (distance > 0) {
                        nextHero();
                    } else {
                        previousHero();
                    }

                }

            },
            {
                passive: true
            }
        );

    }



    /* =====================================================
       VIDEO CAROUSEL
       TRUE INFINITE LOOP
    ===================================================== */

    const videoTrack =
        document.getElementById("videoTrack");

    const videoCarousel =
        document.getElementById("videoCarousel");

    const videoNext =
        document.getElementById("videoNext");

    const videoPrev =
        document.getElementById("videoPrev");

    const videoDotsBox =
        document.getElementById("videoDots");


    if (!videoTrack || !videoCarousel) {
        return;
    }


    /* =====================================================
       ORIGINAL CARDS
    ===================================================== */

    const originalCards =
        Array.from(
            videoTrack.querySelectorAll(
                ".video-card"
            )
        );


    const total =
        originalCards.length;


    if (!total) {
        return;
    }



    /* =====================================================
       VIDEO LOOP
    ===================================================== */

    originalCards.forEach(card => {

        const video =
            card.querySelector("video");

        if (video) {

            video.loop = true;

            video.muted = true;

            video.playsInline = true;

        }

    });



    /* =====================================================
       GET VISIBLE CARDS
    ===================================================== */

    function getVisible() {

        if (window.innerWidth <= 700) {
            return 1;
        }

        if (window.innerWidth <= 1100) {
            return 2;
        }

        return 3;

    }



    /* =====================================================
       CREATE INFINITE CLONES
    ===================================================== */

    const cloneCount = 3;


    /*
       Clone LAST 3 cards
    */

    originalCards
        .slice(-cloneCount)
        .forEach(card => {

            const clone =
                card.cloneNode(true);

            clone.classList.add(
                "video-clone"
            );

            videoTrack.insertBefore(
                clone,
                videoTrack.firstChild
            );

        });


    /*
       Clone FIRST 3 cards
    */

    originalCards
        .slice(0, cloneCount)
        .forEach(card => {

            const clone =
                card.cloneNode(true);

            clone.classList.add(
                "video-clone"
            );

            videoTrack.appendChild(clone);

        });



    /* =====================================================
       INDEX
    ===================================================== */

    let index = cloneCount;

    let isMoving = false;



    /* =====================================================
       MOVE
    ===================================================== */

    function moveCarousel(animate = true) {

        const card =
            videoTrack.querySelector(
                ".video-card"
            );


        if (!card) return;


        const gap = 24;


        const cardWidth =
            card.getBoundingClientRect().width;


        const position =
            index *
            (cardWidth + gap);


        if (animate) {

            videoTrack.style.transition =
                "transform 0.75s cubic-bezier(.22,.61,.36,1)";

        } else {

            videoTrack.style.transition =
                "none";

        }


        videoTrack.style.transform =
            `translate3d(-${position}px, 0, 0)`;


        updateDots();

    }



    /* =====================================================
       NEXT
    ===================================================== */

    function nextVideo() {

        if (isMoving) return;

        isMoving = true;

        index++;

        moveCarousel(true);

    }



    /* =====================================================
       PREVIOUS
    ===================================================== */

    function previousVideo() {

        if (isMoving) return;

        isMoving = true;

        index--;

        moveCarousel(true);

    }



    /* =====================================================
       SEAMLESS LOOP
    ===================================================== */

    videoTrack.addEventListener(
        "transitionend",
        function () {

            /*
               RIGHT SIDE
            */

            if (index >= total + cloneCount) {

                index = cloneCount;

                moveCarousel(false);

            }


            /*
               LEFT SIDE
            */

            else if (index < cloneCount) {

                index =
                    total + cloneCount - 1;

                moveCarousel(false);

            }


            isMoving = false;

        }
    );



    /* =====================================================
       ARROWS
    ===================================================== */

    if (videoNext) {

        videoNext.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                nextVideo();

                restartAuto();

            }
        );

    }


    if (videoPrev) {

        videoPrev.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                previousVideo();

                restartAuto();

            }
        );

    }



    /* =====================================================
       DOTS
    ===================================================== */

    function createDots() {

        if (!videoDotsBox) return;


        videoDotsBox.innerHTML = "";


        const visible =
            getVisible();


        const positions =
            total - visible + 1;


        for (
            let i = 0;
            i < positions;
            i++
        ) {

            const dot =
                document.createElement("span");


            dot.className =
                "video-dot";


            dot.addEventListener(
                "click",
                function () {

                    if (isMoving) return;


                    index =
                        cloneCount + i;


                    moveCarousel(true);

                    restartAuto();

                }
            );


            videoDotsBox.appendChild(dot);

        }


        updateDots();

    }



    function updateDots() {

        if (!videoDotsBox) return;


        const dots =
            videoDotsBox.querySelectorAll(
                ".video-dot"
            );


        if (!dots.length) return;


        let realIndex =
            index - cloneCount;


        const visible =
            getVisible();


        const max =
            total - visible;


        /*
           Keep dot within range
        */

        if (realIndex < 0) {
            realIndex = max;
        }


        if (realIndex > max) {
            realIndex = 0;
        }


        dots.forEach(dot => {
            dot.classList.remove("active");
        });


        if (dots[realIndex]) {

            dots[realIndex]
                .classList.add("active");

        }

    }



    /* =====================================================
       AUTO PLAY
    ===================================================== */

    let autoTimer;


    function startAuto() {

        clearInterval(autoTimer);


        autoTimer =
            setInterval(
                function () {

                    nextVideo();

                },
                3500
            );

    }


    function restartAuto() {

        clearInterval(autoTimer);

        startAuto();

    }



    /* =====================================================
       PAUSE ON HOVER
    ===================================================== */

    videoCarousel.addEventListener(
        "mouseenter",
        function () {

            clearInterval(autoTimer);

        }
    );


    videoCarousel.addEventListener(
        "mouseleave",
        function () {

            startAuto();

        }
    );



    /* =====================================================
       MOUSE DRAG
    ===================================================== */

    let dragStart = 0;

    let dragging = false;


    videoCarousel.addEventListener(
        "mousedown",
        function (event) {

            dragging = true;

            dragStart =
                event.clientX;

            videoCarousel.classList.add(
                "is-dragging"
            );

        }
    );


    videoCarousel.addEventListener(
        "mouseup",
        function (event) {

            if (!dragging) return;


            dragging = false;


            videoCarousel.classList.remove(
                "is-dragging"
            );


            const distance =
                dragStart - event.clientX;


            if (Math.abs(distance) > 50) {

                if (distance > 0) {

                    nextVideo();

                } else {

                    previousVideo();

                }

                restartAuto();

            }

        }
    );


    videoCarousel.addEventListener(
        "mouseleave",
        function () {

            dragging = false;

            videoCarousel.classList.remove(
                "is-dragging"
            );

        }
    );



    /* =====================================================
       TOUCH SWIPE
    ===================================================== */

    let touchStart = 0;


    videoCarousel.addEventListener(
        "touchstart",
        function (event) {

            touchStart =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    videoCarousel.addEventListener(
        "touchend",
        function (event) {

            const touchEnd =
                event.changedTouches[0].clientX;


            const distance =
                touchStart - touchEnd;


            if (Math.abs(distance) > 50) {

                if (distance > 0) {

                    nextVideo();

                } else {

                    previousVideo();

                }

                restartAuto();

            }

        },
        {
            passive: true
        }
    );



    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            moveCarousel(false);

            createDots();

        }
    );



    /* =====================================================
       START
    ===================================================== */

    createDots();

    moveCarousel(false);

    startAuto();

});


/* =====================================================
   PHONE NUMBER TYPE + DELETE LOOP
===================================================== */

const typingNumber =
    document.getElementById("typingNumber");


if (typingNumber) {

    const phoneNumber =
        "+91 98187 99007";

    let typingIndex = 0;

    let deleting = false;


    function typeNumber() {

        if (!deleting) {

            /* TYPE */

            typingNumber.textContent =
                phoneNumber.substring(
                    0,
                    typingIndex + 1
                );

            typingIndex++;


            /* NUMBER COMPLETE */

            if (
                typingIndex >=
                phoneNumber.length
            ) {

                deleting = true;

                setTimeout(
                    typeNumber,
                    9818
                );

                return;

            }


            setTimeout(
                typeNumber,
                120
            );

        } else {

            /* DELETE */

            typingNumber.textContent =
                phoneNumber.substring(
                    0,
                    typingIndex - 1
                );

            typingIndex--;


            /* DELETE COMPLETE */

            if (typingIndex <= 0) {

                deleting = false;

                setTimeout(
                    typeNumber,
                    500
                );

                return;

            }


            setTimeout(
                typeNumber,
                70
            );

        }

    }


    typeNumber();

}


/* WHY US SCROLL ANIMATION */

const whyCards = document.querySelectorAll(".why-card");

const whyObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){

            const index =
                [...whyCards].indexOf(entry.target);

            setTimeout(() => {
                entry.target.classList.add("show");
            }, index * 130);

            whyObserver.unobserve(entry.target);
        }

    });

}, {
    threshold: 0.15
});

whyCards.forEach(card => {
    whyObserver.observe(card);
});

const processCards = document.querySelectorAll(".process-card");

const processObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

            processObserver.unobserve(entry.target);
        }

    });

}, {
    threshold:0.15
});

processCards.forEach(card => {
    processObserver.observe(card);
});



/* =========================================================
   INFINITE TESTIMONIAL CAROUSEL
   MOUSE DRAG + TOUCH SWIPE + AUTO PLAY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    const track =
        document.getElementById("testimonialTrack");


    const viewport =
        document.getElementById("testimonialViewport");


    const prevButton =
        document.getElementById("testimonialPrev");


    const nextButton =
        document.getElementById("testimonialNext");


    const dotsContainer =
        document.getElementById("testimonialDots");


    if (
        !track ||
        !viewport ||
        !prevButton ||
        !nextButton ||
        !dotsContainer
    ) {

        return;

    }



    /* =====================================================
       VARIABLES
    ===================================================== */

    let originalCards =
        Array.from(
            track.querySelectorAll(
                ".client-testimonial-card"
            )
        );


    let visibleCards = 3;

    let currentIndex = 0;

    let isMoving = false;


    /* =====================================================
       AUTOPLAY
    ===================================================== */

    let autoPlayTimer;



    /* =====================================================
       MOUSE DRAG
    ===================================================== */

    let isDragging = false;

    let dragStartX = 0;

    let dragCurrentX = 0;

    let dragStartPosition = 0;

    let dragMoved = false;



    /* =====================================================
       GET VISIBLE CARDS
    ===================================================== */

    function getVisibleCards() {

        if (window.innerWidth <= 650) {

            return 1;

        }


        if (window.innerWidth <= 1100) {

            return 2;

        }


        return 3;

    }



    /* =====================================================
       GET CARD WIDTH
    ===================================================== */

    function getCardWidth() {

        const card =
            track.querySelector(
                ".client-testimonial-card"
            );


        if (!card) {

            return 0;

        }


        const width =
            card.getBoundingClientRect().width;


        return width + 24;

    }



    /* =====================================================
       BUILD INFINITE CAROUSEL
    ===================================================== */

    function buildCarousel() {


        visibleCards =
            getVisibleCards();



        /*
         * Remove previous clones
         */

        track
            .querySelectorAll(
                ".testimonial-clone"
            )
            .forEach(
                function (clone) {

                    clone.remove();

                }
            );



        /*
         * Get original cards again
         */

        originalCards =
            Array.from(
                track.querySelectorAll(
                    ".client-testimonial-card"
                )
            );



        /*
         * -----------------------------------------------
         * CLONE LAST CARDS
         * -----------------------------------------------
         */

        const beforeClones =
            originalCards
                .slice(-visibleCards)
                .map(
                    function (card) {

                        const clone =
                            card.cloneNode(true);


                        clone.classList.add(
                            "testimonial-clone"
                        );


                        return clone;

                    }
                );



        /*
         * Put last cards before first card
         */

        beforeClones.reverse().forEach(
            function (clone) {

                track.prepend(clone);

            }
        );



        /*
         * -----------------------------------------------
         * CLONE FIRST CARDS
         * -----------------------------------------------
         */

        const afterClones =
            originalCards
                .slice(0, visibleCards)
                .map(
                    function (card) {

                        const clone =
                            card.cloneNode(true);


                        clone.classList.add(
                            "testimonial-clone"
                        );


                        return clone;

                    }
                );



        /*
         * Put first cards after last card
         */

        afterClones.forEach(
            function (clone) {

                track.appendChild(clone);

            }
        );



        /*
         * -----------------------------------------------
         * START FROM FIRST ORIGINAL CARD
         * -----------------------------------------------
         */

        currentIndex =
            visibleCards;


        track.style.transition =
            "none";


        moveCarousel();



        /*
         * Force browser repaint
         */

        track.offsetHeight;



        track.style.transition =
            "transform .65s cubic-bezier(.22,.61,.36,1)";



        createDots();

    }



    /* =====================================================
       MOVE CAROUSEL
    ===================================================== */

    function moveCarousel() {


        const distance =
            currentIndex *
            getCardWidth();


        track.style.transform =
            `translateX(-${distance}px)`;


        updateDots();

    }



    /* =====================================================
       NEXT
    ===================================================== */

    function goNext() {


        if (isMoving) {

            return;

        }


        isMoving = true;


        currentIndex++;


        moveCarousel();

    }



    /* =====================================================
       PREVIOUS
    ===================================================== */

    function goPrevious() {


        if (isMoving) {

            return;

        }


        isMoving = true;


        currentIndex--;


        moveCarousel();

    }



    /* =====================================================
       INFINITE LOOP RESET
    ===================================================== */

    track.addEventListener(
        "transitionend",
        function () {


            /*
             * ---------------------------------------------
             * END CLONES
             * ---------------------------------------------
             */

            if (
                currentIndex >=
                originalCards.length +
                visibleCards
            ) {


                currentIndex =
                    visibleCards;


                track.style.transition =
                    "none";


                moveCarousel();


                track.offsetHeight;


                track.style.transition =
                    "transform .65s cubic-bezier(.22,.61,.36,1)";

            }



            /*
             * ---------------------------------------------
             * START CLONES
             * ---------------------------------------------
             */

            if (
                currentIndex <
                visibleCards
            ) {


                currentIndex =
                    originalCards.length +
                    visibleCards -
                    1;


                track.style.transition =
                    "none";


                moveCarousel();


                track.offsetHeight;


                track.style.transition =
                    "transform .65s cubic-bezier(.22,.61,.36,1)";

            }


            isMoving = false;

        }
    );



    /* =====================================================
       CREATE DOTS
    ===================================================== */

    function createDots() {


        dotsContainer.innerHTML = "";


        const totalPages =
            Math.ceil(
                originalCards.length /
                visibleCards
            );



        for (
            let i = 0;
            i < totalPages;
            i++
        ) {


            const dot =
                document.createElement("button");


            dot.type = "button";


            dot.setAttribute(
                "aria-label",
                "Testimonial " + (i + 1)
            );



            dot.addEventListener(
                "click",
                function () {


                    if (isMoving) {

                        return;

                    }


                    currentIndex =
                        visibleCards +
                        (
                            i *
                            visibleCards
                        );


                    /*
                     * Safety check
                     */

                    if (
                        currentIndex >=
                        originalCards.length +
                        visibleCards
                    ) {

                        currentIndex =
                            visibleCards;

                    }


                    moveCarousel();

                }
            );


            dotsContainer.appendChild(dot);

        }


        updateDots();

    }



    /* =====================================================
       UPDATE DOTS
    ===================================================== */

    function updateDots() {


        const dots =
            dotsContainer.querySelectorAll(
                "button"
            );


        if (!dots.length) {

            return;

        }


        let logicalIndex =
            currentIndex -
            visibleCards;


        logicalIndex =
            (
                logicalIndex +
                originalCards.length
            ) %
            originalCards.length;


        const activePage =
            Math.floor(
                logicalIndex /
                visibleCards
            );


        dots.forEach(
            function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === activePage
                );

            }
        );

    }



    /* =====================================================
       MOUSE DRAG START
    ===================================================== */

    viewport.addEventListener(
        "mousedown",
        function (event) {


            if (event.button !== 0) {

                return;

            }


            isDragging = true;

            dragMoved = false;


            dragStartX =
                event.clientX;


            dragCurrentX =
                event.clientX;


            dragStartPosition =
                currentIndex *
                getCardWidth();


            track.style.transition =
                "none";


            track.classList.add(
                "dragging"
            );


            viewport.classList.add(
                "dragging"
            );


            stopAutoPlay();


            event.preventDefault();

        }
    );



    /* =====================================================
       MOUSE DRAG MOVE
    ===================================================== */

    window.addEventListener(
        "mousemove",
        function (event) {


            if (!isDragging) {

                return;

            }


            dragCurrentX =
                event.clientX;


            const difference =
                dragStartX -
                dragCurrentX;


            if (
                Math.abs(difference) > 5
            ) {

                dragMoved = true;

            }


            const newPosition =
                dragStartPosition +
                difference;


            track.style.transform =
                `translateX(-${newPosition}px)`;

        }
    );



    /* =====================================================
       MOUSE DRAG END
    ===================================================== */

    window.addEventListener(
        "mouseup",
        function () {


            if (!isDragging) {

                return;

            }


            isDragging = false;


            track.classList.remove(
                "dragging"
            );


            viewport.classList.remove(
                "dragging"
            );


            const difference =
                dragStartX -
                dragCurrentX;


            track.style.transition =
                "transform .65s cubic-bezier(.22,.61,.36,1)";



            /*
             * Drag LEFT
             */

            if (
                difference > 60
            ) {

                goNext();

            }


            /*
             * Drag RIGHT
             */

            else if (
                difference < -60
            ) {

                goPrevious();

            }


            /*
             * Small movement
             */

            else {

                moveCarousel();

            }


            startAutoPlay();

        }
    );



    /* =====================================================
       PREVENT CLICK AFTER DRAG
    ===================================================== */

    viewport.addEventListener(
        "click",
        function (event) {


            if (dragMoved) {

                event.preventDefault();

                event.stopPropagation();

                dragMoved = false;

            }

        },
        true
    );



    /* =====================================================
       TOUCH START
    ===================================================== */

    viewport.addEventListener(
        "touchstart",
        function (event) {


            dragStartX =
                event.touches[0].clientX;


            dragCurrentX =
                dragStartX;


            stopAutoPlay();

        },
        {
            passive:true
        }
    );



    /* =====================================================
       TOUCH END
    ===================================================== */

    viewport.addEventListener(
        "touchend",
        function (event) {


            dragCurrentX =
                event.changedTouches[0].clientX;


            const difference =
                dragStartX -
                dragCurrentX;


            if (
                Math.abs(difference) > 50
            ) {


                if (difference > 0) {

                    goNext();

                } else {

                    goPrevious();

                }

            }


            startAutoPlay();

        },
        {
            passive:true
        }
    );



    /* =====================================================
       BUTTONS
    ===================================================== */

    nextButton.addEventListener(
        "click",
        function () {

            goNext();

        }
    );


    prevButton.addEventListener(
        "click",
        function () {

            goPrevious();

        }
    );



    /* =====================================================
       AUTOPLAY
    ===================================================== */

    function startAutoPlay() {


        clearInterval(
            autoPlayTimer
        );


        autoPlayTimer =
            setInterval(
                function () {

                    goNext();

                },
                5000
            );

    }


    function stopAutoPlay() {


        clearInterval(
            autoPlayTimer
        );

    }



    /* =====================================================
       PAUSE ON HOVER
    ===================================================== */

    const section =
        document.querySelector(
            ".client-testimonial-section"
        );


    if (section) {


        section.addEventListener(
            "mouseenter",
            function () {

                stopAutoPlay();

            }
        );


        section.addEventListener(
            "mouseleave",
            function () {

                startAutoPlay();

            }
        );

    }



    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        function () {


            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        buildCarousel();

                    },
                    250
                );

        }
    );



    /* =====================================================
       INITIALIZE
    ===================================================== */

    buildCarousel();


    startAutoPlay();


});




/* =========================================================
   EXPERT LINK - SERVICES CARD ANIMATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const serviceCards = document.querySelectorAll(".el-service-card");

    if (!serviceCards.length) {
        return;
    }

    let activeIndex = 0;

    const animationSpeed = 2800;


    /* -----------------------------------------
       ACTIVE CARD
    ----------------------------------------- */

    function setActiveCard(index) {

        serviceCards.forEach(function (card, i) {

            card.classList.toggle(
                "active",
                i === index
            );

        });

    }


    /* -----------------------------------------
       NEXT CARD
    ----------------------------------------- */

    function nextCard() {

        activeIndex++;

        if (activeIndex >= serviceCards.length) {
            activeIndex = 0;
        }

        setActiveCard(activeIndex);

    }


    /* -----------------------------------------
       START ANIMATION
    ----------------------------------------- */

    setActiveCard(activeIndex);

    let serviceTimer = setInterval(
        nextCard,
        animationSpeed
    );


    /* -----------------------------------------
       PAUSE ON HOVER
    ----------------------------------------- */

    const servicesWrapper =
        document.querySelector(".el-services-wrapper");


    if (servicesWrapper) {

        servicesWrapper.addEventListener(
            "mouseenter",
            function () {

                clearInterval(serviceTimer);

            }
        );


        servicesWrapper.addEventListener(
            "mouseleave",
            function () {

                serviceTimer = setInterval(
                    nextCard,
                    animationSpeed
                );

            }
        );

    }

});

/* =========================================================
   EXPERT LINK - GEM SERVICES
   HOVER EFFECT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(".el-gem-card");

    if (!cards.length) {
        return;
    }

    cards.forEach(function (card) {

        card.addEventListener("mouseenter", function () {

            cards.forEach(function (item) {
                item.classList.remove("active");
            });

            card.classList.add("active");

        });


        card.addEventListener("mouseleave", function () {

            card.classList.remove("active");

        });

    });

});
/* =========================================================
   EXPERTLINK - ACTIVE HEADER MENU
   Automatically highlights the current page
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    function setActiveMenu() {

        const navLinks = document.querySelectorAll(
            ".main-navigation .nav-link"
        );

        if (!navLinks.length) {
            return;
        }


        /* ================================================
           GET CURRENT PAGE
        ================================================ */

        let currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        /*
         * If URL ends with / or no filename is found,
         * consider it as index.html
         */

        if (
            currentPage === "" ||
            currentPage === "/" ||
            !currentPage.includes(".")
        ) {

            currentPage = "index.html";

        }


        /* ================================================
           REMOVE ACTIVE FROM ALL LINKS
        ================================================ */

        navLinks.forEach(function (link) {

            link.classList.remove("active");

        });


        /* ================================================
           ADD ACTIVE TO CURRENT PAGE
        ================================================ */

        navLinks.forEach(function (link) {

            const href =
                link.getAttribute("href");


            if (!href) {
                return;
            }


            const linkPage =
                href
                    .split("/")
                    .pop()
                    .split("?")[0]
                    .split("#")[0]
                    .toLowerCase();


            if (linkPage === currentPage) {

                link.classList.add("active");

            }

        });

    }


    /* ================================================
       HEADER LOAD HONE KE BAAD ACTIVE MENU
    ================================================ */

    setActiveMenu();


    /* ================================================
       HEADER DYNAMICALLY LOAD HOTA HAI
       Isliye #header ko observe karenge
    ================================================ */

    const headerContainer =
        document.getElementById("header");


    if (headerContainer) {

        const headerObserver =
            new MutationObserver(function () {

                setActiveMenu();

            });


        headerObserver.observe(
            headerContainer,
            {
                childList: true,
                subtree: true
            }
        );

    }


    /* ================================================
       EXTRA CHECK
       Header fetch ke baad menu active ensure karega
    ================================================ */

    setTimeout(function () {

        setActiveMenu();

    }, 300);


    setTimeout(function () {

        setActiveMenu();

    }, 1000);

});


/* =========================================================
   EXPERT LINK - CLIENT LOGOS MANUAL SWIPE / DRAG
   Mobile + Desktop
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const clientSection = document.querySelector(".el-client-section");

    if (!clientSection) return;

    /*
     * Client logo area automatically find karo
     */
    const images = clientSection.querySelectorAll("img");

    if (images.length < 2) return;

    let track = null;

    images.forEach(function (img) {

        if (track) return;

        let parent = img.parentElement;

        while (
            parent &&
            parent !== clientSection
        ) {

            const children =
                parent.children;

            if (children.length >= 2) {

                const style =
                    window.getComputedStyle(parent);

                if (
                    style.display === "flex" ||
                    style.display === "grid" ||
                    parent.scrollWidth > parent.clientWidth
                ) {
                    track = parent;
                    break;
                }
            }

            parent = parent.parentElement;
        }
    });

    if (!track) return;


    /* =====================================================
       DRAG VARIABLES
    ===================================================== */

    let isDragging = false;
    let startX = 0;
    let startScroll = 0;


    /* =====================================================
       MOUSE DOWN
    ===================================================== */

    track.addEventListener("mousedown", function (e) {

        isDragging = true;

        startX = e.pageX;

        startScroll = track.scrollLeft;

        track.style.cursor = "grabbing";

        track.style.userSelect = "none";

    });


    /* =====================================================
       MOUSE MOVE
    ===================================================== */

    track.addEventListener("mousemove", function (e) {

        if (!isDragging) return;

        e.preventDefault();

        const distance =
            e.pageX - startX;

        track.scrollLeft =
            startScroll - distance;

    });


    /* =====================================================
       MOUSE UP
    ===================================================== */

    document.addEventListener("mouseup", function () {

        isDragging = false;

        track.style.cursor = "";

        track.style.userSelect = "";

    });


    /* =====================================================
       TOUCH START
    ===================================================== */

    track.addEventListener(
        "touchstart",
        function (e) {

            startX =
                e.touches[0].pageX;

            startScroll =
                track.scrollLeft;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH MOVE
    ===================================================== */

    track.addEventListener(
        "touchmove",
        function (e) {

            const currentX =
                e.touches[0].pageX;

            const distance =
                currentX - startX;

            track.scrollLeft =
                startScroll - distance;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       CURSOR
    ===================================================== */

    track.style.cursor = "grab";

});


