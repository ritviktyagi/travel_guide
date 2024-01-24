import React, { useState } from "react";
import SearchBox from "./SearchBox";
import Maps from "./Maps";
import { useDispatch, useSelector } from "react-redux";
import DestinationList from "./DestinationList";
import ErrorBoundary from "./ErrorBoundary";
import { useEffect } from "react";
import { getPositions, getSelectedPosition } from "./mapSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // const [selectPosition, setSelectPosition] = useState([]);
  const dispatch = useDispatch();
  const { selectPositions, selectedPosition } = useSelector(
    (state) => state.map
  );

  useEffect(() => {
    if (localStorage.getItem("selectPositions")) {
      dispatch(
        getPositions(JSON.parse(localStorage.getItem("selectPositions")))
      );
    }
    if (localStorage.getItem("selectedPosition")) {
      dispatch(
        getSelectedPosition(
          JSON.parse(localStorage.getItem("selectedPosition"))
        )
      );
    }
  }, []);

  return (
    <div
      className="d-xl-flex custom"
    >
      <div className="col-12 col-xl-6 h-100">
        <ErrorBoundary>
          <Maps
            selectPositions={selectPositions}
            selectedPosition={selectedPosition}
          />
        </ErrorBoundary>
      </div>
      <div className="col-12 col-xl-6">
        <ErrorBoundary>
          <SearchBox />
        </ErrorBoundary>
        <ErrorBoundary>
          <DestinationList list={selectPositions} />
        </ErrorBoundary>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="light"
      />
    </div>
  );
}

export default App;
