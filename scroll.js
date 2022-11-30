const sections = document.querySelectorAll("section");
const wasFadedIn = new Array(sections.length).fill(false);

document.getElementById("content").addEventListener("scroll", handleScroll);

for (let section of sections) {
    const children = section.querySelectorAll("h2, p, .main-visit-container");
    for (let i = 0; i < children.length; i++)
        children[i].style.transitionDelay = `${i * 100}ms`;
}

handleScroll();

function animateIn(section, i) {
    const style = section.style;
    if (style.visibility === "visible")
        return;
    const b = wasFadedIn[i];
    style.transitionDuration = b ? "500ms" : "1s";
    style.visibility = "visible";
    style.opacity = "1";
    style.transform = "translateX(0)";
    if (!b)
        animateContents(section);
    section.ontransitionend = null;
}

function animateContents(section) {
    for (let child of section.querySelectorAll("h2, p, .main-visit-container")) {
        const style = child.style;
        style.opacity = "1";
        style.transform = "translateX(0)";
    }
}

function animateOut(section) {
    const style = section.style;
    if (style.visibility === "hidden")
        return;
    style.transitionDuration = "500ms";
    style.opacity = "0";
    section.ontransitionend = hide;
}

function hide(e) {
    e.target.style.visibility = "hidden";
}

function handleScroll() {
    const minBottom = window.innerHeight * 0.1;
    const maxTop = window.innerHeight * 0.9;
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        if (rect.top < maxTop && rect.bottom > minBottom) {
            animateIn(section, i);
            wasFadedIn[i] = true;
        } else
            animateOut(section);
    }
}
