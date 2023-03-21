import './index.css'

const Items = props => {
  const {details} = props
  const {name, imageUrl} = details
  return (
    <li className="ItemContainer">
      <img src={imageUrl} alt={name} className="ItemImage" />
      <p className="name">{name}</p>
    </li>
  )
}

export default Items
