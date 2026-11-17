const content_loaded = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))
let jojo_parts = undefined
let show_stand = false

async function getImage(url) {
    const image = await fetch(url)

    const image_blob = await image.blob()

    return URL.createObjectURL(image_blob)
}

function betterModulus(operand_a, operand_b, modulus) {
    return ((operand_a + operand_b % modulus) + modulus) % modulus
}

function fromURLToPage(url) {
    const hash = new URL(url).hash

    try {
        if (hash.startsWith("#jojo")) {
            goToJojo(hash)
        } else if (hash === "" || hash.startsWith("#part")) {
            goToPart(fromHashToPartID(hash))
        } else {
            window.location.href = ""
        }
    } catch (error) {
        console.error(error)
        //window.location.href = ""
    }
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
                  jojo_parts[right_index].part_name, fromPartIDToHash(jojo_parts[right_index].part_id),
                  jojo_parts[new_index].jojo_name, new_index
                 )
}

function goToJojo(hash) {
    switch (hash) {
    case "#jojo1":
    case "#jojo2":
    case "#jojo3":
    case "#jojo4":
    case "#jojo5":
        break
    default:
        throw Error("Invalid jojo hash value")
    }

    part_index = parseInt(hash.slice(-1))

    let left_index = betterModulus(part_index, -1, jojo_parts.length)
    if (left_index === 0) {
        left_index = betterModulus(left_index, -1, jojo_parts.length)
    }

    let right_index = betterModulus(part_index, 1, jojo_parts.length)
    if (right_index === 0) {
        right_index = betterModulus(right_index, 1, jojo_parts.length)
    }

    console.log(jojo_parts[part_index])
    changeContentJojo(jojo_parts[part_index].jojo_name, jojo_parts[part_index].stand_name || jojo_parts[part_index].jojo_name,
                      jojo_parts[part_index].jojo_img_blob, jojo_parts[part_index].stand_img_blob,
                      jojo_parts[left_index].img_blob, jojo_parts[right_index].img_blob,
                      jojo_parts[left_index].part_name, fromPartIDToHash(jojo_parts[left_index].part_id),
                      jojo_parts[right_index].part_name, fromPartIDToHash(jojo_parts[right_index].part_id),
                      jojo_parts[part_index].part_name, part_index
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
    case "#jojo1":
    case "#jojo2":
    case "#jojo3":
    case "#jojo4":
    case "#jojo5":
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

function changeContent(title, description, left_img_src, right_img_src, left_title, left_href, right_title, right_href, jojo_name, part_id) {
    document.querySelector("section.content div#top h1").textContent = title

    //-------------------- WARNING -------------------------
    // this innerHTML should only be used with trusted input
    document.querySelector("section.content div#top p").innerHTML = description.replaceAll("\n", "<br>")
    document.querySelector("section.content div#top p").style.display = "inline"

    document.querySelector("section.content div#top div").style.display = "none"

    document.querySelector("img#left").src = left_img_src
    document.querySelector("img#right").src = right_img_src

    document.querySelector("section.content div#bottom a#left").textContent = left_title
    document.querySelector("section.content div#bottom a#left").href = left_href

    document.querySelector("section.content div#bottom a#right").textContent = right_title
    document.querySelector("section.content div#bottom a#right").href = right_href

    document.querySelector("section.content div#bottom a#jojo").textContent = jojo_name
    document.querySelector("section.content div#bottom a#jojo").style.display = jojo_name ? "inline" : "none"
    document.querySelector("section.content div#bottom a#jojo").href = `#jojo${part_id}`
}

function changeContentJojo(jojo_name, stand_name, jojo_img, stand_img, left_img_src, right_img_src, left_title, left_href, right_title, right_href, part_name, part_id) {
    document.querySelector("section.content div#top h1").textContent = jojo_name

    document.querySelector("section.content div#top p").style.display = "none"

    document.querySelector("section.content div#top div img#jojo").src = jojo_img
    document.querySelector("section.content div#top div img#stand").src = stand_img

    document.querySelector("section.content div#top div").style.display = "flex"

    if (stand_img) {
        document.querySelector("section.content div#top div").style.cursor = "pointer"
        document.querySelector("section.content div#top div img#jojo").style.animation = ""
        document.querySelector("section.content div#top div img#stand").style.animation = ""
        show_stand = false
        document.querySelector("section.content div#top div").onclick = _ => {
            show_stand = !show_stand
            let name_node = document.querySelector("section.content div#top h1")
            let jojo_img_node = document.querySelector("section.content div#top div img#jojo")
            let stand_img_node = document.querySelector("section.content div#top div img#stand")

            if (show_stand) {
                name_node.textContent = stand_name
                jojo_img_node.style.animation = "rotate-out 1.5s linear forwards"
                stand_img_node.style.animation = "rotate-in 1.5s linear forwards"
            } else {
                name_node.textContent = jojo_name
                jojo_img_node.style.animation = "rotate-in 1.5s linear forwards"
                stand_img_node.style.animation = "rotate-out 1.5s linear forwards"
            }
        }
    } else {
        document.querySelector("section.content div#top div").style.cursor = "auto"
        document.querySelector("section.content div#top div").onclick = undefined
        document.querySelector("section.content div#top div img#jojo").style.animation = 1
        document.querySelector("section.content div#top div img#stand").style.animation = 0
    }

    document.querySelector("img#left").src = left_img_src
    document.querySelector("img#right").src = right_img_src

    document.querySelector("section.content div#bottom a#left").textContent = left_title
    document.querySelector("section.content div#bottom a#left").href = left_href

    document.querySelector("section.content div#bottom a#right").textContent = right_title
    document.querySelector("section.content div#bottom a#right").href = right_href

    document.querySelector("section.content div#bottom a#jojo").textContent = part_name
    document.querySelector("section.content div#bottom a#jojo").href = `#part${part_id}`
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
            ).concat(jojo_parts
                     .filter(obj => obj.jojo_img)
                     .map(obj => getImage(obj.jojo_img))
                    ).concat(jojo_parts
                             .filter(obj => obj.stand_img)
                             .map(obj => getImage(obj.stand_img)))

    const image_urls = (await Promise.all(promises)).slice(1)

    for (let part of jojo_parts) {
        if (part.part_id !== 0) {
            part.img_blob = image_urls[part.part_id - 1]
            part.jojo_img_blob = image_urls[5 + part.part_id - 1]
            if (part.stand_img) {
                part.stand_img_blob = image_urls[9 + part.part_id - 1]
            }
        }
    }

    fromURLToPage(window.location.href)

    document.querySelector("img#left").onclick = _ => {
        goToHashBy(-1)
    }

    document.querySelector("img#right").onclick = _ => {
        goToHashBy(1)
    }

    window.addEventListener('hashchange', event => {
        fromURLToPage(event.newURL)
    })
}

main()
