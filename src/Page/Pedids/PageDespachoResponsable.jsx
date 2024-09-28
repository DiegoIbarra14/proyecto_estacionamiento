import React, {useEffect, useRef, useState} from 'react';
import {Dropdown} from "primereact/dropdown";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import AuthUser from "../../AuthUser";

const PageDespachoResponsable = ({visible, setVisible, data, setData, props, loadData}) => {

  const { http } = AuthUser();
  const toast = useRef(null);

  const [trabajadores, setTrabajadores] = useState([]);

  const hideDialog = () => {
    setVisible(false)
  }

  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };

  const handleChangeTrabajadores = (e) => {
    const selectedTrabajador = trabajadores.find(trabajador => trabajador.id === e.value.id);
    setData({
      [`id`]: data.id,
      [`pedido_id`]: data.pedido_id,
      [`trabajador`]: selectedTrabajador,
      [`trabajador_id`]: e.value.id,
      //Error Sintaxis
      [`fecha_emison`]: data.fecha_emision,
      //
      [`fecha_entrega`]: data.fecha_entrega,
      [`documento_referencia`]: data.documento_referencia,
      [`estado_entrega`]: data.estado_entrega,
      [`despachos`]: data.despachos,
    });
  };

  const handleSubmit = () => {
    //DespachoService.updateTrabajador(`${despacho.id}`, despacho)
    http
      .put(`pedidos/despachos/updateTrabajador/${data.id}`, data)
      .then(() => {
        showToast(
          "success",
          "Responsable Seleccionado",
          `Se seleccionó al responsable ${data.trabajador.fullName} correctamente`
        );
        loadData();
      })
      .catch((error) => {
        console.log(data);
        console.log(error);
        showToast(
          "error",
          "Responsable No Seleccionado",
          `No Se selecciono al responsable ${data.trabajador.fullName}`
        );
      });
  };

  const dialogHeader = (
    <>
      <i className="pi pi-briefcase icon-create-proveedor"></i>
      <span>Seleccionar Responsable de Despacho*</span>
    </>
  )

  const dialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => {
          hideDialog();
          toast.current.show({
            severity: "info",
            summary: "Rechazada",
            detail: "No se realizo ninguna acción",
            life: 3000,
          });
        }}
      />
      {data.estado_entrega !== '2' &&
        <Button
          label="Seleccionar Responsable"
          icon="pi pi-check"
          className="p-button-success"
          onClick={() => {
            if (!data.trabajador || !data.trabajador.fullName) {
              showToast(
                "error",
                "Error de ingreso",
                "Debe seleccionar un responsable"
              );
            }
            else {
              handleSubmit();
              hideDialog();
            }
          }}
        />
      }
    </>
  );
  
  const getAllTrabajadores = () => {
    //TrabajadorService.getAll()
    http
      .get("/trabajadores/get")
      .then((response) => {
        const trabajadoresWithFullName = response.data.data.map(trabajador => ({
          ...trabajador,
          fullName: `${trabajador.nombres} ${trabajador.apellidos}`
        }));
        setTrabajadores(trabajadoresWithFullName);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllTrabajadores();
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        style={{ width: "450px" }}
        modal
        className="p-fluid"
        onHide={hideDialog}
        header={dialogHeader}
        footer={dialogFooter}
      >
        <div className="field">
          <label htmlFor="trabajador">Responsable</label>
          <Dropdown
            id="trabajador"
            value={trabajadores.find(trabajador => trabajador.id === data.trabajador_id) || null}
            options={trabajadores}
            onChange={handleChangeTrabajadores}
            optionLabel="fullName"
            placeholder="Selecciona un responsable"
            disabled={data.estado_entrega === '2'}
            filter
            autoFocus
          />
        </div>
      </Dialog>
    </>
  );
};

export default PageDespachoResponsable;