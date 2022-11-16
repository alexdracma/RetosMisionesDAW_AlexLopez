function deactivateAllLinks() {
    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.classList.remove("bg-light");
    });
}

export function activateLink(link) {
    deactivateAllLinks();
    link.classList.add("bg-light");
}