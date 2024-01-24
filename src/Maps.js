import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet-routing-machine";
import placeholderIcon from "./assets/placeholder.png";
// import airplaneIcon from "./assets/airplane.png";
import "leaflet-rotatedmarker";
require("leaflet.animatedmarker/src/AnimatedMarker");

const icon = L.icon({
  iconUrl: placeholderIcon,
  iconSize: [38, 38],
});

const airplane = new L.DivIcon({
  className: "custom-airplane-icon",
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-airplane-fill" viewBox="0 0 16 16"> <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849"/></svg>',
  iconSize: [30, 30],
  iconAnchor: [15, 15], // Adjust the anchor to center the icon properly
});

const car = new L.DivIcon({
  className: "custom-car-icon",
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-car-front" viewBox="0 0 16 16"><path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17s2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276"/><path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.8.8 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155s4.037-.084 5.592-.155A1.48 1.48 0 0 0 15 9.611v-.413q0-.148-.03-.294l-.335-1.68a.8.8 0 0 0-.43-.563 1.8 1.8 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3z"/></svg>',
  iconSize: [30, 30],
  iconAnchor: [15, 15], // Adjust the anchor to center the icon properly
}); 

const position = [28.8389, 78.7763];

function ResetCenterView({ selectedPosition, markerRef, setRoadDistance }) {
  const map = useMap();
  const [routingControl, setRoutingControl] = useState(null);

  const place = selectedPosition?.display_name?.split(",")[0];

  const marker = markerRef?.find((ref) => {
    return ref?.current?.options?.children?.props?.children?.[0] === place;
  })?.current;

  // Add or adjust the zoom level as needed
  // const zoom = 5;

  let popup, view;
  useEffect(() => {
    if (selectedPosition?.lat && map) {
      // console.log(selectedPosition, "selectedPosition")
      map.whenReady(() => {
        // const newCenter = [selectedPosition.lat, selectedPosition.lon];
        // const newZoom = Math.floor(Math.random() * 3) + zoom; // Set your desired zoom level

        // map.setView(newCenter, newZoom, {
        //   animate: true,
        //   duration: 1, // Animation duration in seconds
        // });

        if (routingControl) {
          map.removeControl(routingControl);
        }

        map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        const markerPositions = [position];
        markerPositions.push([selectedPosition.lat, selectedPosition.lon]);
        const bounds = L.latLngBounds(markerPositions);
        map.fitBounds(bounds, {
          animate: true,
          duration: 1,
        });

        let animatedMarker;
        if (selectedPosition?.address?.country === "India") {
          const newRoutingControl = L.Routing.control({
            waypoints: [
              L.latLng(position[0], position[1]),
              L.latLng(
                parseFloat(selectedPosition.lat),
                parseFloat(selectedPosition.lon)
              ),
            ],
            routeWhileDragging: true,
            createMarker: function (i, waypoint, n) {
              const location = waypoint.latLng;
              const marker = L.marker(location, {
                icon: L.icon({
                  iconUrl: placeholderIcon, // Adjust the path accordingly
                  iconSize: [38, 38],
                }),
                draggable: false,
              });
              return marker;
            },
          }).addTo(map);

          newRoutingControl.on("routesfound", function (e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            // console.log('Total distance is ' + (summary.totalDistance / 1000).toFixed(1) + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
            setRoadDistance((summary.totalDistance / 1000).toFixed(1));
          });

          newRoutingControl
            .on("routesfound", function (e) {
              var marker1 = L.marker(position, { icon: car }).addTo(map);
              var routes = e.routes;
              // debugger
              routes[0].coordinates.forEach(function (coord, index) {
                setTimeout(() => {
                  marker1.setLatLng([coord?.lat, coord?.lng]);
                }, 10 * index);
              });
            })
            .addTo(map);

          // Set the new routing control reference
          setRoutingControl(newRoutingControl);
        } else {
          setRoadDistance(null);

          const polylineCoordinates = [
            position,
            [selectedPosition.lat, selectedPosition.lon],
          ];
          const polyline = L.polyline(polylineCoordinates, {
            color: "red",
          }).addTo(map);

          function calculateBearing(point1, point2) {
            const lat1 = point1[0] * (Math.PI / 180),
              lon1 = point1[1] * (Math.PI / 180),
              lat2 = point2[0] * (Math.PI / 180),
              lon2 = point2[1] * (Math.PI / 180);

            const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
            const x =
              Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

            let angle = Math.atan2(y, x);
            angle = (angle * (180 / Math.PI) + 360) % 360;
            if(angle >= 300){
              const upperDiff = angle - 300;
              const diffValue = upperDiff + upperDiff - 10;
              angle = angle - diffValue;
            }

            return angle;
          }

          const rotangle = calculateBearing(
            polylineCoordinates[0],
            polylineCoordinates[1]
          );
          console.log(rotangle, "rotangle");
          
          animatedMarker = L.animatedMarker(polyline.getLatLngs(), {
            icon: airplane,
            autoStart: false, // Don't start the animation automatically
            onEnd: function () {
              // Animation end callback
              console.log("Animation completed");
            },
            rotationAngle: rotangle,
          }).addTo(map);

          animatedMarker.start();

          setRoutingControl(polyline);
        }

        // view = setTimeout(() => {
        //   map.setView(newCenter, newZoom, {
        //     animate: true,
        //     duration: 1, // Animation duration in seconds
        //   });
        // }, 100);

        popup = setTimeout(() => {
          if (
            marker &&
            (!marker.getPopup().isOpen() || marker.getPopup().isOpen())
          ) {
            setTimeout(() => {
              if (animatedMarker) {
                animatedMarker.stop();
              }
            }, 500);

            marker.openPopup();
          }
        }, 1500);
      });
    }

    return () => {
      clearTimeout(popup, view);
    };
  }, [selectedPosition, map]);

  // Conditional rendering based on existence of map and selectedPosition
  if (!map || !selectedPosition) {
    return null;
  }

  return null;
}

function Distance(props) {
  const { origin, dest } = props;
  const map = useMap();
  const len = (map.distance(origin, dest) / 1000).toFixed(2);

  return <span>{len} km</span>;
}

export default function Maps(props) {
  const { selectPositions, selectedPosition } = props;
  const [markerRef, setMarkerRef] = useState([]);
  const [roadDistance, setRoadDistance] = useState(null);

  useEffect(() => {
    // Initialize markerRef with refs for each position
    setMarkerRef((prevMarkerRef) =>
      selectPositions.map((_, idx) => prevMarkerRef[idx] || React.createRef())
    );
  }, [selectPositions]);

  return position !== undefined ? (
    <MapContainer
      center={position}
      zoom={8}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=mqfVnZAk5m02O8kcDxN5"
      />
      <MarkerClusterGroup>
        {selectPositions?.map((item, idx) => {
          const locationSelection = [item?.lat, item?.lon];
          return (
            <Marker
              position={locationSelection}
              ref={markerRef[idx]}
              icon={icon}
              key={item.place_id}
            >
              <Popup>
                {item?.name} <br />
                {roadDistance !== null &&
                item?.name === selectedPosition?.display_name?.split(",")[0] ? (
                  <span>{roadDistance} km</span>
                ) : (
                  <Distance origin={position} dest={locationSelection} />
                )}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
      <ResetCenterView
        selectedPosition={selectedPosition}
        markerRef={markerRef}
        setRoadDistance={setRoadDistance}
      />
    </MapContainer>
  ) : (
    <h1
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
    >
      Loading...
    </h1>
  );
}
