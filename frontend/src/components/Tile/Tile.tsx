import { ReactElement, ReactNode } from 'react'
import "./Tile.css"

interface TileData {
  children: ReactNode | ReactElement;
  title: string;
}

function Tile({ children, title }: TileData) {
  return (
    <div className="tile">
      <div className="tile-details">
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default Tile