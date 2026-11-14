async function getImage(url) {
    const image = await fetch(url)

    const image_blob = await image.blob()

    return URL.createObjectURL(image_blob)
}

function betterModulus(operand_a, operand_b, modulus) {
    return ((operand_a + operand_b % modulus) + modulus) % modulus
}

let image_urls = undefined
let image_node = undefined

async function main() {
    const promises = [
        new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve)),
        getImage("/Web-Development-2026-27/imgs/jojo1.webp"),
        getImage("/Web-Development-2026-27/imgs/jojo2.webp"),
        getImage("/Web-Development-2026-27/imgs/jojo3.webp"),
        getImage("/Web-Development-2026-27/imgs/jojo4.webp"),
        getImage("/Web-Development-2026-27/imgs/jojo5.webp"),
    ]

    image_urls = (await Promise.all(promises)).slice(1)

    image_node = document.querySelector("img")
    image_node.src = image_urls[0]

    document.querySelector("section.slideshow > button.prev").onclick = () => {
        const index = betterModulus(image_urls.indexOf(image_node.src), -1, image_urls.length)

        image_node.src = image_urls[index]
    }

    document.querySelector("section.slideshow > button.next").onclick = () => {
        const index = betterModulus(image_urls.indexOf(image_node.src), 1, image_urls.length)

        image_node.src = image_urls[index]
    }
}

main()
