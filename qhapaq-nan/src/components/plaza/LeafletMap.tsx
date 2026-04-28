"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PlazaPublica } from "@/types/padron";

/**
 * Color por GD para markers.
 */
const GD_COLORS: Record<string, string> = {
  "GD-1": "#16a34a",
  "GD-2": "#84cc16",
  "GD-3": "#eab308",
  "GD-4": "#ea580c",
  "GD-5": "#dc2626",
};

function makeMarkerIcon(color: string, isSelected: boolean) {
  return L.divIcon({
    className: "qn-marker",
    html: `
      <div style="
        width: ${isSelected ? 18 : 14}px;
        height: ${isSelected ? 18 : 14}px;
        background: ${color};
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 200ms;
      "></div>
    `,
    iconSize: [isSelected ? 22 : 18, isSelected ? 22 : 18],
    iconAnchor: [isSelected ? 11 : 9, isSelected ? 11 : 9],
  });
}

interface FlyToProps {
  lat: number | null;
  lng: number | null;
}

function FlyTo({ lat, lng }: FlyToProps) {
  const map = useMap();
  if (lat !== null && lng !== null) {
    map.flyTo([lat, lng], 12, { duration: 1.2 });
  }
  return null;
}

interface LeafletMapProps {
  plazas: PlazaPublica[];
  selected: PlazaPublica | null;
  onSelect: (plaza: PlazaPublica) => void;
}

export function LeafletMap({ plazas, selected, onSelect }: LeafletMapProps) {
  // Filtrar plazas con coordenadas válidas
  const plazasGeocoded = useMemo(
    () => plazas.filter((p) => p.lat !== null && p.lng !== null),
    [plazas],
  );

  return (
    <MapContainer
      center={[-9.19, -75.0152]}            // Centro aproximado del Perú
      zoom={6}
      minZoom={5}
      maxZoom={18}
      className="h-full w-full"
      scrollWheelZoom
    >
      {/* CartoDB Voyager: más contraste en bordes de distritos/departamentos */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />

      {plazasGeocoded.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat!, p.lng!]}
          icon={makeMarkerIcon(GD_COLORS[p.gd] || "#999", selected?.id === p.id)}
          eventHandlers={{ click: () => onSelect(p) }}
        />
      ))}

      {selected && selected.lat !== null && selected.lng !== null && (
        <FlyTo lat={selected.lat} lng={selected.lng} />
      )}
    </MapContainer>
  );
}
