import React from "react";
import { MapContainer } from "react-leaflet";
import "./custom-leaflet.css";
import { NgiiTileLayer, NGII_CRS } from "../lib";

const MAP_INIT_VALUE = {
  MIN_ZOOM: 0,
  MAX_ZOOM: 13,
  CENTER: [37.72898172897842, 126.74663916403654],
  ZOOM: 12,
};

export default function SampleLeafletNgiiMap({ children }) {
  return (
    <MapContainer
      crs={NGII_CRS} //필수: 바로e맵 CRS을 import하여 사용
      minZoom={MAP_INIT_VALUE.MIN_ZOOM}
      maxZoom={MAP_INIT_VALUE.MAX_ZOOM}
      center={MAP_INIT_VALUE.CENTER}
      zoom={MAP_INIT_VALUE.ZOOM}
      style={{
        width: "100vw",
        height: "100vh",
      }}
      zoomControl={true}
      bounceAtZoomLimits={false}
    >
      <NgiiTileLayer apiKey={process.env.REACT_APP_NGII_MAP_KEY} lang={"kr"} />
      {/* 필수: 바로e맵 타일레이어를 import하여 사용 */}

      {children}
    </MapContainer>
  );
}
