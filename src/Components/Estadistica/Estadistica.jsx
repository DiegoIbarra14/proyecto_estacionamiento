import React, { useState } from "react";
import { Chart } from "primereact/chart";
import "./estadistica.css";
function Estadistica(props) {
  const [basicData] = useState({
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "#42A5F5",
        data: [65, 59, 80, 81, 56, 55, 100],
      },
    ],
  });

  const getLightTheme = () => {
    let basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    return {
      basicOptions,
    };
  };

  const { basicOptions } = getLightTheme();

  return (
    <div>
      <div className="card-grafica-bar" >
        <Chart type="bar" data={props.data} options={basicOptions} className="w-full md:w-40rem"/>
      </div>
    </div>
  );
}

export default Estadistica;
