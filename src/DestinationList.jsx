import React, { useEffect, useState } from "react";
// import InputLabel from "@material-ui/core/InputLabel";
// import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
// import Select from '@material-ui/core/Select';
import { useDispatch } from "react-redux";
import { getSelectedPosition, getPositions } from "./mapSlice";
import Select from "react-select";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function DestinationList({ list }) {
  const [place, setPlace] = useState("");
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(getSelectedPosition(event));
    setPlace(event);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const ele = e?.nativeEvent?.target;

    // Access the name attribute
    const nameAttribute = ele?.querySelector("path")?.getAttribute("name");
    const newList = list?.filter((item) => item?.name !== nameAttribute);
    dispatch(getPositions(newList));
    toast.success(`${nameAttribute} is removed from destination list`, {
      closeOnClick: true,
      autoClose: 3000,
      pauseOnFocusLoss: false,
      draggable: false,
      pauseOnHover: false,
    });
  };

  // const shiftMapView = (item) => {

  // }

  useEffect(() => {
    setOptions(
      list?.map((item) => ({
        ...item,
        value: item?.name,
        label: item?.name,
      }))
    );
  }, [list]);

  return (
    <div className="destination_container">
      <h1>Destination List</h1>
      <FormControl variant="standard">
        {/* <InputLabel id="demo-simple-select-standard-label">Destination</InputLabel> */}
        <div
          style={{
            width: "400px",
          }}
        >
          <Select
            value={place}
            onChange={handleChange}
            options={options}
            isSearchable
            isClearable
            getOptionLabel={(e) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ marginLeft: 5 }}>{e.label}</span>
                <OverlayTrigger
                  key={e.label}
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-${"top"}`}>
                      Remove {e.label} from destination list
                    </Tooltip>
                  }
                >
                  <span
                    name={e.label}
                    onClick={(e) => handleDelete(e)}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path
                        name={e.label}
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                      />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </span>
                </OverlayTrigger>
              </div>
            )}
            styles={{
              option: (base) => ({
                ...base,
                height: "100%",
              }),
            }}
          />
        </div>
      </FormControl>
    </div>
  );
}

export default DestinationList;
