import { useRef, useState } from "react";
import contextProveedor from "./ProveedorContext"

const ProveedorProvider = ({ children }) => {
    const [tiposDocumentos, setTiposDocumentos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [fotoURL, setFotoURL] = useState('');
    const [fotoNewContactURL, setFotoNewContactURL] = useState('');
    let [counter, setCounter] = useState(0)
    const [proveedor, setProveedor] = useState({
        id: 0,
        tipo_documento: null,
        numero_documento: "",
        tipo_documento_id: null,
        razon_social: "",
        direccion: "",
        telefono: "",
        contactos: [],
        correo: "",
    });
    const [initialContactValues, setInitialValues] = useState({ contacto: "", telefono: "", correo: "", comentario: ""})

    const [visibleEditContact, setVisibleEditContact] = useState(false)
    const [visibleCreateContact, setVisibleCreateContact] = useState(false)
    const [initialProvedorValues, setProveedorValues] = useState({
        numero_documento: "",
        tipo_documento_id: "",
        razon_social: "",
        direccion: "",
    })
    //Opcion de operacion
    // 1==>Crear Contacto
    //2 ==> Editar Contacto
    const [optionOperation, setOptionOperation] = useState(1)
    const toast = useRef(null);
    const [checked, setChecked] = useState(null)
    const [contacto, setContacto] = useState(
        {
            contacto: "",
            telefono: "",
            correo: "",
            foto: "", 
            comentario:""
        }
    )
    const [initialProveedorValues, setInitialProveedorValues] = useState({ contacto: "", telefono: "", correo: "" })
    const [valueMaxDocumento, setValueMaxDocumento] = useState(0);
    return (
        <contextProveedor.Provider
            value={{
                tiposDocumentos, setTiposDocumentos, proveedores,
                setProveedores, counter, setCounter, proveedor, setProveedor,
                visibleCreateContact, setVisibleCreateContact, visibleEditContact, setVisibleEditContact, optionOperation
                , setOptionOperation, toast, checked, setChecked, contacto, setContacto, fotoURL, setFotoURL, fotoNewContactURL, setFotoNewContactURL,
                initialContactValues, setInitialValues,initialProvedorValues, setProveedorValues,valueMaxDocumento, setValueMaxDocumento
            }}>
            {children}

        </contextProveedor.Provider>

    )


}
export default ProveedorProvider