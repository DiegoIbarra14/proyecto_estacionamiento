import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { MultiSelect } from 'primereact/multiselect';
import "./estadistica.css";
function InputEstadistica(props) {
  const panelFooterClientes = () => {
    const selectedClientes = props.valueCliente;
    const length = selectedClientes ? selectedClientes.length : 0;
    return (
      <div className="py-2 px-3" style={{ padding: '1rem 1.5rem' }}>
        <b>{length}</b> item{length > 1 ? 's' : ''} seleccionados.
      </div>
    );
  }
  return (
    <div>
      <div className="page-estadisticas-general">
        <div className="card-input-estadistica">
          <p className="page-estadisticas-input-p" style={{ fontWeight: 'bold', color: '#6D6D6D' }}>
            Análisis por producto
          </p>
          <div className="field">
            <label htmlFor="username1" className="block">
              Fecha Inicio*
            </label>
            <InputText
              id="username1"
              aria-describedby="username1-help"
              className="block"
              type="date"
              style={{ width: "100%" }}
              value={props.valueFechaInicio}
              onChange={props.onChangeFechaInicio}
            />
          </div>
          <div className="field">
            <label htmlFor="username1" className="block">
              Fecha Final*
            </label>
            <InputText
              id="username1"
              aria-describedby="username1-help"
              className="block"
              type="date"
              style={{ width: "100%" }}
              value={props.valueFechaFinal}
              onChange={props.onChangeFechaFinal}
            />
          </div>
          <div className="field section-input">
            <label htmlFor="materia_prima">Seleccionar Cliente*</label>
            <MultiSelect
              value={props.valueCliente}
              options={props.optionsCliente}
              onChange={props.onChangeCliente}
              optionLabel={props.optionLabelCliente}
              placeholder="Selecione un Cliente"
              className="multiselect-custom"
              maxSelectedLabels={2}
              display="chip"
              style={{ width: "100%", height: "auto" }}
              panelFooterTemplate={panelFooterClientes}
            />


            {/*<Dropdown
              id="materia_prima"
              value={props.valueCliente}
              options={props.optionsCliente}
              onChange={props.onChangeCliente}
              optionLabel={props.optionLabelCliente}
              placeholder="Seleccion Cliente"
              filter
              style={{ width: "100%" }}
            />*/}
          </div>
          <div className="field section-input">
            <label htmlFor="materia_prima">Seleccionar Producto*</label>
            <Dropdown
              id="materia_prima"
              options={props.optionsProducto}
              optionLabel={props.optionLabelProducto}
              placeholder="Seleccione un Producto"
              filter
              style={{ width: "100%" }}
              value={props.valueProducto}
              onChange={props.onChangeProducto}
            />

          </div>
          <div className="section-buttons-estadistica">
            <Button
              label="Graficar"
              style={{ width: "40%" }}
              className="p-button-success"
              onClick={props.onClickGraficar}
            />
            <Button
              label="Limpiar"
              style={{ width: "40%", paddingLeft: "10px" }}
              className="p-button-warning"
              onClick={props.onClickLimpiar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputEstadistica;
