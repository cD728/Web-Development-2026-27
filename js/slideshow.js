const content_loaded = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))
let jojo_parts = undefined
let show_side_imgs = true

async function getImage(url) {
    const image = await fetch(url)

    const image_blob = await image.blob()

    return URL.createObjectURL(image_blob)
}

function betterModulus(operand_a, operand_b, modulus) {
    return ((operand_a + operand_b % modulus) + modulus) % modulus
}

function goToHashBy(moveBy) {
    if (moveBy === 0) {
        throw Error("Invalid argument value")
    }

    let part_id = fromHashToPartID(new URL(window.location.href).hash)

    let new_index = betterModulus(part_id, moveBy, jojo_parts.length)
    if (new_index === 0) {
        new_index = betterModulus(new_index, moveBy, jojo_parts.length)
    }

    window.location.href = `#part${new_index}`
}

function goToPart(new_index) {
    let left_index = betterModulus(new_index, -1, jojo_parts.length)
    if (left_index === 0) {
        left_index = betterModulus(left_index, -1, jojo_parts.length)
    }

    let right_index = betterModulus(new_index, 1, jojo_parts.length)
    if (right_index === 0) {
        right_index = betterModulus(right_index, 1, jojo_parts.length)
    }

    changeContent(jojo_parts[new_index].part_name, jojo_parts[new_index].desc_text,
                  jojo_parts[left_index].img_blob, jojo_parts[right_index].img_blob,
                  jojo_parts[left_index].part_name, fromPartIDToHash(jojo_parts[left_index].part_id),
                  jojo_parts[right_index].part_name, fromPartIDToHash(jojo_parts[right_index].part_id)
                 )
}

function fromHashToPartID(hash) {
    switch (hash) {
    case "":
        return 0
    case "#part1":
    case "#part2":
    case "#part3":
    case "#part4":
    case "#part5":
        return parseInt(hash.slice(-1))
    default:
        throw Error("Invalid hash value")
    }
}

function fromPartIDToHash(part_id) {
    switch (part_id) {
    case 0:
        return "#"
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        return `#part${part_id}`
    default:
        throw Error("Invalid part_id value")
    }
}

function changeContent(title, description, left_img_src, right_img_src, left_title, left_href, right_title, right_href) {
    document.querySelector("section.content div#top h1").textContent = title

    //-------------------- WARNING -------------------------
    // this innerHTML should only be used with trusted input
    document.querySelector("section.content div#top p").innerHTML = description.replaceAll("\n", "<br>")

    if (show_side_imgs) {
        document.querySelector("img#left").src = left_img_src
        document.querySelector("img#right").src = right_img_src
    }

    document.querySelector("section.content div#bottom a#left").textContent = left_title
    document.querySelector("section.content div#bottom a#left").href = left_href

    document.querySelector("section.content div#bottom a#right").textContent = right_title
    document.querySelector("section.content div#bottom a#right").href = right_href
}

async function main() {
    const jojo_parts_response = await fetch("/Web-Development-2026-27/api/parts.json")

    if (!jojo_parts_response.ok) {
        console.error("Problem reading response: " + jojo_parts_response.statusText)
        return
    }

    jojo_parts = await jojo_parts_response.json()

    const promises = [
        content_loaded
    ].concat(jojo_parts
             .filter(obj => obj.part_id !== 0)
             .map(obj => getImage(obj.img))
            )

    const image_urls = (await Promise.all(promises)).slice(1)

    for (let part of jojo_parts) {
        if (part.part_id !== 0) {
            part.img_blob = image_urls[part.part_id - 1]
        }
    }

    goToPart(fromHashToPartID(new URL(window.location.href).hash))

    document.querySelector("img#left").onclick = _ => {
        goToHashBy(-1)
    }

    document.querySelector("img#right").onclick = _ => {
        goToHashBy(1)
    }

    window.addEventListener('hashchange', event => {
        goToPart(fromHashToPartID(new URL(event.newURL).hash))
    })
}

main()
