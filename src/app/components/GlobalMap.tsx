"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// CSS imported in layout.tsx

// Fix for Leaflet default icon not found
// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mapping of regions to approximate coordinates
const REGION_COORDS: Record<string, [number, number]> = {
    "USA-California": [36.7783, -119.4179],
    "USA-New York": [40.7128, -74.0060],
    "Europe-UK": [55.3781, -3.4360],
    "Asia-India": [20.5937, 78.9629],
    "Africa-South Africa": [-30.5595, 22.9375],
};

interface GlobalMapProps {
    matches: any[];
    recipientLocation?: string;
}

const GlobalMap = ({ matches, recipientLocation }: GlobalMapProps) => {
    return (
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '400px', width: '100%', borderRadius: '0.75rem', zIndex: 10 }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {matches.map((m) => {
                const position = REGION_COORDS[m.location] || [0, 0];
                const isCrossBorder = recipientLocation && m.location && m.location !== recipientLocation;

                // Custom marker icon
                const customIcon = L.divIcon({
                    className: 'bg-transparent border-none',
                    html: `<div style="font-size: 24px;">${isCrossBorder ? '🔴' : '🟢'}</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 30] // Anchor at boottom center
                });

                return (
                    <Marker key={m.donor_id} position={position} icon={customIcon}>
                        <Popup>
                            <div className="text-sm">
                                <strong>Location:</strong> {m.location}<br />
                                {isCrossBorder && <span className="text-red-500 font-bold text-xs">Cross-Border Match</span>}
                                {isCrossBorder && <br />}
                                <strong>Noisy Score:</strong> {m.noisy_score}<br />
                                <strong>Success Prob:</strong> {(m.prob_success * 100).toFixed(1)}%
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default GlobalMap;
