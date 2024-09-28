
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const ListServiciosMaquinas = (props) => {
  const paginatorLeft = (
    <Button
      type='button'
      icon='pi pi-refresh'
      className='p-button-text'
      onClick={props.onClickRefresh}
    />
  );

  const renderHeader1 = () => {
    return (
      <div className='flex justify-content-end p-2'>
        <div className=''>
          <span className='p-input-icon-left'>
            <i className='pi pi-search' />
            <InputText
              placeholder='Buscar...'
              onInput={props.onInputSearch}
            />
          </span>
        </div>
      </div>
    );
  };

  //console.log("Datos de servicios:", props.data); //rastrear id

  return (
    <div className='table-servicios'>
      <DataTable
        globalFilter={props.valueGlobalFilter}
        emptyMessage='No se encontraron resultados.'
        filter={true}
        dataKey='id'
        value={props.data}
        paginator
        selection={props.selection}
        onSelectionChange={props.onSelectionChange}
        header={renderHeader1}
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords}"
        rows={5}
        rowsPerPageOptions={[5, 10, 20, 50]}
        paginatorLeft={paginatorLeft}
      >
        {props.children}
      </DataTable>
    </div>
  );
};

export default ListServiciosMaquinas;
