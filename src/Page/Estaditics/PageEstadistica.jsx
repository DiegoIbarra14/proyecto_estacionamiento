import React, { useState, useRef, useEffect } from "react";
import "./pageEstadistica.css";
import AuthUser from '../../AuthUser';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { GraficoControl } from './GraficoControl';
import { AlmacenMateriasPrimas } from "./MateriasPrimas/AlmacenMateriasPrimas";
import { MermasMateriasPrimas } from "./MateriasPrimas/MermasMateriasPrimas";
import { MermaProductosTerminados } from "./ProductosTerminados/MermaProductosTerminados";
import { AlmacenProductosTerminados } from "./ProductosTerminados/AlmacenProductosTerminados";
import { MermaGenerada } from "./AnalisisDeLaProduccion/MermaGenerada";
import { SelectButton } from 'primereact/selectbutton';
import { logout } from "../../reducers/authSlices";
import { useDispatch } from "react-redux";

export default function PageEstadistica() {
  const [value, setValue] = useState(1);
  const options2 = [
    { name: 'Materias Primas', value: 1 },
    { name: 'Productos Terminados', value: 2 }
  ];

  const lastSelectedValue = useRef(value);

  const handleSelectButtonChange = (e) => {
    const newValue = e.value !== null ? e.value : lastSelectedValue.current;
    setValue(newValue);
    lastSelectedValue.current = newValue;
  };

  return (
    <div className="caja__estadistica__root">
      <div className="caja__estadistica__root__contenedor">
        <div className="caja__estadistica__root__uno">
          <SelectButton
            value={value}
            onChange={handleSelectButtonChange}
            options={options2}
            optionLabel="name"
            multiple={false}
            className="materias_primas_productos_terminados"
          />
          {value === 1 && (
            <div className="caja__estadistica__root__cajita">
              <div className="caja__estadistica__root__sub__cajita__uno">
                <AlmacenMateriasPrimas titulo={'Almacén de materias primas'} />
              </div>
              <div className="caja__estadistica__root__sub__cajita__dos">
                <MermasMateriasPrimas titulo={'Merma de Materia Primas'} />
              </div>
            </div>
          )}
          {value === 2 && (
            <div className="caja__estadistica__root__cajita">
              <div className="caja__estadistica__root__sub__cajita__uno">
                <AlmacenProductosTerminados titulo={'Almacén de Productos Terminados'} />
              </div>
              <div className="caja__estadistica__root__sub__cajita__dos">
                <MermaProductosTerminados titulo={'Merma de Productos Terminados'} />
              </div>
            </div>
          )}
        </div>
        <div className="caja__estadistica__root__uno">
          <div className="caja__estadistica__root__uno__button">
            <p>Análisis de la producción</p>
          </div>
          <div className="caja__estadistica__root__cajita">
            <div className="caja__estadistica__root__sub__cajita__uno">
              <MermaGenerada titulo={'Merma Generada'} />
            </div>
            <div className="caja__estadistica__root__sub__cajita__dos">
              <GraficoControl />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}