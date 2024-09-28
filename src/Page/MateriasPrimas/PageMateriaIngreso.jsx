import React, { useState, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import './pageMateriasPrimas.css';
import InputDecimal from "../../Components/General/Inputs/InputNumberDecimal/InputDecimal";
function PageMateriaIngreso(props) {
  const [errors, setErrors] = useState({});
  const [minIngresoDate, setMinIngresoDate] = useState('');
  const [minVencimientoDate, setMinVencimientoDate] = useState('');
  useEffect(() => {
    if (props.fecha_emision) {
      setMinIngresoDate(props.fecha_emision);
      setMinVencimientoDate(props.fecha_emision);
    }
  }, [props.fecha_emision]);
  useEffect(() => {
    if (!props.materia_ingreso.fecha_ingreso) {
      // establecemos la fecha actual.
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      // actualizar fecha_ingreso a la fecha actual
      props.handleChangeFechaIngreso({ target: { value: formattedDate } });
    }
  }, [props.materia_ingreso, props.handleChangeFechaIngreso]);

  const validateDates = () => {
    let errors = {};
    if (props.fecha_ingreso && props.fecha_emision && props.fecha_ingreso < props.fecha_emision) {
      errors.fecha_ingreso = "La fecha de ingreso no puede ser menor que la fecha de producción.";
    }
    if (props.fecha_vencimiento && props.fecha_emision && props.fecha_vencimiento < props.fecha_emision) {
      errors.fecha_vencimiento = "La fecha de vencimiento no puede ser menor que la fecha de producción.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = () => {
    validateDates();
  };
  const validateChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;
    return (regex.test(value))
  }

  const handleValueChange = (e) => {
    const isValid = validateChange(e)
    if (isValid) {

      props.handleChangeCosto(e);
    }
  };

  return (
    <div className="flex flex-column">

      <div className='field'>
        <label htmlFor='nombre_materia'>Nombre de la Materia Prima</label>
        <InputText
          id='nombre_materia'
          value={props.nombre_materia}
          onChange={props.onChangeNombreMateria}
          disabled
          autoComplete='off'
        />

      </div>
      <div className='field'>
        <label htmlFor='nombre_proveedor'>Nombre del Proveedor</label>
        <InputText
          id='nombre_proveedor'
          value={props.nombre_proveedor}
          onChange={props.onChangeNombreProveedor}
          disabled
          autoComplete='off'

        />

      </div>
      <div className='field pb-3'>
        <label htmlFor='cantidad'>Cantidad Total de Ingreso</label>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <InputDecimal
            containerClass={"w-full"}
            id='cantidad'
            value={props.cantidad}
            onChange={e => {
              const { value } = e.target;
              const regex = /^\d{0,7}(\.\d{0,2})?$/;

              if (regex.test(value) || value === "") {
                props.handleChangeCantidadIngreso(e);
              }
            }}
            autoComplete='off'
            keyfilter='num'
            valueError={props.errorsMPIngreso.cantidad}
          />

          <span
            style={{
              padding: "0px 5px",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "18px"
            }}>
            {props?.unidad_medida?.abreviatura}
          </span>
        </div>
      </div>
      <div className='field pb-3'>
        <label htmlFor='costo_materia_prima'>Costo Total de Materia Prima</label>
        <div style={{ display: "flex", flexDirection: "row" }} >
          <span
            style={{
              padding: "0px 5px",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "18px"
            }}>
            S/.
          </span>
          <InputDecimal
            min="1"
            keyfilter='num'
            id='costo_materia_prima'
            value={props.costo_materia_prima}
            onChange={handleValueChange}
            maxLength={10}
            containerClass={"w-full"}
            valueError={props.errorsMPIngreso.costo_materia_prima}
          />
        </div>
      </div>
      <div className='field pb-3'>
        <label htmlFor='fecha_ingreso'>Fecha de Ingreso</label>
        <InputText
          icon="pi pi-calendar"
          showIcon
          dateFormat="dd/mm/yy"
          id='fecha_ingreso'
          value={props.fecha_ingreso}
          onChange={props.handleChangeFechaIngreso}
          onBlur={handleBlur}
          type='date'
          min={minIngresoDate}
          autoComplete='off'
        />
        {props.errorsMPIngreso?.fecha_ingreso != null && <small className="p-error text-base">{props.errorsMPIngreso?.fecha_ingreso}</small>}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        <p style={{ color: props.errorsMPIngreso.question_one != null ? "red" : "" }}>¿El producto tiene fecha de producción?</p>
        <div style={{ display: "flex", gap: "5px" }}>
          <RadioButton value="si" onChange={props.handleChangeQuestionOne} checked={props.preguntaUno === 'si'} />
          <label>Si</label>
          <RadioButton value="no" onChange={props.handleChangeQuestionOne} checked={props.preguntaUno === 'no'} />
          <label>No</label>
        </div>

      </div>

      {
        props.preguntaUno === "si" ? (
          <div className='field pb-1'>
            <label htmlFor='fecha_emision'>Fecha de Producción</label>
            <InputText
              showIcon
              id='fecha_emision'
              value={props?.fecha_emision}
              onChange={props.handleChangeFechaEmision}
              onBlur={handleBlur}
              autoComplete='off'
              type='date'
              max={props?.fecha_ingreso}
              disabled={props?.fecha_ingreso ? false : true}
            />
            {props?.errorsMPIngreso?.fecha_emision != null && <small className='block text-base' style={{ color: "rgb(226, 76, 76)" }}>{props.errorsMPIngreso.fecha_emision}</small>}
          </div>
        )
          : (
            <p></p>
          )
      }

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        <p style={{ color: props.errorsMPIngreso.question_two != null ? "red" : "" }}>¿El producto tiene fecha de vencimiento?</p>
        <div style={{ display: "flex", gap: "5px" }}>
          <RadioButton value="si" onChange={props.handleChangeQuestionTwo} checked={props.preguntaDos === 'si'} />
          <label>Si</label>
          <RadioButton value="no" onChange={props.handleChangeQuestionTwo} checked={props.preguntaDos === 'no'} />
          <label>No</label>
        </div>
      </div>
      {
        props.preguntaDos === "si" ? (
          <div className='field pb-1'>
            <label htmlFor='fecha_vencimiento'>Fecha de Vencimiento</label>
            <InputText
              showIcon
              id='fecha_vencimiento'
              value={props.fecha_vencimiento}
              onChange={props.handleChangeFechaVencimiento}
              onBlur={handleBlur}
              type='date'
              min={minVencimientoDate}
              autoComplete='off'
            />
            {props?.errorsMPIngreso?.fecha_vencimiento !== null && <small className="p-error text-base">{props?.errorsMPIngreso?.fecha_vencimiento}</small>}
          </div>
        )
          : (
            <p></p>
          )
      }

      <div className='field pb-3'>
        <label htmlFor='lote_interno'>Lote Interno</label>
        <InputText
          id='lote_interno'
          value={props.lote_interno}
          onChange={props.handleChangeLoteInterno}
          autoComplete='off'
        />
        {props?.errorsMPIngreso?.lote_interno !== null && <small className="p-error text-base">{props?.errorsMPIngreso?.lote_interno}</small>}


      </div>
      <div className='field pb-3'>
        <label htmlFor='lote_produccion'>Lote del Producto</label>
        <InputText
          id='lote_produccion'
          value={props.lote_produccion}
          onChange={props.handleChangeLoteProduccion}
          autoComplete='off'
        />
        {props?.errorsMPIngreso?.lote_produccion !== null && <small className="p-error text-base">{props?.errorsMPIngreso?.lote_produccion}</small>}



      </div>
    </div>
  )
}

export default PageMateriaIngreso;
