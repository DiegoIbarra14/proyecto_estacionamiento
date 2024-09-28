import React from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import './listProducto.css';

function ListProducto(props) {
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
      <div className='' style={{display: 'flex', justifyContent: 'end', width: "100%"}}>
        <div className='container-search'>
          {/* <div className='lista'>
            

          </div> */}
        </div>
        <div style={{paddingRight: "10px",}}>
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

      </div>


    );
  };
  return (
    <div className='card-table-cliente card-table-productos'>
      <div className='titulo-table'></div>
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
        /*responsiveLayout='scroll'*/
        paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords}"
        rows={5}
        rowsPerPageOptions={[5, 10, 20, 50]}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
      >
        {props.children}
      </DataTable>
    </div>
  );
}

export default ListProducto;
