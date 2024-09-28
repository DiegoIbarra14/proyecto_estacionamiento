import React, { useState } from 'react';
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable';
import { Tag } from "primereact/tag";
import ListDetalleDespacho from "../../Components/Pedido/ListDetalleDespacho";

const PageDetailDespacho = ({ visible, setVisible, data }) => {

  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [globalFilterDespachoDetalle, setGlobalFilterDespachoDetalle] = useState(null);

  const cleanDespacho = () => { };

  const hideDialog = () => {
    //cleanPedido();
    cleanDespacho();
    setVisible(false);
  };

  const statusBody = (rowData) => {
    let estate = "";
    let color = "";
    if (rowData.estado_entrega == 1) {
      estate = "No entregado";
      color = "danger";
    } else if (rowData.estado_entrega == 2) {
      estate = "Entregado";
      color = "success";
    }
    return <Tag className="mr-2" value={estate} severity={color}></Tag>;
  };

  const dialogFooter = (
    <>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialog}
      />
    </>
  );
  const actionBodyTemplateModal = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-success"
          onClick={() => {
            setSelectedFile(rowData.url_foto);
            setVisibleModal(true);
          }}
        />
      </>
    );
  };
  const getFileNameAndExtension = (url) => {
    const fileName = url.split('/').pop();
    const [name, extension] = fileName.split('.');
    return `${name}.${extension}`;
  };

  const dialogHeader = (
    <>
      <h1>Detalles del Despacho</h1>
      <DataTable value={data.despacho_documentos} className="mi-datatable">
        <Column field="id" header="Codigo" style={{ width: '10%' }}/>
        <Column field="titulo" header="Nombre Documento" style={{ width: '40%' }}/>
        <Column
        header="Nombre del Archivo"
        body={(rowData) => getFileNameAndExtension(rowData.url_foto)}
        style={{ width: '45%' }}
      />
        <Column header="Ver" body={(rowData) => actionBodyTemplateModal(rowData)} style={{ width: '5%' }} />
      </DataTable>
    </>
  );

  return (
    <>
      <Dialog
        visible={visible}
        style={{ width: "80vw", backgroundColor: "#F7F7F8 !important" }}
        modal
        className="p-fluid container-descripcion-modal-locales-dialog"
        footer={dialogFooter}
        onHide={hideDialog}
        header={dialogHeader}
      >
        <div className=""></div>
        <div>
          <div className="detalle-pedido">
            <div className="">
              <ListDetalleDespacho
                data={data.despachos}
                // onClickRefresh={() => getAllPedidosDetalles(props.pedido_id)}
                onInputSearch={(e) =>
                  setGlobalFilterDespachoDetalle(e.target.value)
                }
                valueGlobalFilter={globalFilterDespachoDetalle}
              >
                <Column
                  field={"pedido_detalle.producto.nombre"}
                  header="Productos"
                  className='column column-producto-detalla-de-despacho' /*Productos*/
                />
                <Column
                  field={"pedido_detalle.producto.stock"}
                  header="Cantidades de Productos"
                  className='column column-cantidad-producto-detalla-de-despacho' /*Cantidades de Productos*/
                />
                <Column
                  field={"cantidad_solicitada"}
                  header="Cantidades Solicitadas"
                  className='column column-cantidad-solicitadas-detalla-de-despacho' /*Cantidades Solicitadas*/
                />
                <Column
                  field={"cantidad_entregada"}
                  header="Cantidades Entregadas"
                  className='column column-cantidad-solicitadas-detalla-de-despacho' /*Cantidades Solicitadas*/
                />
                <Column
                  field={"cantidad_pendiente"}
                  header="Cantidades Pendientes"
                  //onChange={handleChangeCantidadPendiente}
                  disable
                  className='column column-cantidad-pendientes-detalla-de-despacho' /*Cantidades Pendientes*/
                />
                <Column
                  body={statusBody}
                  header="Estado"
                  exportable={false}
                  style={{ minWidth: "8rem" }}
                  className='column' /*estado_entrega*/
                />
              </ListDetalleDespacho>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog header="Vista Previa" visible={visibleModal} style={{ width: '50vw' }} onHide={() => setVisibleModal(false)}>
            {selectedFile && selectedFile.endsWith('.pdf') ? (
                <embed src={selectedFile} type="application/pdf" width="100%" height="600px" />
            ) : (
                <img src={selectedFile} alt="Documento" style={{ width: '100%' }} />
            )}
        </Dialog>
    </>
  );
};

export default PageDetailDespacho;