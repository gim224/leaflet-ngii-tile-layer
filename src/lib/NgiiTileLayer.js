import L from "leaflet";
import Proj from "proj4leaflet";
import "leaflet.wmts";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { PropTypes } from "prop-types";

export const NGII_CRS = new Proj.CRS(
  "EPSG:5179",
  "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs",
  {
    resolutions: [
      2088.96, 1044.48, 522.24, 261.12, 130.56, 65.28, 32.64, 16.32, 8.16, 4.08,
      2.04, 1.02, 0.51, 0.255,
    ],
    origin: [-200000, 4000000],
  }
);

/**
 * en, zh, jp
 * @param {string} lang
 * @returns
 */
export default function NgiiTileLayer({ apiKey, lang }) {
  const map = useMap();
  //console.log(map);

  useEffect(() => {
    L.TileLayer.WMTS = L.TileLayer.extend({
      defaultWmtsParams: {
        service: "WMTS",
        request: "GetTile",
        version: "1.0.0",
        layers: "",
        styles: "",
        tilematrixSet: "",
        format: "image/jpeg",
        minZoom: 0,
        maxZoom: 13,
        zIndex: 0,
      },
      initialize: function (url, options) {
        this._url = url;
        var wmtsParams = L.extend({}, this.defaultWmtsParams);
        var tileSize = options.tileSize || this.options.tileSize;
        if (options.detectRetina && L.Browser.retina) {
          wmtsParams.width = wmtsParams.height = tileSize * 2;
        } else {
          wmtsParams.width = wmtsParams.height = tileSize;
        }
        for (var i in options) {
          if (!this.options.hasOwnProperty(i) && i !== "matrixIds") {
            wmtsParams[i] = options[i];
          }
        }
        this.wmtsParams = wmtsParams;
        this.matrixIds = options.matrixIds || this.getDefaultMatrix();
        L.setOptions(this, options);
      },
      onAdd: function (map) {
        this._crs = this.options.crs || map.options.crs;
        L.TileLayer.prototype.onAdd.call(this, map);
      },
      getTileUrl: function (coords) {
        var tileSize = this.options.tileSize;
        var nwPoint = coords.multiplyBy(tileSize);
        nwPoint.x += 1;
        nwPoint.y -= 1;
        var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
        var zoom = this._tileZoom;
        //console.log(this);

        var nw = this._crs.project(this._map.unproject(nwPoint, zoom));
        //var nw = this._crs.project(this._map.unproject(sePoint, zoom));
        var se = this._crs.project(this._map.unproject(sePoint, zoom));
        var tilewidth = se.x - nw.x;

        const tilematrix = this.matrixIds[zoom].identifier;
        //var ident = this.matrixIds[zoom].identifier;
        //var tilematrix = "" + ident;
        const [X0, Y0] = NGII_CRS.options.origin;
        //var X0 = this.matrixIds[zoom].topLeftCorner.lng;
        //var Y0 = this.matrixIds[zoom].topLeftCorner.lat;
        var tilecol = Math.floor((nw.x - X0) / tilewidth);
        var tilerow = -Math.floor((nw.y - Y0) / tilewidth);
        var url = L.Util.template(this._url, {
          z: "L" + String(zoom + 5).padStart(2, "0"),
          y: tilerow,
          x: tilecol,
        });
        return (
          url +
          L.Util.getParamString(this.wmtsParams, url) +
          "&tilematrix=" +
          tilematrix +
          "&tilerow=" +
          tilerow +
          "&tilecol=" +
          tilecol
        );
      },
      setParams: function (params, noRedraw) {
        L.extend(this.wmtsParams, params);
        if (!noRedraw) {
          this.redraw();
        }
        return this;
      },
    });
  }, []);

  useEffect(() => {
    /** Url to WMTS server */
    const url = ["//map.ngii.go.kr/openapi/Gettile.do?apikey=" + apiKey].join(
      ""
    );

    const matrixIds = [...new Array(14)].map((item, index) => {
      return {
        identifier: `L${String(index + 5).padStart(2, "0")}`,
        topLeftCorner: new L.LatLng(0, 0),
      };
    });

    const layer =
      {
        kr: "korean_map",
        en: "english_map",
        zh: "chinese_map",
        ja: "japanese_map",
      }[lang] || "korean_map";

    /** WMTS tile options */
    const wmtsOptions = {
      layer: layer,
      style: "layer",
      tilematrixset: "EPSG:5179",
      format: "image/png",
      attribution: `<img style="width:72px; height:12px;" src="http://map.ngii.go.kr/img/process/ms/map/common/img_btoLogo3.png">`,
      matrixIds: matrixIds,
    };

    const wmts = new L.TileLayer.WMTS(url, wmtsOptions);
    //console.log(wmts);
    map.addLayer(wmts);

    return () => {
      map.removeLayer(wmts);
    };
  }, []);

  return null;
}

NgiiTileLayer.propTypes = {
  apiKey: PropTypes.string.isRequired,
  lang: PropTypes.oneOf(["kr", "en", "zh", "ja"]).isRequired,
};
