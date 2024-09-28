import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import './table.css';
const Table = (props) => {
  const paginatorLeft = (
    <Button
      type='button'
      icon='pi pi-refresh'
      className='p-button-text'
      onClick={props.onClickRefresh}
    />
  );
  const paginatorRight = (
    <Button type='button' icon='pi pi-cloud' className='p-button-text' />
  );
  const renderHeader1 = () => {
    return (
      <>
        <div className='container-search'>
          {/* <div className='lista'>
            <h1 className='lista-h1'>Lista de Trabajadores</h1>
          </div> */}
        </div>
        <div style={{paddingRight: "10px",}}>
          <div className='flex justify-content-between'>
            <span className='p-input-icon-left'>
              <i className='pi pi-search' />
              <InputText
                style={{width:"235px",}}
                placeholder='Buscar...'
                onInput={props.onInputSearch}
              />
            </span>
          </div>
        </div>
      </>
    );
  };
  return (
    <div className='table-trabajadores'>
      <div className='titulo-table'></div>
      <DataTable
        emptyMessage='No se encontraron resultados.'
        globalFilter={props.valueGlobalFilter}
        filter={true}
        dataKey='id'
        value={props.data}
        paginator
        selection={props.selection}
        onSelectionChange={props.onSelectionChange}
        header={renderHeader1}

        /*responsiveLayout='scroll'*/

        paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
        currentPageReportTemplate='Mostrando del {first} al {last} de {totalRecords}'
        rows={5}
        rowsPerPageOptions={[5, 10, 20, 50]}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
      >
        {props.children}
      </DataTable>
    </div>
  );
};

export default Table;
