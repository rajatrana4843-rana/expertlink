document.addEventListener("DOMContentLoaded", function () {

    const whatsappNumber = "+919818799007"; // YAHAN APNA NUMBER DALO
    const message = "Hello, I want to know more about your products.";

    const button = document.createElement("a");

    button.href =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.setAttribute("aria-label", "Chat on WhatsApp");

    button.innerHTML = `
        <svg width="36" height="36" viewBox="0 0 32 32">
            <path fill="#ffffff" d="M16.04 3C9.39 3 4 8.23 4 14.68c0 2.3.69 4.45 1.88 6.26L4 27l6.27-1.82a12.3 12.3 0 0 0 5.77 1.43C22.69 26.61 28 21.38 28 14.92 28 8.47 22.69 3 16.04 3zm0 21.6a10.3 10.3 0 0 1-5.25-1.45l-.38-.22-3.72 1.08 1.1-3.59-.25-.37a9.55 9.55 0 0 1-1.56-5.2c0-5.3 4.48-9.62 10.06-9.62 5.57 0 10.05 4.32 10.05 9.62 0 5.31-4.48 9.75-10.05 9.75zm5.52-7.3c-.3-.15-1.79-.86-2.07-.96-.28-.1-.48-.15-.69.15-.2.3-.78.96-.96 1.16-.18.2-.35.22-.66.07-.3-.15-1.28-.46-2.44-1.46a9.1 9.1 0 0 1-1.69-2.03c-.18-.3-.02-.46.13-.61.14-.13.3-.35.46-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.69-1.6-.94-2.2-.25-.58-.5-.5-.69-.51h-.59c-.2 0-.53.07-.81.37-.28.3-1.06 1.01-1.06 2.47s1.09 2.87 1.24 3.07c.15.2 2.14 3.18 5.19 4.46.73.3 1.29.48 1.73.62.73.22 1.39.19 1.91.12.58-.08 1.79-.71 2.04-1.4.25-.68.25-1.27.18-1.39-.08-.12-.28-.2-.58-.35z"/>
        </svg>
    `;

    button.style.cssText = `
        position: fixed !important;
        right: 25px !important;
        bottom: 25px !important;
        width: 62px !important;
        height: 62px !important;
        background: #25D366 !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 2147483647 !important;
        box-shadow: 0 5px 20px rgba(0,0,0,0.30) !important;
        text-decoration: none !important;
    `;

    document.body.appendChild(button);

});