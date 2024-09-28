import React, { useRef } from 'react'
import Container from '../../Components/Container/Container';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import Table from '../../Components/Proveedor/Table';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

const pageLocales = () => {
    const toast=useRef(null)
    return (
        <>
          <Container >
            <Toast ref={toast} />
            <div className="p-container-headerPrima">
              <div className="p-container-titulo">
    
                <h1 style={{ color: '#04638A' }} className="container-titulo-table">Lista de Servicios</h1>
              </div>
              <div className="container-descripcion">
                <div className="container-descripcion-table">
                  <p>
                    A continuación, se visualiza la lista de servicios registrados
                    en el sistema
                  </p>
                </div>
                <div className="container-descripcion-button-add">
                  <button
                    // onClick={() => {
                    //   cleanServicio();
                    //   setVisibleCreate(true);
                    // }}
                    className="button button-crear"
                  >
                    Crear Servicio <i className="pi pi-plus mr-2"></i>
                  </button>
                </div>
              </div>
            </div>
            <Table
            //   onInputSearch={(e) => setGlobalFilter(e.target.value)}
            //   valueGlobalFilter={globalFilter}
            //   data={servicios}
            //   selection={select}
            //   onSelectionChange={(e) => {
            //     setSelect(e.value);
            //   }}
            //   onClickRefresh={getAllServicios}
            >
              <Column field={"nombre"} header="Nombres" ></Column>
              <Column field="tarifa" header="Tarifas (soles)" ></Column>
              <Column
                field={
                  "unidad_medida_servicio" != null ? "unidad_medida_servicio.nombre" : "unidad_medida_servicio"
                }
                header="Unidades de Medida"
              ></Column>
    
              <Column
                header="Editar"
                // body={actionBodyTemplateEdit}
                exportable={false}
                style={{ minWidth: "8rem" }}
              ></Column>
              <Column
                // body={actionBodyTemplateDelete}
                header="Eliminar"
                exportable={false}
                style={{ minWidth: "8rem" }}
              ></Column>
            </Table>
    
            <Dialog
            //   visible={visibleCreate}
              style={{ width: "450px" }}
              header={
                <>
                  <i className="pi pi-briefcase icon-create-proveedor"></i>Crear
                  Servicios
                </>
              }
              modal
              className="p-fluid"
            //   footer={productDialogFooter}
            //   onHide={hideDialog}
            >
              <div className="field">
                <label htmlFor="nombre">Nombre</label>
                <InputText
                  id="nombre"
                //   value={servicio.nombre}
                //   onChange={(e) => handleChangeNombre(e)}
                  required
                  autoComplete="off"
                />
              </div>
              <div className=" flex flex-block">
                <div className="field" style={{ marginRight: '10px' }}>
                  <label htmlFor="tarifa">Tarifa (soles)</label>
    
    
                  <InputText
                    id="tarifa"
                    // value={servicio.tarifa || ''} // Asegura que el campo esté vacío inicialmente
                    // onChange={(e) => {
                    //   const value = e.target.value;
                    //   // Verifica si el valor cumple con el patrón permitido (hasta 2 dígitos decimales)
                    //   if (value === '' || /^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
                    //     setServicio({ ...servicio, tarifa: value });
                    //   }
                    // }}
                    required
                    autoComplete="off"
                    placeholder="Ingrese tarifa"
                    maxLength={20}
                    inputMode="decimal" // Permite el teclado numérico para ingresar decimales
                  />
    
    
                </div>
                <div className="field">
                  <label htmlFor="unidad_medida_servicio">Unidad de Medida</label>
                  <Dropdown
                    id="unidad_medida_servicio"
                    // value={servicio.unidad_medida_servicio}
                    // options={unidadesMedidas}
                    // onChange={handleChangeUnidadMedida}
                    optionLabel="nombre"
                    placeholder="Seleccione una Unidad de Medida"
                    autoFocus
                    filter
                    style={{ width: '200px' }}
                  />
                </div>
              </div>
            </Dialog>
    
           
          </Container>
        </>
      );
}

export default pageLocales
