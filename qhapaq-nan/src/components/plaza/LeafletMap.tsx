"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
// biome-ignore lint: any needed for leaflet cluster type
type MarkerCluster = any; // eslint-disable-line
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PlazaPublica } from "@/types/padron";

const GD_COLORS: Record<string, string> = {
  "GD-1": "#16a34a",
  "GD-2": "#65a30d",
  "GD-3": "#ca8a04",
  "GD-4": "#ea580c",
  "GD-5": "#dc2626",
};

function makeMarkerIcon(color: string, isSelected: boolean) {
  if (isSelected) {
    // Pulsing ripple for selected marker
    return L.divIcon({
      className: "",
      html: `
        <style>
          @keyframes qn-pulse {
            0%   { transform:scale(1);   opacity:.8; }
            70%  { transform:scale(2.8); opacity:0; }
            100% { transform:scale(1);   opacity:0; }
          }
          @keyframes qn-pulse2 {
            0%   { transform:scale(1);   opacity:.5; }
            70%  { transform:scale(2.2); opacity:0; }
            100% { transform:scale(1);   opacity:0; }
          }
        </style>
        <div style="position:relative;width:22px;height:22px;">
          <div style="
            position:absolute;inset:0;border-radius:50%;
            background:${color};opacity:.25;
            animation:qn-pulse 1.8s ease-out infinite;
          "></div>
          <div style="
            position:absolute;inset:0;border-radius:50%;
            background:${color};opacity:.18;
            animation:qn-pulse2 1.8s ease-out .4s infinite;
          "></div>
          <div style="
            position:absolute;inset:3px;border-radius:50%;
            background:${color};
            border:2.5px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,.5);
          "></div>
        </div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }
  return L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;
      background:${color};
      border:2.5px solid #fff;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

/** Círculo de cluster personalizado igual al estilo de la imagen de referencia */
function createClusterIcon(cluster: MarkerCluster) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 32 : count < 50 ? 38 : count < 200 ? 44 : 52;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;
      background:rgba(255,255,255,0.92);
      border:2px solid #ccc;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:${size < 38 ? 11 : 13}px;
      font-weight:600;
      color:#1a1a1a;
      box-shadow:0 2px 8px rgba(0,0,0,.2);
    ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyTo({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  if (lat !== null && lng !== null) map.flyTo([lat, lng], 13, { duration: 1.0 });
  return null;
}

interface LeafletMapProps {
  plazas: PlazaPublica[];
  selected: PlazaPublica | null;
  onSelect: (plaza: PlazaPublica) => void;
}

export function LeafletMap({ plazas, selected, onSelect }: LeafletMapProps) {
  const plazasGeocoded = useMemo(
    () => plazas.filter((p) => p.lat !== null && p.lng !== null),
    [plazas],
  );

  return (
    <MapContainer
      center={[-9.19, -75.0]}
      zoom={6}
      minZoom={5}
      maxZoom={18}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterIcon}
        maxClusterRadius={50}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom
      >
        {plazasGeocoded.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat!, p.lng!]}
            icon={makeMarkerIcon(GD_COLORS[p.gd] ?? "#6b7280", selected?.id === p.id)}
            eventHandlers={{ click: () => onSelect(p) }}
          />
        ))}
      </MarkerClusterGroup>

      {selected?.lat != null && selected?.lng != null && (
        <FlyTo lat={selected.lat} lng={selected.lng} />
      )}
    </MapContainer>
  );
}
