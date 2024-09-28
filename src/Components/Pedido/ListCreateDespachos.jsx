import React from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import './listCreateDespacho.css';
const ListCreateDespachos = (props) => {
  const paginatorLeft = (
    <Button
      type='button'
      icon='pi pi-refresh'
      className='p-button-text'
      onClick={props.onClickRefresh}
    />
  );
  const paginatorRight = (
    <Button type='button' icon='' className='p-button-text' />
  );
  const renderHeader1 = () => {
    return (
      <>
      </>
    );
  };
  return (
    <div className='card-table-detalle-pedido'>
      <div className='titulo-table'></div>
      <DataTable
        globalFilter={props.valueGlobalFilter}
        emptyMessage='No se encontraron resultados.'
        filter={true}
        dataKey='id'
        value={props.data}
        editMode={props.editMode == null?null:"row"}
        //paginator
        selection={props.selection}
        onSelectionChange={props.onSelectionChange}
        header={renderHeader1}
        onRowEditComplete={props.onRowEditComplete == null?null:props.onRowEditComplete}
        /*responsiveLayout='scroll'*/
        paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords}"/*Enlgish a Español*/
        rows={5}
        rowsPerPageOptions={[5, 10, 20, 50]}
        //paginatorLeft={paginatorLeft}
        //paginatorRight={paginatorRight}
      >
        {props.children}
      </DataTable>
    </div>
  );
};

export default ListCreateDespachos;
