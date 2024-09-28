
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProductService } from '../../serservice/ProductService';
import './createDespacho.css';
import AuthUser from '../../AuthUser';
import { useDispatch } from 'react-redux';
import { logout } from '../../reducers/authSlices';

const CreateDespacho = () => {
    const { http, getToken, deleteToken } = AuthUser();
    const [my, setMy] = useState(null);
    const [products1, setProducts1] = useState(null);
    const [products2, setProducts2] = useState(null);
    const [products3, setProducts3] = useState(null);
    const [products4, setProducts4] = useState(null);
    const [editingRows, setEditingRows] = useState({});
    const toast = useRef(null);
    const dispatch=useDispatch()
    const columns = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'quantity', header: 'Quantity' },
        { field: 'price', header: 'Price' }
    ];

    const statuses = [
        { label: 'In Stock', value: 'INSTOCK' },
        { label: 'Low Stock', value: 'LOWSTOCK' },
        { label: 'Out of Stock', value: 'OUTOFSTOCK' }
    ];

    const dataTableFuncMap = {
        'products1': setProducts1,
        'products2': setProducts2,
        'products3': setProducts3,
        'products4': setProducts4
    };

    const productService = new ProductService();

    useEffect(() => {
        fetchProductData('products1');
        fetchProductData('products2');
        fetchProductData('products3');
        fetchProductData('products4');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        handleMy();
    }, []);

    const handleMy = async () => {
        try {
            
            
            const response = await http.post("/my");
            setMy(response.data);
            if (!response.data.status) {
                
            } else {
                
                dispatch(logout())
            }
            console.log("promesa 2", response.data);
        } catch (e) {
            console.log(e);
        }
    };

    const fetchProductData = (productStateKey) => {
        productService.getProductsSmall().then(data => dataTableFuncMap[`${productStateKey}`](data));
    }

    const isPositiveInteger = (val) => {
        let str = String(val);
        str = str.trim();
        if (!str) {
            return false;
        }
        str = str.replace(/^0+/, "") || "0";
        let n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 0;
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'INSTOCK':
                return 'In Stock';

            case 'LOWSTOCK':
                return 'Low Stock';

            case 'OUTOFSTOCK':
                return 'Out of Stock';

            default:
                return 'NA';
        }
    }

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case 'quantity':
            case 'price':
                if (isPositiveInteger(newValue))
                    rowData[field] = newValue;
                else
                    event.preventDefault();
                break;

            default:
                if (newValue.trim().length > 0)
                    rowData[field] = newValue;
                else
                    event.preventDefault();
                break;
        }
    }

    const onRowEditComplete1 = (e) => {
        let _products2 = [...products2];
        let { newData, index } = e;

        _products2[index] = newData;

        setProducts2(_products2);
    }

    const onRowEditComplete2 = (e) => {
        let _products3 = [...products3];
        let { newData, index } = e;

        _products3[index] = newData;

        setProducts3(_products3);
    }

    const onRowEditChange = (e) => {
        setEditingRows(e.data);
    }

    const setActiveRowIndex = (index) => {
        let _editingRows = { ...editingRows, ...{ [`${products3[index].id}`]: true } };
        setEditingRows(_editingRows);
    }

    const cellEditor = (options) => {
        if (options.field === 'price')
            return priceEditor(options);
        else
            return textEditor(options);
    }

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    const statusEditor = (options) => {
        return (
            <Dropdown value={options.value} options={statuses} optionLabel="label" optionValue="value"
                onChange={(e) => options.editorCallback(e.value)} placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <span className={`product-badge status-${option.value.toLowerCase()}`}>{option.label}</span>
                }} />
        );
    }

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />
    }

    const statusBodyTemplate = (rowData) => {
        return getStatusLabel(rowData.inventoryStatus);
    }

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    }

    return (
        <div className="datatable-editing-demo">
            <Toast ref={toast} />

            <div className="card p-fluid">
                <h5>Cell Editing</h5>
                <DataTable value={products1} editMode="cell" className="editable-cells-table" responsiveLayout="scroll">
                    {
                        columns.map(({ field, header }) => {
                            return <Column key={field} field={field} header={header} style={{ width: '25%' }} body={field === 'price' && priceBodyTemplate}
                                editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} />
                        })
                    }
                </DataTable>
            </div>
        </div>
    );
}

export default CreateDespacho;
