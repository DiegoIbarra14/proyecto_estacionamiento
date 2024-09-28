import React from 'react'

function PageMaquina() {
  return (
    <>
    <Toast ref={toast} />

    {/*DESPACHO - HEADER*/}
    <div className="p-container-titulo">
      <h1 className="container-titulo-table">Tabla de Despachos</h1>
    </div>
    <div className="container-descripcion container-descripcion-modal-locales">
      <div className="container-descripcion-table">
        <p>
          A continuación, se visualiza la lista de los despachos del pedido{" "}
          {props.pedido_id} registrados en el sistema.
        </p>
      </div>
      <div className="container-descripcion-button-add">
        {props.completo != 3 &&
          <>
            <button
              onClick={(e) => {
                setVisibleCreateDespacho(true);
              }}
              className="button button-crear"
            >
              <span style={{marginRight:'.5rem'}}>Crear Despacho</span>
               <i className="pi pi-plus"></i>
            </button>
          </>
        }
      </div>
    </div>

    {/*DESPACHO - TABLA*/}
    <div className="cliente-locales-container">
      <div className="cliente-table-locales">
        <div className="card-table-locales">
          <ListDespachos
            data={despachos}
            onClickRefresh={() => getAllDespachos(props.pedido_id)}
            onInputSearch={(e) => setGlobalFilter(e.target.value)}
            valueGlobalFilter={globalFilter}
          >
            <Column
              body={actionBodyTemplateEditTrabajador}
              header="Responsable del Despacho"
              exportable={false}
            ></Column>
            <Column
              field={"fecha_emision"}
              header="Fecha de Emisión"
            ></Column>
            <Column
              field={"fecha_entrega"}
              header="Fecha de Entrega"
            ></Column>
            <Column
              field={"documento_referencia"}
              header="Documento de Referencia"
            ></Column>
            <Column
              body={actionBodyTemplateDetalleDespacho}
              header="Detalles del Despacho"
              exportable={false}
            ></Column>
            <Column
              header="Estado"
              body={ratingBodyTemplateEstadoDespacho}
              exportable={false}
            ></Column>
            <Column
              body={actionBodyTemplateAccionDespacho}
              header="Acción"
              exportable={false}
            ></Column>
            {/**<Column
                  header="Editar"
                  body={actionBodyTemplateEditDespachos}
                  exportable={false}
                  style={{ minWidth: "8rem" }}
              ></Column>**/}
            <Column
              body={actionBodyTemplateDeleteDespachos}
              header="Eliminar"
              exportable={false}
            ></Column>
          </ListDespachos>
        </div>
      </div>
    </div>
    {/*DESPACHO - ACCION*/}
    <ConfirmDialog
      visible={visibleConfirmChangeStatus}
      onHide={() => {
        setVisibleConfirmChangeStatus(false);
      }}
      message={`Esta Seguro de entregar este despacho`}
      header="Confirmación"
      icon="pi pi-exclamation-triangle"
      acceptLabel="Sí"
      accept={acceptStatus}
      reject={reject}
    />
    {/*DESPACHO - BORRAR*/}
    <ConfirmDialog
      visible={visibleDeleteDespacho}
      onHide={() => {
        setVisibleDeleteDespacho(false);
      }}
      message={`Esta seguro de eliminar el despacho ${despacho.id}`}
      header="Confirmación"
      icon="pi pi-exclamation-triangle"
      acceptLabel="Sí"
      accept={accept2}
      reject={reject}
    />
    <PageDespachoResponsable
      visible={visibleEditTrabajador}
      setVisible={setVisibleEditTrabajador}
      data={despacho}
      setData={setDespacho}
      props={props}
      loadData={() => getAllDespachos(props.pedido_id)}
    />
    <PageCreateDespacho
      visible={visibleCreateDespacho}
      setVisible={setVisibleCreateDespacho}
      data={props}
      loadData={() => getAllDespachos(props.pedido_id)}
    />
    <PageDetailDespacho
      visible={visibleDetalleDespacho}
      setVisible={setVisibleDetalleDespacho}
      data={despachoDetalle}
    />

  </>
);
}

export default PageMaquina