# [TODO:패키지명]

react-leaflet 기반으로 구축한 바로e맵 타일 컴포넌트입니다.
[바로e맵이란?](http://map.ngii.go.kr/mi/emapMain/emapIntro01.do)

## 설치

```sh
npm i [TODO:경로]
```

## 버전별 기능

| 버전   | 출시일        | 기능                                                                       |
| ------ | ------------- | -------------------------------------------------------------------------- |
| v0.1.0 | TODO:등록일자 | 외국인에게 편의성을 제공하는 다국어지도 제공(한국어, 영어, 중국어, 일본어) |
| v0.2.0 | 예정          | 큰글씨로 표현하여 더 잘 보이는 저시력자용 지도 제공                        |
| v0.3.0 | 예정          | 색 혼돈을 최소화한 색각이상용 지도 제공                                    |

## 컴포넌트 목록

| 컴포넌트명    | 설명                | 파라미터                                                                     |
| ------------- | ------------------- | ---------------------------------------------------------------------------- |
| NgiiTileLayer | 바로e맵 타일레이어  | `apiKey`\* : 바로e맵 API 키<br/> `lang` : 국가코드(["kr", "en", "zh", "ja"]) |
| NGII_CRS      | 바로e맵 좌표계(CRS) | -                                                                            |

## react-leaflet 샘플 코드

```javascript
import React from "react";
import { MapContainer } from "react-leaflet";
import { NgiiTileLayer, NGII_CRS } from "./lib";

import "./custom-leaflet.css"; //Just @import "~leaflet/dist/leaflet.css";

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
```

## 의존성

```
"leaflet": "^1.8.0",
"leaflet.wmts": "^1.0.2",
"proj4leaflet": "^1.0.2",
"react-leaflet": "^4.0.1",
...
```
