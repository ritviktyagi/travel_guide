import React, { useEffect, useState } from "react";
import OutlinedInput from "@material-ui/core/OutlinedInput";
// import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { getPositions } from "./mapSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export default function SearchBox(props) {
  const dispatch = useDispatch();
  const { selectPositions } = useSelector((state) => state.map);
  // const { selectPosition, setSelectPosition } = props;
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState([]);

  useEffect(() => {
    const res = setTimeout(() => {
      searchResult();
    }, 1000);

    return () => {
      clearTimeout(res);
    };
  }, [searchText]);

  const searchResult = () => {
    const params = {
      q: searchText,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // console.log(JSON.parse(result));
        setListPlace(JSON.parse(result));
      })
      .catch((err) => console.log("err: ", err));
  };

  function setDestination(element) {
    const res = selectPositions.some((item) => {
      return item.place_id === element.place_id;
    });
    if (!res) {
      // setSelectPosition([...selectPosition, element]);
      dispatch(getPositions([...selectPositions, element]));
    }

    toast.success(`${element?.name} is added to destination list`, {
      closeOnClick: true,
      autoClose: 3000,
      pauseOnFocusLoss: false,
      draggable: false,
      pauseOnHover: false,
    });

    setSearchText("");
    setListPlace([]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>Find a destination for you here...</h1>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <OutlinedInput
            style={{ width: "100%" }}
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
          />
        </div>
      </div>
      <div>
        <List component="nav" aria-label="main mailbox folders">
          {listPlace.map((item) => {
            return (
              <div key={item?.place_id}>
                <ListItem button onClick={() => setDestination(item)}>
                  <ListItemIcon>
                    <img
                      src="./placeholder.png"
                      alt="Placeholder"
                      style={{ width: 38, height: 38 }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item?.display_name} />
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
      </div>
    </div>
  );
}
