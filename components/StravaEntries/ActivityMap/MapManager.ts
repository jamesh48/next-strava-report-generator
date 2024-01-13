import mapboxgl from 'mapbox-gl';
import { CircleLayer, FillLayer, LineLayer, SymbolLayer } from 'mapbox-gl';
interface MapManager extends mapboxgl.Map {
  currentTheme: LightOrDark;
}

export type LightOrDark = 'light' | 'dark';
interface UnitedViewCircleLayer extends CircleLayer {
  source: string;
}
interface UnitedViewFillLayer extends FillLayer {
  source: string;
}
interface UnitedViewLineLayer extends LineLayer {
  source: string;
}
interface UnitedViewSymbolLayer extends SymbolLayer {
  source: string;
}

export type UnitedViewLayer =
  | UnitedViewCircleLayer
  | UnitedViewFillLayer
  | UnitedViewLineLayer
  | UnitedViewSymbolLayer;

class MapManager extends mapboxgl.Map {
  constructor(options: mapboxgl.MapboxOptions & { initialTheme: LightOrDark }) {
    let mapboxOptions = { ...options };
    // @ts-ignore: Unreachable code error
    delete mapboxOptions.initialTheme;
    super(mapboxOptions);

    this.currentTheme = options.initialTheme;
  }

  addLayer(layer: UnitedViewLayer): this {
    if (!this.getLayer(layer.id)) {
      super.addLayer(layer);
    }
    return this;
  }

  removeLayer(layer: string): this {
    if (this.getLayer(layer)) {
      super.removeLayer(layer);
    }
    return this;
  }

  addSource(id: string, source: mapboxgl.AnySourceData): this {
    if (!this.getSource(id)) {
      super.addSource(id, source);
    }
    return this;
  }
}

export default MapManager;
