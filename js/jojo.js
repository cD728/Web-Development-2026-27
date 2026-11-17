let show_stand = false
let animation_duration = "1.5s"

function main() {
    let person_img = document.querySelector(".jojo-img #person")
    let person_text = document.querySelector(".content #person")

    let stand_img = document.querySelector(".jojo-img #stand")
    let stand_text = document.querySelector(".content #stand")

    let button = document.querySelector(".jojo-img button")

    button.onclick = () => {
        show_stand = !show_stand

        if (show_stand) {
            person_img.style.animation = `${animation_duration} rotate-out linear forwards`
            stand_img.style.animation = `${animation_duration} rotate-in linear forwards`

            person_text.style.animation = `${animation_duration} fade-out linear forwards`
            stand_text.style.animation = `${animation_duration} fade-in linear forwards`
        } else {
            person_img.style.animation = `${animation_duration} rotate-in linear forwards`
            stand_img.style.animation = `${animation_duration} rotate-out linear forwards`

            person_text.style.animation = `${animation_duration} fade-in linear forwards`
            stand_text.style.animation = `${animation_duration} fade-out linear forwards`
        }
    }
}

main()
