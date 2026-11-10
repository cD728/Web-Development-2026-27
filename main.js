function getDarkMode() {
    const dark_mode = localStorage.getItem("dark-mode")

    if (typeof dark_mode === "boolean") return dark_mode

    const is_dark_scheme_perfered = window.matchMedia("(prefers-color-scheme: dark)").matches
    localStorage.setItem("dark-mode", is_dark_scheme_perfered)

    return is_dark_scheme_perfered
}

function setDarkMode(value) {
    let stylesheet = document.querySelector("link#color-scheme")

    if (value) {
        stylesheet.href = "dark.css"
    } else {
        stylesheet.href = "light.css"
    }

    localStorage.setItem("dark-mode", value)

    return value
}

window.onload = (event) => {
    let checkbox = document.querySelector("input#color-scheme-checkbox")
    let dark_mode = getDarkMode()
    setDarkMode(dark_mode)

    checkbox.checked = dark_mode

    checkbox.onchange = (event) => {
        event.preventDefault()

        setDarkMode(event.target.checked)
    }

}
