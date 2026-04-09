document.addEventListener("DOMContentLoaded", async () => {

    // -----------------------------------------------------
    // 0. COMPONENT LOADER
    // -----------------------------------------------------
    // We fetch each component HTML file and inject it into the main page
    async function loadComponents() {
        // Removed 'rsvp' as it was deleted by the user causing the fetch to fail
        const components = ['hero', 'story', 'families', 'event', 'venue', 'compliments', 'footer'];
        try {
            for (const comp of components) {
                const response = await fetch(`components/${comp}.html`);
                const htmlText = await response.text();
                const container = document.getElementById(`comp-${comp}`);
                if (container) {
                    container.innerHTML = htmlText;
                }
            }
        } catch (error) {
            console.error("Error loading components:", error);
        }
    }

    await loadComponents();

    // -----------------------------------------------------
    // 1. COUNTDOWN TIMER LOGIC
    // -----------------------------------------------------
    function initCountdown() {
        // Element existence check since it's loaded dynamically
        if (!document.getElementById("cd-days")) return;

        const targetDate = new Date("May 7, 2026 19:00:00").getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("cd-days").textContent = String(days).padStart(2, '0');
            document.getElementById("cd-hours").textContent = String(hours).padStart(2, '0');
            document.getElementById("cd-mins").textContent = String(minutes).padStart(2, '0');
            document.getElementById("cd-secs").textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }

    initCountdown();

    // -----------------------------------------------------
    // 2. ENVELOPE & LOADER GSAP SEQUENCE
    // -----------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    const loader = document.getElementById("loader");
    const loaderText = document.querySelector(".devanagari-gold");
    const ganeshaImg = document.querySelector(".ganesha-loader-img");
    
    const envelopeGate = document.getElementById("envelope-gate");
    const sealBtn = document.getElementById("wax-seal-btn");
    const gateContent = document.getElementById("gate-content");
    const flapLeft = document.getElementById("flap-left");
    const flapRight = document.getElementById("flap-right");

    // Sequence 1: The Envelope Open
    if(sealBtn) {
        sealBtn.addEventListener('click', () => {
            // Guarantee Music starts immediately!
            if (window.tryStartAudioAfterLoader) window.tryStartAudioAfterLoader();

            // Animate Gate Content disappearing
            gsap.to(gateContent, {
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                ease: "power2.in"
            });

            // Slide flaps open like a luxurious envelope
            gsap.to(flapLeft, {
                x: "-100%",
                duration: 1.5,
                ease: "power3.inOut",
                delay: 0.3
            });
            gsap.to(flapRight, {
                x: "100%",
                duration: 1.5,
                ease: "power3.inOut",
                delay: 0.3,
                onComplete: () => {
                    envelopeGate.style.display = 'none';
                    // Trigger Sequence 2: The Ganesha Loader!
                    playGaneshaLoader();
                }
            });
        });
    }

    // Sequence 2: Glow in and Zoom out Ganesha Loader
    function playGaneshaLoader() {
        const tlLoader = gsap.timeline({
            onComplete: () => {
                loader.style.display = 'none';
                // Start main scroll triggers after loader finishes
                initScrollTriggers();
            }
        });

        tlLoader.fromTo([ganeshaImg, loaderText],
            { scale: 0.8, opacity: 0, filter: "blur(10px)" },
            { scale: 1.1, opacity: 1, filter: "blur(0px)", duration: 2, ease: "power2.out", stagger: 0.2 }
        )
        .to([ganeshaImg, loaderText], {
            scale: 0.6,
            opacity: 0,
            filter: "blur(5px)",
            duration: 1.2,
            ease: "power2.inOut",
            delay: 0.5
        })
        .to(loader, { opacity: 0, duration: 1, ease: "power1.inOut" }, "-=0.8");
    }


    function initScrollTriggers() {

        // Ensure refresh to calculate dynamic heights
        ScrollTrigger.refresh();

        // --- COMPONENT ANIMATIONS ---

        // 1. Hero Animations
        gsap.from(".hero-subtitle, .hero-names-wrapper, .hero-date-box", {
            y: 30,
            opacity: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: "power2.out",
            delay: 0.2
        });

        // 1.5 Story Animations
        if (document.querySelector(".story-center-text")) {
            gsap.from(".story-center-text", {
                opacity: 0,
                y: 30,
                duration: 1,
                scrollTrigger: {
                    trigger: ".story-center-text",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        if (document.querySelector("#story-red-car")) {
            gsap.fromTo("#story-red-car",
                { x: "-50vw" },
                {
                    x: "100%",
                    scrollTrigger: {
                        trigger: ".bottom-city",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 2
                    }
                }
            );
        }

        // 1.8 Families Animations
        gsap.utils.toArray('.person-section').forEach((section, i) => {
            gsap.from(section.querySelectorAll('.person-img, .person-name, .person-parents, .knot-text'), {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        if (document.querySelector(".ampersand")) {
            gsap.from(".ampersand", {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: ".ampersand-divider",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        // 2. Immersive Event Stack Cinematics
        const eventImages = gsap.utils.toArray('.events-image');

        const eventTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".events-image-section",
                start: "top top",
                end: `+=${eventImages.length * 120}%`, // Gives plenty of scroll space
                scrub: 1, // Smooth interpolation
                pin: true,
                onEnter: () => gsap.to("#scroll-indicator", { autoAlpha: 1, duration: 0.5 }),
                onLeave: () => gsap.to("#scroll-indicator", { autoAlpha: 0, duration: 0.5 }),
                onEnterBack: () => gsap.to("#scroll-indicator", { autoAlpha: 1, duration: 0.5 }),
                onLeaveBack: () => gsap.to("#scroll-indicator", { autoAlpha: 0, duration: 0.5 })
            }
        });

        eventImages.forEach((img, i) => {
            if (i > 0) {
                const prevImg = eventImages[i - 1];

                // Staggered logic: First scale the old one down, then wipe the new one up.
                eventTl.to(prevImg, {
                    scale: 0.85,
                    borderRadius: "40px",
                    ease: "power2.inOut",
                    duration: 1
                })
                    .to(img, {
                        clipPath: "inset(0% 0% 0% 0%)",
                        ease: "power2.inOut",
                        duration: 1.5
                    }, "-=0.5"); // Overlap slightly for that gallery feel
            }
        });

        // 3. Vehicle Parallax & Popups
        if (document.querySelector(".blue-merc")) {
            gsap.fromTo(".blue-merc",
                { x: "-120vw", rotation: -15, opacity: 0 },
                {
                    x: "-10%", rotation: -3, opacity: 1,
                    scrollTrigger: {
                        trigger: "#scene-venue",
                        start: "top bottom",
                        end: "center center",
                        scrub: 2 // Smoother scrub
                    }
                }
            );
        }

        if (document.querySelector(".black-sedan")) {
            gsap.fromTo(".black-sedan",
                { x: "120vw", rotation: 15, opacity: 0 },
                {
                    x: "10%", rotation: 4, opacity: 1,
                    scrollTrigger: {
                        trigger: "#scene-night", 
                        start: "top bottom",
                        end: "center center",
                        scrub: 2
                    }
                }
            );
        }

        if (document.querySelector(".location-box")) {
            gsap.from(".location-box", {
                y: 80,
                opacity: 0,
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: ".location-box",
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        // 4. Countdown & Welcome
        if (document.querySelector(".welcome-msg")) {
            gsap.from(".welcome-msg, .welcome-sub", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#scene-night",
                    start: "top 60%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        if (document.querySelector(".cd-item")) {
            gsap.from(".cd-item", {
                scale: 0,
                opacity: 0,
                rotationZ: 10,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: ".countdown-box",
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    // -----------------------------------------------------
    // 3. AUDIO LOGIC (LINKED TO WAX SEAL BUTTON)
    // -----------------------------------------------------
    const bgAudio = document.getElementById('bg-audio');
    let isPlaying = false;

    if (bgAudio) {
        let playAttempted = false;
        
        function unlockAudio() {
            if (!isPlaying && !playAttempted) {
                const playPromise = bgAudio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        isPlaying = true;
                    }).catch(error => {
                        // Audio blocked 
                    });
                }
                playAttempted = true; 
            }
        }

        // Export for Wax Seal Envelope to call instantly
        window.tryStartAudioAfterLoader = unlockAudio;
    }

    // -----------------------------------------------------
    // 4. PREVENT INSPECT ELEMENT & RIGHT CLICK (Basic deterrent)
    // -----------------------------------------------------
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });
    
    document.addEventListener("keydown", function (e) {
        // Prevent F12
        if (e.key === "F12" || e.keyCode === 123) {
            e.preventDefault();
        }
        // Prevent Ctrl+Shift+I (or Cmd+Option+I on Mac)
        if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) {
            e.preventDefault();
        }
        // Prevent Ctrl+Shift+C (or Cmd+Option+C on Mac)
        if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) {
            e.preventDefault();
        }
        // Prevent Ctrl+Shift+J (or Cmd+Option+J on Mac)
        if (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) {
            e.preventDefault();
        }
        // Prevent Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
            e.preventDefault();
        }
    });
});
