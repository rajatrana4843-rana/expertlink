/* =========================================================
   EXPERTLINK FOOTER LOADER
   Footer markup lives in components/footer.html.
   Is file ko har page pe load karo, bas <div id="footer"></div> chahiye.
========================================================= */

(function () {

    /* Footer CSS + Font Awesome (agar page me pehle se nahi hai) */

    function addStylesheet(href, match) {

        const exists = Array.prototype.some.call(
            document.querySelectorAll('link[rel="stylesheet"]'),
            function (link) {
                return link.getAttribute("href").indexOf(match) !== -1;
            }
        );

        if (!exists) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            document.head.appendChild(link);
        }
    }

    addStylesheet("css/footer.css", "footer.css");

    addStylesheet(
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
        "font-awesome"
    );


    function loadFooter() {

        let footerContainer = document.getElementById("footer");

        /* Agar page me #footer div nahi hai to khud bana do */

        if (!footerContainer) {
            footerContainer = document.createElement("div");
            footerContainer.id = "footer";
            document.body.appendChild(footerContainer);
        }

        fetch("components/footer.html")

            .then(function (response) {

                if (!response.ok) {
                    throw new Error(
                        "footer.html not found. Status: " + response.status
                    );
                }

                return response.text();
            })

            .then(function (footerHTML) {

                footerContainer.innerHTML = footerHTML;

                /* Current Year */

                const year = document.getElementById("footer-year");

                if (year) {
                    year.textContent = new Date().getFullYear();
                }

            })

            .catch(function (error) {

                console.error("ExpertLink Footer Error:", error);

            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadFooter);
    } else {
        loadFooter();
    }

})();
