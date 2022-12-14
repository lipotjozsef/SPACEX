class ParallaxRocket {
    element;
    speedMultiplier = 1;

    constructor(element, speedMultiplier) {
        this.element = element;
        this.speedMultiplier = speedMultiplier;
    }
}

const rockets = [];
const sections = document.querySelectorAll("section");
const wasFadedIn = new Array(sections.length).fill(false);
const speedMultipliers = [ 0.4, 0.45, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85 ];
const offsets = [ -5, -4, -3, -2, -1, 1, 2, 3, 4, 5 ];

function getRandomAndRemove(array) {
    if (array.length < 1)
        return null;
    const i = Math.floor(Math.random() * array.length);
    const value = array[i];
    array.splice(i, 1);
    return value;
}

function createRockets() {
    const amount = document.querySelectorAll(".main-section").length;
    const container = document.getElementById("parallaxContainer");
    const image = document.createElement("img");
    image.classList.add("parallax-scroll-rocket");
    image.src = "images/rocket-flat.png";
    for (let i = 0; i < amount; i++) {
        const multiplier = getRandomAndRemove(speedMultipliers);
        const offset = getRandomAndRemove(offsets);
        const div = document.createElement("div");
        div.classList.add("parallax-scroll-rocket-container");
        div.style.top = `${i / amount * 120 + 10}vh`;
        if (offset < 0)
            div.style.left = `${-offset}vw`;
        else
            div.style.right = `${offset}vw`;
        const clone = image.cloneNode(false);
        clone.style.rotate = `${Math.floor(Math.random() * -90)}deg`;
        clone.style.scale = `${multiplier * 0.5}`;
        div.appendChild(clone);
        container.appendChild(div);
        const targetOpacity = getComputedStyle(clone).opacity;
        clone.style.opacity = "0";
        rockets.push(new ParallaxRocket(div, multiplier));
        clone.animate(
            [ { opacity: targetOpacity, scale: `${multiplier * 0.8}` } ],
            { duration: 1000, delay: i * 300, fill: "forwards", easing: "ease-out" }
        );
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
        if (btn != null)
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
    const topPerElement = window.innerHeight / content.scrollHeight;
    for (const rocket of rockets)
        rocket.element.style.transform = `translateY(-${topPerElement * content.scrollTop * rocket.speedMultiplier}px)`;
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


for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const children = section.querySelectorAll("h2, p, .main-visit-container");
    for (let j = 0; j < children.length; j++)
        children[j].style.transitionDelay = `${j * 100}ms`;
    section.addEventListener("transitionend", handleTransitionEnd(i));
}

assignScrollButtonEvents();
setTimeout(handleScroll, 100);
window.addEventListener("resize", handleScroll);
document.getElementById("content").addEventListener("scroll", handleScroll);
document.querySelector("h1")?.style.setProperty("opacity", "1");