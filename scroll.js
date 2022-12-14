class ParallaxRocket {
    element;
    speedMultiplier = 1;

    constructor(element, speedMultiplier) {
        this.element = element;
        this.speedMultiplier = speedMultiplier;
        const isLeft = Math.random() > 0.5;
        if (isLeft)
            this.element.style.left = `${Math.random() * 5}vw`;
        else
            this.element.style.right = `${Math.random() * 5}vw`;
    }
}

const rockets = [];
const sections = document.querySelectorAll("section");
const wasFadedIn = new Array(sections.length).fill(false);

function createRockets() {
    // TODO: this sucks
    const amount = document.querySelectorAll(".main-section").length * 2;
    const container = document.getElementById("parallaxContainer");
    const image = document.createElement("img");
    image.classList.add("parallax-scroll-rocket");
    image.src = "images/rocket-flat.png";
    let multiplier = 0.2;
    for (let i = 0; i < amount; i++) {
        multiplier += Math.random() * 0.2 + 0.2;
        const clone = image.cloneNode(false);
        container.appendChild(clone);
        rockets.push(new ParallaxRocket(clone, multiplier));
    }
}

function scrollToSection(element) {
    return () => {
        const content = document.getElementById("content");
        content.scrollTo(0, element.offsetTop - window.innerHeight * 0.2);
    };
}

function assignScrollButtonEvents() {
    const array = Array.from(document.getElementsByClassName("main-section"));
    for (let i = 0; i < array.length - 1; i++) {
        const e = array[i];
        const btn = e.querySelector(".main-section-scroll-arrow");
        if (btn == null)
            continue;
        btn.onclick = scrollToSection(array[i + 1]);
    }
}

function handleTransitionEnd(i) {
    return e => {
        if (!e.target.matches("section") || e.pseudoElement !== "")
            return;
        if (e.propertyName !== "opacity")
            return;
        const s = e.target.style;
        if (s.opacity === "0") {
            if (!wasFadedIn[i])
                animateContents(e.target, false);
            s.visibility = "hidden";
        } else {
            s.visibility = "visible";
            wasFadedIn[i] = true;
        }
    };
}

for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const children = section.querySelectorAll("h2, p, .main-visit-container");
    for (let j = 0; j < children.length; j++)
        children[j].style.transitionDelay = `${j * 100}ms`;
    section.ontransitionend = handleTransitionEnd(i);
}

function animateIn(section, i) {
    const style = section.style;
    if (style.opacity === "1")
        return;
    const b = wasFadedIn[i];
    style.transitionDuration = b ? "500ms" : "1s";
    style.visibility = "visible";
    style.opacity = "1";
    style.transform = "translateX(0)";
    if (!b)
        animateContents(section, true);
}

function animateContents(section, isIn) {
    for (const child of section.querySelectorAll("h2, p, .main-visit-container")) {
        const style = child.style;
        style.opacity = isIn ? "1" : "0";
        style.transform = isIn ? "translateX(0)" : "translateX(-20rem)";
    }
    section.style.setProperty("--bg-op", isIn ? "0.5" : "0");
}

function animateOut(section) {
    const style = section.style;
    if (style.opacity === "0")
        return;
    style.transitionDuration = "500ms";
    style.opacity = "0";
}

function handleScroll() {
    if (rockets.length < 1)
        createRockets();
    const content = document.getElementById("content");
    const topPerElement = content.scrollHeight / rockets.length * 3;
    for (let i = 0; i < rockets.length; i++) {
        const rocket = rockets[i];
        rocket.element.style.top = `${topPerElement * i - content.scrollTop * rocket.speedMultiplier * (1080 / window.innerHeight)}px`;
    }
    const minBottom = window.innerHeight * 0.15;
    const maxTop = window.innerHeight * 0.85;
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        if (rect.top < maxTop && rect.bottom > minBottom)
            animateIn(section, i);
        else
            animateOut(section);
    }
}

assignScrollButtonEvents();
setTimeout(handleScroll, 100);
window.addEventListener("resize", handleScroll);
document.getElementById("content").addEventListener("scroll", handleScroll);