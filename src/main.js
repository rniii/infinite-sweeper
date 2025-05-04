const edges      = [[-1, +0], [+0, +1], [+0, -1], [+1, +0]]
const corners    = [[-1, -1], [-1, +1], [+1, +1], [+1, -1]]
const neighbours = [...edges, ...corners]

const createGame = ({ width, density }) => {
  const root = document.createElement("div")
  const rows = [], mines = {}

  root.id = "mines"
  document.body.append(root)

  const createRow = () => {
    const x = rows.length
    const r = []

    for (let y = 0; y < width; y++) {
      const t = document.createElement("div")
      t.className = "hidden"
      t.x = x, t.y = y

      if (x > 1 && Math.random() < density) mines[[x, y]] = 1

      r.push(t)
    }

    root.append(...r), rows.push(r)
  }

  const reveal = el => {
    if (!el || !el.classList.contains("hidden")) return

    const x = el.x, y = el.y

    while (rows.length < x + 4) createRow()

    el.classList.remove("hidden")
    if (mines[[x, y]]) {
      el.classList.add("exploded")
      el.innerText = "💣"
      //location.reload()
      return
    }

    let count = 0
    if (neighbours.map(([u, v]) => count += !!mines[[x+u, y+v]]), count) {
      el.innerText = count
      el.classList.add("count" + count)
    } else {
      neighbours.map(([u, v]) => reveal(rows[x+u]?.[y+v]))
    }
  }

  root.onclick = ({ target }) => target.classList.contains("flag") || reveal(target)
  root.onauxclick = ({ target }) => target.classList.contains("hidden") && target.classList.toggle("flag")
  root.oncontextmenu = e => e.preventDefault()

  createRow()
  for (let i = 0; i < width; i++) reveal(rows[0][i])
}

createGame({ width: 8, density: 5/32 })
