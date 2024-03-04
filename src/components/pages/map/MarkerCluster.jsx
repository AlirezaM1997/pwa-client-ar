// LEAFLET
import "leaflet.markercluster/dist/leaflet.markercluster";
import L from "leaflet";

import { Icon } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
// FUNCTION
import { getSvgPath } from "@functions/getSvgPath";

const markerClusters = L.markerClusterGroup({
  iconCreateFunction: function (cluster) {
    let markers = cluster.getAllChildMarkers();
    let n = 0;
    for (let i = 0; i < markers.length; i++) {
      n += markers[i].__parent._childCount;
    }
    let small = n < 20;
    const html = small
      ? '<div class="mycluster1">' + cluster.getChildCount() + "</div>"
      : '<div class="mycluster2">' + cluster.getChildCount() + "</div>";
    let size = small ? 55 : 65;
    return L.divIcon({ html, className: "", iconSize: L.point(size, size) });
  },
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true,
  polygonOptions: {
    fillColor: "transparent",
    color: "transparent",
    weight: 0,
    opacity: 0,
    fillOpacity: 0,
  },
});

const MarkerCluster = ({ setOpen, setInstanceInfo, result, setCenter, setCoordinates }) => {
  const map = useMap();
  const isUser = useSelector((state) => state.isUser.isUser);

  useEffect(() => {
    setCenter([map.getCenter().lat, map.getCenter().lng]);
    const northEast = map.getBounds().getNorthEast().wrap();
    const northWest = map.getBounds().getNorthWest().wrap();
    const southEast = map.getBounds().getSouthEast().wrap();
    const southWest = map.getBounds().getSouthWest().wrap();
    setCoordinates([
      { lat: northWest.lat, lon: northWest.lng },
      { lat: northEast.lat, lon: northEast.lng },
      { lat: southEast.lat, lon: southEast.lng },
      { lat: southWest.lat, lon: southWest.lng },
    ]);
  }, []);

  useEffect(() => {
    setCenter([map.getCenter().lat, map.getCenter().lng]);
    map.addEventListener("moveend", function () {
      const northEast = map.getBounds().getNorthEast().wrap();
      const northWest = map.getBounds().getNorthWest().wrap();
      const southEast = map.getBounds().getSouthEast().wrap();
      const southWest = map.getBounds().getSouthWest().wrap();
      setCoordinates([
        { lat: northWest.lat, lon: northWest.lng },
        { lat: northEast.lat, lon: northEast.lng },
        { lat: southEast.lat, lon: southEast.lng },
        { lat: southWest.lat, lon: southWest.lng },
      ]);
    });
  }, [map]);

  useEffect(() => {
    markerClusters.clearLayers();
    result?.map((item) => {
      if (item.location?.geo?.lat && item.location?.geo?.lon)
        L.marker(new L.LatLng(item.location.geo.lat, item.location.geo.lon), {
          icon: new Icon({
            iconUrl: item.projectStatus
              ? getSvgPath(item.projectStatus.status)
              : "/assets/svg/association.svg",
            iconSize: [31.5, 45.38],
          }),
        })
          .bindTooltip(
            function () {
              return item.title || item.name;
            },
            {
              permanent: true,
              direction: "bottom",
              className: item.projectStatus
                ? item.projectStatus.status === "ACTIVE"
                  ? "active-marker"
                  : item.projectStatus.status == "PAUSED"
                  ? "paused-marker"
                  : "archived-marker"
                : "association-marker",
              offset: [25, 25],
            }
          )
          .addTo(markerClusters)
          .on("click", () => {
            setOpen(true);
            setInstanceInfo(item);
          });
    });
    map.addLayer(markerClusters);
  }, [map, result, isUser]);
};

export default MarkerCluster;
