import React from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import './tableProduccion.css';
import { Column } from 'primereact/column';
function TableProduccion(props) {
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
  const renderHeader = () => {
    return (
          <div className="p-tituloMMT">
              <h4 className="m-0">{props.header}</h4>
          </div>
    )
}
  return (
    <div className='card-table-produccion'>
      <div className=''></div>
      <DataTable
        globalFilter={props.valueGlobalFilter}
        emptyMessage='No se encontraron resultados.'
        filter={true}
        dataKey='id'
        selectionMode={props.selectionMode!=null?"multiple":null} 
        metaKeySelection={false}
        value={props.data}
        selection={props.selection}
        isDataSelectable={props.isRowSelectable}
        onSelectionChange={props.onSelectionChange}
        header={renderHeader}
        /*responsiveLayout='scroll'*/
        paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
        currentPageReportTemplate='Mostrando del {first} al {last} de {totalRecords}'
        rows={5}
        rowsPerPageOptions={[5, 10, 20, 50]}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        showSelectAll={props.showSelectAll}
      >
        {props.children}
        
        <Column headerStyle={{ width: '2rem', textAlign: 'center' }}/>
      </DataTable>
    </div>
  );
}

export default TableProduccion;
