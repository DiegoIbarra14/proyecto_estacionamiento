import React, {useEffect, useRef, useState} from 'react';
import {Dialog} from "primereact/dialog";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import TableProduccion from "../Produccion/TableProduccion";
import {DataTable} from "primereact/datatable";
import AuthUser from "../../AuthUser";
import ListDespachos from "./ListDespachos";
import ListCreateDespachos from "./ListCreateDespachos";

const ProduccionDialog = ({visible, setVisible, rowData, objData, setObjData, setRowData}) => {

  const { http } = AuthUser();
  const toast = useRef(null);

  const [producciones, setProducciones] = useState([]);

  const [sumaProd, setSumaProd] = useState(null);
  const [selectedProduc, setSelectedProduc] = useState(null);

  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };

  const resetDialog = () => {
    setProducciones(null);
    setSelectedProduc(null);
    hideDialog();
  }

  const hideDialog = () => {
    setVisible(false)
  };

  const dialogHeader = (
    <>
      <i className="pi pi-users icon-create-proveedor"></i>
      <span>Producciones</span>
    </>
  )

  const dialogFooter = (
    <>

      <div style={{display:'flex',justifyContent:'end'}}>

        <div style={{display:'flex',justifyContent:'start', flexGrow:'1'}}>
          <Button
            label="Limpiar"
            icon="pi pi-trash"
            className="p-button-info p-button-outlined"
            onClick={() => setSelectedProduc(null)}
          />
        </div>

        <Button
          label="Cancelar"
          icon="pi pi-times"
          className="p-button-danger"
          onClick={resetDialog}
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          className="p-button-success"
          type="submit"
          onClick={() => handleSubmit()}
        />
      </div>
    </>
  );

  function handleSubmit() {
    if (selectedProduc) {
      let dataSelec = selectedProduc.map(data => [{
        produccion_id: data?.produccion_id,
        producto_id:data?.producto_id,
        cantidad_produccion: parseInt(rowData?.cantidad_entregada),
        estado:data.estado,
      }])
      let despachos = [objData.despachos_produccion,dataSelec].flat(2);
      let data = ({...objData,
        despachos_produccion: despachos,
      })
      console.log(sumaProd,rowData.cantidad_entregada);
      if (sumaProd >= rowData.cantidad_entregada*1) {
        console.log('entro suma')
        rowData.estado = 1;
        showToast(
          'success',
          'Asignación correcta',
          'Se agrego correctamente la produccion',
        );
      }else{
        rowData.estado = 2;
        showToast(
          'error',
          'Error selección',
          'Falta agregar produccion',
        );
      }

      setObjData(data);
      // hideDialog();
      resetDialog();
    }

  }

  const fecha_venc = (row) => {
    let date = new Date()
    let fecha = new Date (row?.fecha_produccion)
    let days = rowData?.producto?.tiempo_vida
    date.setDate(fecha.getDate() + days)

    let dateResult = date.toISOString().slice(0,10)
    return (
      <>
        <span>{dateResult}</span>
      </>
    )
  }

  const isRowSelectable = (event) => {
    const data = event.data;
    let suma = selectedProduc === null ? 0 :
      selectedProduc.map(data => data.cantidad).reduce((a,b) => a + b, 0);
    console.log("sumaaaa",suma)
    setSumaProd(suma);
    return isSelectable(suma);
  }

  const isSelectable = (value) => {
    let isSelectable = true;
    if (selectedProduc) {
      isSelectable =  parseInt(rowData?.cantidad_entregada) > value;
    }
    return isSelectable;
  }

  const getDespachoProducciones = () => {
    let id = rowData?.producto_id
    console.log(rowData);
    http
      .get(`/pedidos/produccionproductos/get/${id}`)
      .then((response) => {
        setProducciones(response?.data?.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    if (visible) {
      getDespachoProducciones();
      console.log('Producto: ', rowData);
    }
  }, [visible])

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        style={{ width: "850px" }}
        breakpoints={{'960px': '75vw', '640px': '100vw'}}
        className="p-fluid"
        closable={false}
        draggable={false}
        modal
        onHide={hideDialog}
        header={dialogHeader}
        footer={dialogFooter}
      >
        <TableProduccion
          data={producciones}
          selection={selectedProduc}
          isRowSelectable={isRowSelectable}
          selectionMode="multiple"
          onSelectionChange={(e) => setSelectedProduc(e.value)}
          showSelectAll={false}
        >
          <Column selectionMode="multiple" headerStyle={{width: '3em'}}/>
          <Column field="codigo_produccion" header='Código de Producción'/>
          <Column field="fecha_produccion" header='Fecha de producción'/>
          <Column field="fecha_vencimiento" header='Fecha de Vencimiento'/>
          <Column field="cantidad" header='Cantidad'/>
        </TableProduccion>



      </Dialog>
    </>
  );
};

export default ProduccionDialog;