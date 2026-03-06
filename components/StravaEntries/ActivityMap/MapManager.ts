import mapboxgl, {
  type CircleLayerSpecification,
  type FillLayerSpecification,
  type LineLayerSpecification,
  type SourceSpecification,
  type SymbolLayerSpecification,
} from 'mapbox-gl'

export type LightOrDark = 'light' | 'dark'

interface SrgActivityMapCircleLayerSpecification
  extends CircleLayerSpecification {
  source: string
}
interface SrgActivityMapFillLayerSpecification extends FillLayerSpecification {
  source: string
}
interface SrgActivityMapLineLayerSpecification extends LineLayerSpecification {
  source: string
}
interface SrgActivityMapSymbolLayerSpecification
  extends SymbolLayerSpecification {
  source: string
}

export type SrgActivityMapLayer =
  | SrgActivityMapCircleLayerSpecification
  | SrgActivityMapFillLayerSpecification
  | SrgActivityMapLineLayerSpecification
  | SrgActivityMapSymbolLayerSpecification

class MapManager extends mapboxgl.Map {
  currentTheme: LightOrDark

  constructor(options: mapboxgl.MapOptions & { initialTheme: LightOrDark }) {
    const mapboxOptions = { ...options }
    // @ts-expect-error: Unreachable code error
    delete mapboxOptions.initialTheme
    super(mapboxOptions)

    this.currentTheme = options.initialTheme
  }

  addLayer(layer: mapboxgl.AnyLayer, beforeId?: string): this {
    if (!this.getLayer(layer.id)) {
      super.addLayer(layer, beforeId)
    }
    return this
  }

  removeLayer(layer: string): this {
    if (this.getLayer(layer)) {
      super.removeLayer(layer)
    }
    return this
  }

  addSource(id: string, source: SourceSpecification): this {
    if (!this.getSource(id)) {
      super.addSource(id, source)
    }
    return this
  }
}

export default MapManager
