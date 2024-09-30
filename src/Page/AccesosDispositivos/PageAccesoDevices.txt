import React, { useEffect, useRef, useState } from 'react'
import Container from '../../Components/Container/Container'
import ListProduccion from '../../Components/Produccion/ListProduccion'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import CustomDialog from '../../Components/General/CustomDialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { showToast } from '../../helpers/showToast'
import { isEmpty } from '../../helpers/isEmptyStr'
import { ConfirmDialog } from 'primereact/confirmdialog'


const PageAccesoDevices = () => {
    const data = [{ id:1,tipo_dispositivo: "PC", direccion_mac: "1212121212121", responsable: "Pedrito Mamani Quispe" }]
    const id=1
    const [visible, setVisible] = useState(false)
    const [tipoDevice, setTypeDevice] = useState("")
    const [direccionMAC, setDirectionMAC] = useState("")
    const [responsable, setResponsable] = useState("")
    const [acceso, setAcceso] = useState({
        id:0,
        responsable: "",
        tipo_dispositivo: "",
        direccion_mac: "",

    })
    const [visibleDelete, setVisibleDelete] = useState(false)
    const [accesos, setAccesos] = useState([])
    const toast = useRef(null)
    const hideDialog = () => {
        setVisible(false)
        cleanInputs()
    }
    const showDialog = () => {
       
        setVisible(true)
    }
    const optionsTypeDevices = [
        { label: "hola", code: 1 },
        { label: "hola2", code: 2 }
    ]
    const optionsWorkers = [
        { label: "Juancito Mamani", code: 1 },
        { label: "Pedrito Mamani", code: 2 }
    ]
    const handleChangeInput = (e, name, options = false) => {
        console.log("dat", e)
        let input = e
        if (options) {
            setAcceso({ ...acceso, [name]: input.value.code })

        } else {
            setAcceso({ ...acceso, [name]: input.value })
        }



    }
    const acctionTemplateBodyOperaciones = (rowData) => {
        return (<>
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger "
                onClick={()=>{setVisibleDelete(true);setAcceso(rowData)}}
            />
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning ml-1"
                onClick={() => { handleClickEditDevice(rowData) }}
            />
        </>)
    }
    const templateFooter = () => {
        return (
            <Button
                icon="pi pi-plus "
                className=" ml-1"
                label='Asignar'
                style={{ backgroundColor: "rgb(4,99,138)", borderColor: "rgb(4,99,138)" }}
                onClick={handleSubmitAddDevice}
            />
        )
    }
    const templateHeader = () => {
        return (
            <>
                <h2 style={{ color: "rgb(55,55,55)" }}>Asignar acceso a equipo</h2>
            </>

        )
    }
    const handleSubmitAddDevice = () => {
        if (!acceso?.tipo_dispositivo) {
            showToast("error", "Error en validación", "El tipo de dispositivo es requerido", toast)
        } else if (isEmpty(acceso.direccion_mac)) {
            showToast("error", "Error en validación", "La dirección MAC es requerida", toast)
        } else if (!acceso?.responsable) {
            showToast("error", "Error en validación", "El responsable es requerido", toast)
        } else {
            if(acceso?.id !==0){
                handleEditDevice(acceso)
            }else{
                AddDevice()
            }
           

        }
    }
    const AddDevice = () => {
        setAccesos([...accesos, {"id":id+1,direccion_mac:acceso?.direccion_mac,responsable:acceso?.responsable,tipo_dispositivo:acceso?.tipo_dispositivo}])
        cleanInputs()
        hideDialog()
        console.log("data", acceso)
    }
    const cleanInputs = () => {
        setAcceso({
            id:0,
            responsable: "",
            tipo_dispositivo: "",
            direccion_mac: "",
        })
    }
    const ConvertOptionInValue = (options, value) => {
        console.log("value", value);
        let index = options?.findIndex((option) => option.code === value);
        console.log("index", index, options);
        return index;
    }
    const handleClickEditDevice = (rowData) => {
        
        setAcceso(rowData)
        console.log("row",acceso)
        
        showDialog()
    }
    const reject = () => {
        setVisibleDelete(false)
    };

    const assept=()=>{
        handleDeleteDevice(acceso)
    }
    const handleDeleteDevice=(device)=>{
       let filterAccesos= accesos.filter(acceso=>acceso?.id !== device?.id)
       setAccesos(filterAccesos)
       showToast("success","Eliminado Correctamente","El dispositivo fue eliminado correctamente",toast)
    }
    const handleEditDevice=(device)=>{
        let indexDevice=accesos?.findIndex((_acceso)=>_acceso.id ==device?.id)
        let allDevices=accesos
        if(indexDevice!== -1){
            allDevices[indexDevice]=device
        }
        setAccesos(allDevices)
        showToast("success","Dispositivo actualizado","Se actualizo el dispositivo correctament",toast)
        hideDialog()
        cleanInputs()
    }

    useEffect(() => {
        setAccesos(data)
    }, [])


    return (
        <Container url="dispositivos">
            <h1>Lista de Equipos con Acceso</h1>
            <p>A continuación, se visualiza todos los equipos que tienen acceso al sistema SIPROSOFT</p>
            <div className="container-button flex py-3">
                <Button label='Crear acceso' icon="pi pi-plus" className='p-button-success' onClick={showDialog} />
            </div>
            <ListProduccion
                data={accesos}
            >
                <Column field='tipo_dispositivo' header="Tipo de Equipo" />
                <Column field='direccion_mac' header="MAC" />
                <Column field='responsable' header="Responsable" />
                <Column header="Acciones"
                    body={acctionTemplateBodyOperaciones}
                    style={{ minWidth: '8rem' }} />
            </ListProduccion>
            <Toast ref={toast} />
            <CustomDialog visible={visible} setVisible={setVisible} header={templateHeader} footer={templateFooter} hide={hideDialog} style={{ width: '30vw' }} >
                <div className="container-form flex flex-column gap-3">
                    <div className="field-input flex flex-column gap-2">
                        <label htmlFor="">
                            Tipo de Equipo
                        </label>
                        <Dropdown value={optionsTypeDevices[ConvertOptionInValue(optionsTypeDevices, acceso?.tipo_dispositivo)]}
                            name='tipo_dispositivo' options={optionsTypeDevices}
                            onChange={(e) => { handleChangeInput(e.target, "tipo_dispositivo", true) }} />

                    </div>
                    <div className="field-inpunt flex flex-column gap-2">
                        <label htmlFor="">
                            Dirección MAC
                        </label>
                        <InputText value={acceso?.direccion_mac} name='direccion_mac'
                            onChange={(e) => { handleChangeInput(e.target, "direccion_mac") }} />

                    </div>
                    <div className="field-inpunt flex flex-column">
                        <label htmlFor="">
                            Responsable
                        </label>
                        <Dropdown value={optionsWorkers[ConvertOptionInValue(optionsWorkers, acceso?.responsable)]}
                            name='responsable' options={optionsWorkers} onChange={(e) => { handleChangeInput(e.target, "responsable", true) }} />
                    </div>

                </div>

            </CustomDialog>
            <ConfirmDialog
                visible={visibleDelete}
                onHide={() => {
                    setVisibleDelete(false);
                }}
                message={`Esta seguro de cerrar sesión`}
                header="Confirmación"
                icon="pi pi-exclamation-triangle"
                acceptLabel="Sí"
                accept={assept}
                reject={reject}
            />


        </Container>
    )
}

export default PageAccesoDevices
