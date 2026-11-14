const DARK_SHEET = "/Web-Development-2026-27/css/dark.css"
const LIGHT_SHEET = "/Web-Development-2026-27/css/light.css"

function getDarkMode() {
    const dark_mode_text = localStorage.getItem("dark-mode")
    const dark_mode = dark_mode_text === "true" ? true : dark_mode_text === "false" ? false : undefined

    if (typeof dark_mode === "boolean") return dark_mode

    const is_dark_scheme_perfered = window.matchMedia("(prefers-color-scheme: dark)").matches
    localStorage.setItem("dark-mode", is_dark_scheme_perfered)

    return is_dark_scheme_perfered
}

function setDarkMode(value) {
    let stylesheet = document.querySelector("link#color-scheme")

    if (value) {
        stylesheet.href = DARK_SHEET
    } else {
        stylesheet.href = LIGHT_SHEET
    }

    localStorage.setItem("dark-mode", value)

    return value
}

function main() {
    let checkbox = document.querySelector("input#color-scheme-checkbox")
    let dark_mode = getDarkMode()
    setDarkMode(dark_mode)

    checkbox.checked = dark_mode

    checkbox.onchange = (event) => {
        event.preventDefault()

        setDarkMode(event.target.checked)
    }

}

main()
