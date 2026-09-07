import { useState } from 'react'

function ItemModifier() {
  const textes = ['helloo', 'jsp quoi mettre', 'bye']
  const [position, setPosition] = useState(0)

  function modifierTexte() {
    setPosition((positionActuelle) => (positionActuelle + 1) % textes.length)
  }

  return (
    <section className="item-card">
      <p className="item-text">{textes[position]}</p>
      <button type="button" onClick={modifierTexte}>
        modifier le texte
      </button>
    </section>
  )
}

export default ItemModifier
