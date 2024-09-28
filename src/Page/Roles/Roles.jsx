import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Accordion, AccordionTab } from 'primereact/accordion';

//Importación de componentes generales
import { asingRoleToUser, changePassword, createRole, deleteRole, deleteRoleToUser, getAllAccesos, getAllRoles, getAllWorker, getRolById, putRole, validateUserName } from '../../Services/RolService';
import { isEmpty } from '../../helpers/isEmptyStr';
import { showToast } from '../../helpers/showToast';
import Container from '../../Components/Container/Container';
import CustomDialog from "../../Components/General/CustomDialog"
import "./roles.css"

export default function PageRoles() {
  const toast = useRef(null)
  const [roles, setRoles] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [newRole, setNewRole] = useState({
    id: 0,
    nombre: '',
    accesos: [],
    Trabajador: '',
    tipo_rol: 2
  });
  const [message, setMessage] = useState([])
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [visibleUserDialog, setVisibleUserDialog] = useState(false)
  const [visibleDialogCredencials, setVisibleDialogCredencials] = useState(false)
  const [visibleDilogDeleteUser, setVisibleDialogDeleteuser] = useState(false)
  const [trabajadores, setTrabajadores] = useState([]);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);
  const [auxRol, setAuxRol] = useState();
  const [errorsTrabajador, setErrorsTrabajador] = useState({});
  const [users, setUsers] = useState([])
  const [loadingRol, setLoadingRol] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: ""
  })
  const [userRole, setUserRole] = useState({})
  const [areas, setAreas] = useState([
    'Lista de Producción',
    'Almacén de Mat. Primas',
    'Lista de Proveedores',
    'Lista de Máquinas',
    'Lista de Trabajadores',
    'Lista de Clientes',
    'Lista de Servicios',
    'Productos Registrados',
    'Almacén de Prod. Ter.',
    'Estadísticas',
    'Lista de Pedidos',
  ]);
  const [newPassword, setNewPassword] = useState({
    password: ""
  })

  const areaIcons = {
    'Lista de producción': 'pi pi-cog',
    'Mod. Reprocesamiento': 'pi pi-box',
    'Almacén de Mat. Primas': 'pi pi-box',
    'Lista de Proveedores': 'pi pi-box',
    'Lista de Máquinas': 'pi pi-cog',
    'Lista de Trabajadores': 'pi pi-users',
    'Lista de Clientes': 'pi pi-user',
    'Lista de Servicios': 'pi pi-briefcase',
    'Productos Registrados': 'pi pi-tags',
    'Almacén de Prod. Ter': 'pi pi-inbox',
    'Estadísticas': 'pi pi-chart-line',
    'Lista de Pedidos': 'pi pi-shopping-cart',
    'Gestión de roles': 'pi pi-user',
    'Dispositivos permitidos': 'pi pi-desktop'
  };

  const verificarTrabajador = () => {
    let errors = {}

    if (!selectedTrabajador) {
      errors.selectedTrabajador = 'Seleccione una opción'
    }
    if (selectedTrabajador?.user_id === null) {
      if (!user?.username) {
        errors.username = 'Ingrese o genere un nombre de usuario'
      }
      if (!user?.password) {
        errors.password = 'Ingrese o genere una contraseña'
      }
    }

    setErrorsTrabajador(errors);
    return errors;
  }

  //Validación del campo inexistente
  const isFormFieldValid = (name) => !!(errorsTrabajador[name]);

  //Muestra el mensaje de error bajo el input correspondiente
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="p-error">{errorsTrabajador[name]}</small>;
  };

  const verificarRequerimientos = (e, elemento) => {

    if (e?.target?.value ?? e) {
      // Crear una copia del objeto errors
      const newErrors = { ...errorsTrabajador };
      // Eliminar la propiedad nombre del objeto newErrors si existe
      delete newErrors[elemento];

      if (elemento.username) {
        delete newErrors['username'];
      }

      if (elemento.password) {
        delete newErrors['password'];
      }
      // Actualizar el estado de errors con el nuevo objeto sin la propiedad nombre
      setErrorsTrabajador(newErrors);
    }
  }

  const getAllTrabajadores = async () => {
    let response = await getAllWorker()
    let trabajadores = response?.data?.map((worker) => {
      return { ...worker, trabajador: `${worker?.nombres} ${worker?.apellidos}` }
    })
    setTrabajadores(trabajadores)
  };

  const tipo_accesos = {
    1: "All",
    2: "limited"
  }

  const openCreateDialog = () => {
    setNewRole({ id: 0, nombre: '', accesos: [], Trabajador: '', tipo_rol: 2 });
    setCreateDialogVisible(true);
  };

  const openEditDialog = (role) => {
    setCreateDialogVisible(true)
    let acc = role?.accesos?.map((acceso) => acceso?.id)
    setNewRole({ id: role?.id, nombre: role?.nombre, tipo_rol: role?.tipo_rol, accesos: acc })
  };

  const hideCreateDialog = () => {
    setCreateDialogVisible(false);
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="action-buttons">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => openEditDialog(rowData)} />
      </div>
    );
  };

  const actionTemplate1 = (rowData) => {
    return (
      <div className="action-buttons">
        <Button icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={() => handleClickDeleteRole(rowData)} />
      </div>
    );
  };
  const editTemplateUser = (rowData) => {
    return (
      <div className="action-buttons">
        <Button icon="pi pi-lock" className="p-button-rounded p-button-warning" onClick={() => { showDialogCredencials(rowData) }} />
      </div>
    );
  };

  const deleteTemplateUser = (rowData) => {
    return (
      <div className="action-buttons">
        <Button icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={() => openConfirmDialogRemoveUser(rowData)} />
      </div>
    );
  };

  const actionTemplate2 = (rowData) => {
    return (
      <div className="action-buttons">
        <Button icon="pi pi-users" className="p-button-rounded p-button-info" onClick={() => { showDialogUser(rowData) }} />
      </div>
    );
  };

  const showDialogUser = (rowData) => {
    setVisible1(true)
    setNewRole(rowData)
    getAllUsers(rowData?.id)
  }

  const handleAreaChange = (e, area) => {
    const selectedAreas = [...newRole.accesos];
    if (e.checked) {
      selectedAreas.push(area.id);
    } else {
      const index = selectedAreas.indexOf(area.id);
      selectedAreas.splice(index, 1);
    }
    setNewRole({ ...newRole, accesos: selectedAreas });
  };

  const handleSelectAllChange = (e) => {
    setAuxRol(newRole);
    if (e.checked) {
      setNewRole({ ...newRole, accesos: areas?.map(area => area.id) });
    } else {
      setNewRole({ ...newRole, accesos: [] });
    }
  };

  const getAccesos = () => {
    getAllAccesos()
      .then((response) => {
        console.log("acces", response?.data?.data)
        setAreas(response?.data?.data)
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  const showDialogCredencials = (rowData) => {
    setVisibleDialogCredencials(true)
    setUserRole(rowData)
    setMessage([])

  }

  const hideDialogCredencials = () => {
    setVisibleDialogCredencials(false)
    setNewPassword({ password: "" })
  }

  const handleClickCreateRole = async () => {
    try {
      setLoadingRol(true)
      validateNewRole()
      if (newRole?.id == 0) {
        await createRole(newRole)
        showToast("success", "Rol creado", "Se ha creado un nuevo rol correctamente", toast)
      } else {
        await putRole(newRole, newRole?.id)
        showToast("success", "Rol Actualizado", "Se ha actualizado el rol correctamente", toast)
      }
      await getAllRol()
      setCreateDialogVisible(false)
    } catch (error) {
      console.log("data", error)
      if (error?.response?.status) {
        showToast("error", "Error al crear rol", error?.response?.data?.error, toast)
      } else {
        showToast("error", "Error al crear rol", error?.message, toast)
      }
    }
    finally{
      setTimeout(() => {
        setLoadingRol(false);
      }, 5000);
    }
  }

  const validateNewRole = () => {
    if (newRole?.accesos?.length == 0) {
      throw new Error("El campo accesos no tiene asignado ninguna area")

    } else if (isEmpty(newRole?.nombre)) {
      throw new Error("El nombre de rol es requerido")
    }
  }

  const getAllRol = async () => {
    const response = await getAllRoles()
    if (response.data.length >= 0) {
      setRoles(response?.data)
    }
    else {
      setRoles([]);
    }
  }

  const getAllUsers = async (id) => {
    let response = await getRolById(id)
    setUsers(response?.users)
  }

  const templateFooteRolDialog = () => {

    return (<div className="p-field flex flex-block">
      <Button label="Guardar" disabled={loadingRol} icon="pi pi-check" className="p-button-success flex" style={{ width: '180px' }} onClick={handleClickCreateRole} />
    </div>)
  }

  const TemplateAccessColumn = (rowData) => {
    return (<>
      <p>{tipo_accesos?.[rowData?.tipo_rol] === 'limited' ? 'Limitado' : ''}</p>
    </>)
  }

  const handleClickDeleteRole = (rol) => {
    setVisibleDelete(true)
    setNewRole(rol)
  }

  const handleConfirmDelete = async (user) => {
    try {
      await deleteRole(newRole?.id)
      showToast("success", "Rol Eliminado", "Se ha eliminado el rol correctamente", toast)
      await getAllRol()
    } catch (error) {
      setRoles([]);
    }
  }

  const handleConfirmRemoveUser = async () => {
    try {
      await deleteRoleToUser(newRole?.id, userRole?.trabajador?.id)
      showToast("success", "Usuario removido ", "Se ha removido  el usuario correctamente", toast)
      getAllUsers(newRole?.id)
      getAllTrabajadores()
    } catch (error) {
      showToast("error", "Error al eliminar rol", error.message, toast)
    }
  }

  const openConfirmDialogRemoveUser = (rowData) => {
    setVisibleDialogDeleteuser(true)
    setUserRole(rowData)
  }

  const handleOpenDialogCreateUser = () => {
    setVisibleUserDialog(true)
  }

  const hideUserDialog = () => {
    setVisibleUserDialog(false)
    setUser({
      username: "",
      password: ""
    })
    setSelectedTrabajador(null)
  }


  const templateFooterDialogCreateUser = () => {
    return (<div className="form-container-buttons flex flex-block" style={{ marginTop: '10px' }}>
       <Button 
  label="Cerrar" 
  icon="pi pi-times" 
  className="p-button-danger mr-2" 
  style={{ width: '180px' }} 
  onClick={() => {
    setVisibleUserDialog(false); // Asegúrate de usar el estado correcto
  }} 
/>
      <Button label="Guardar" disabled={loadingRol} icon="pi pi-save" className="p-button-success mr-2" style={{ width: '180px' }}
        onClick={() => {
          let error = verificarTrabajador();
          if (Object.keys(error).length === 0) {
            handleSubmitUser()
          }
        }} />
       
    </div>)
  }

  const generateUser = () => {
    const specialChars = "@#$&";
    const nombre = selectedTrabajador?.nombres.toLowerCase().replace(/\s+/g, '');;
    const apellidos = selectedTrabajador?.apellidos.toUpperCase().replace(/\s+/g, '');
    const numeroDocumento = selectedTrabajador?.numero_documento.toString();

    let password = `${numeroDocumento}${nombre.charAt(Math.floor(Math.random() * nombre.length))}${apellidos}`;
    const specialChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    const randomIndex = Math.floor(Math.random() * (password.length + 1));
    password = password.slice(0, randomIndex) + specialChar + password.slice(randomIndex);

    let username = `${apellidos}`
    const randomIndexUser = Math.floor(Math.random() * (username.length + 1));
    username = username.slice(0, randomIndexUser) + numeroDocumento + username.slice(randomIndexUser);

    setUser({
      username: username,
      password: password
    })

    verificarRequerimientos(username, { username, password });
  }

  const handleChangeInputUser = (e) => {
    if (e.target) {
      let value = e.target.value
      setUser({
        ...user,
        [e.target.name]: value
      })
    }
    verificarRequerimientos(e, e.target.name)
  }

  const validatePassword = (password) => {
    const newMessage = [];

    // Al menos 8 caracteres
    if (password.length < 8) {
        newMessage.push({ id: 1, text: "Mínimo 8 caracteres." });
    }

    // Al menos una letra minúscula
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);

    if (!hasLowercase || !hasUppercase) {
        newMessage.push({ id: 2, text: "Combinar letras minúsculas y mayúsculas." });
    }

   

    // Al menos un número
    const hasNumber = /\d/.test(password);
    if (!hasNumber || !hasLowercase && !hasUppercase) {
        newMessage.push({ id: 4, text: "Al menos letras y números." });
    }

    // Al menos un carácter especial
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    if (!hasSpecialChar) {
        newMessage.push({ id: 5, text: "Incluir carácteres especiales." });
    }

    // Actualiza los mensajes
    setMessage(newMessage);

    // La contraseña es válida si no hay mensajes de error
    return newMessage.length === 0;
}
  const handleSubmitUser = async () => {
    try {
      await validateUser()
      showToast("success", "Usuario creado correctamente", "Se ha creado un nuevo usuario correctamente", toast)
      hideUserDialog()
    } catch (error) {
      showToast("error", "Error al crear usuario.", error.message, toast)
    }
  }

  const validateUser = async () => {
    setLoadingRol(true);
    if (selectedTrabajador?.user_id == null) {
      if (isEmpty(user?.password) || isEmpty(user?.username)) {
        throw new Error("Se requiere todos los campos completos")
      }
      const isValidate = !validatePassword(user?.password)
      if (isValidate) {
        throw new Error("La contraseña debe cumplir con el formato requerido")
      }
      let resp = await validateUserName({ username: user?.username })
      console.log("data", resp?.resp)
      if (resp?.resp) {
        throw new Error("El nombre de usuario ya existe")
      }

    }
    await asingRoleToUser(user, newRole?.id, selectedTrabajador?.id)
    await getAllRol()
    await getAllTrabajadores()
    await getAllUsers(newRole?.id)
    setTimeout(() => {
      setLoadingRol(false);
    }, 5000);
  }
  const handleChangeSelectedTrabajador = (e) => {
    setSelectedTrabajador(e.value)
    setUser({
      username: "",
      password: "",
    })
    verificarRequerimientos(e, 'selectedTrabajador')
  }

  const hideDialogListUsers = () => {
    setVisible1(false)
    setUsers([])
  }

  const rowTemplateNameWorker = (rowData) => {
    return (
      <>{`${rowData?.trabajador?.nombres} ${rowData?.trabajador?.apellidos}`}</>
    )
  }

  const templateHeaderChangeCredencials = () => {
    return (<div className=''>
      <h3> <i className='pi pi-user-edit' style={{ fontSize: "1.2em" }}></i> Editar Credenciales</h3>
    </div>)

  }

  const templateFooterChangeCredencials = () => {
    return (
      <>
        <Button label="Guardar" className='btn-change-password' icon="pi pi-save" onClick={handleClickUpdatePassword} />
      </>
    )
  }

  const handleChangeNewPassword = (e) => {
    const value = e.target.value;
    setNewPassword({ password: value });
    validatePassword(value);

}
  const handleClickUpdatePassword = async () => {
    try {
      let isvalidate = validatePassword(newPassword?.password)
      if (isvalidate) {
        let response = await changePassword(newPassword, userRole?.trabajador?.id)
        showToast("success", "La contraseña actualizada", "Se cambio la contraseña con exito", toast)
        setVisibleDialogCredencials(false)
        setNewPassword({ password: "" })
      } else {
        showToast("error", "Error al cambiar contraseña", "El password no cumple con el formato correcto", toast)
      }
    } catch (error) {
      showToast("error", "Error al cambiar contraseña", error?.message, toast)
    }
  }

  const formatValue = (value) => {
    if (value === null || value === '' || value === undefined) {
      return '---';
    }
    return value;
  };

  const handleCancelar = () => {
    setNewRole({ ...newRole, accesos: auxRol.accesos })
    setVisible(false)
  }
  const valueTemplate = (option) => {
    if (option) {
      return <span>{truncateText(option.trabajador, 20)}</span>;  // Limitar a 20 caracteres
    }
    return <span>Seleccionar Trabajador</span>;  // Placeholder si no hay selección
  };
  
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';  // Trunca el texto y añade '...'
    }
    return text;
  };
  const itemTemplate = (option) => {
    return (
      <span>{truncateText(option.trabajador, 25)}</span>  // Limitar a 20 caracteres
    );
  };
  const footerAccesos = (
    <div className={`flex w-full gap-3 justify-content-between align-items-center`}>
      <div className={`flex w-full`}>
        <Button
          type="button"
          label="Cancelar"
          className="w-full"
          style={{
            color: "#04638A",
            backgroundColor: "#fff",
            borderColor: "#04638A",
          }}
          onClick={handleCancelar}
        />
        <Button
          label={'Guardar'}
          className="w-full"
         
          style={{
            backgroundColor: "#04638A",
            color: "#fff",
            border: 'none'
          }}
          onClick={() => setVisible(false)}
        />
      </div>
    </div>
  )

  // Simulate fetching data
  useEffect(() => {
    getAllRol()
    getAccesos()
    getAllTrabajadores();
  }, []);

  return (
    <Container url="PageRoles">
      <Toast ref={toast} />
      <div className="p-container-header">
        <div className="p-container-titulo">
          <h1 style={{ color: '#04638A' }} className="container-titulo-table">Lista de Roles y usuarios</h1>
        </div>
        <div className="container-descripcion-materia">
          <div className="container-descripcion-table">
            <p>
              A continuación, se visualiza la lista de Roles y usuarios
            </p>
          </div>
          <div className="container-descripcion-button-add-excel">
            <button className="button button-crear align-items-center justify-content-center" style={{ display: 'flex' }} onClick={openCreateDialog}>
              <i className="pi pi-plus mr-2"></i>
              <p>Crear Rol</p>
            </button>
          </div>
        </div>
      </div>
      <div className="card" style={{ width: '100%' }}>
        <DataTable
          value={roles}
          paginator
          rows={rows}
          first={first}
          onPage={(e) => {
            setFirst(e.first);
            setRows(e.rows);
          }}
          style={{ width: '100%' }}
          emptyMessage="No se encontraron resultados."
        >
          <Column field="nombre" header="Rol" body={(rowData) => formatValue(rowData.nombre)}></Column>
          <Column body={TemplateAccessColumn} header="Áreas de Acceso"></Column>
          <Column body={actionTemplate2} header="Seleccionar Trabajador"></Column>
          <Column body={actionTemplate} header="Editar"></Column>
          <Column body={actionTemplate1} header="Eliminar"></Column>
        </DataTable>
      </div>

      {/* Dialog RolCreate y RolEdit*/}
      <Dialog visible={createDialogVisible}
        style={{ width: '450px' }}
        header="Crear Rol"
        modal className="p-fluid"
        onHide={hideCreateDialog}
        footer={templateFooteRolDialog}
        resizable={false}>
        <div className="p-field ">
          <label htmlFor="rol">Rol</label>
          <div className='flex'>
            <InputText id="rol" value={newRole?.nombre}
              onChange={(e) => setNewRole({ ...newRole, nombre: e.target.value })}
              style={{ height: "60px" }}
              maxLength={30} />
            <Button style={{ width: "150px", marginLeft: '5px', height: "60px" }}
              label='Accesos' onClick={() => { setVisible(true); setAuxRol(newRole) }} icon="pi pi-user-edit" />
          </div>

        </div>
      </Dialog>

      {/* Dialog Accesos */}
      <Dialog visible={visible}
        header='Áreas'
        className='lg:w-3 w-8'
        onHide={() => setVisible(false)}
        footer={footerAccesos}
        resizable={false}
        >
          
        <div className='card py-3'>
          <Accordion activeIndex={0}>
            <AccordionTab header="Accesos Web">
              <Checkbox name="areas"
                checked={newRole?.accesos?.length == areas?.length}
                onChange={(e) => handleSelectAllChange(e)} />
              <label style={{ marginLeft: '5px' }}>
                Seleccionar Todo
              </label>
              {areas?.map(area => (
                <div key={area?.id}
                  className="p-field-checkbox"
                  style={{ margin: '10px' }}>
                  <Checkbox inputId={area?.id}
                    name="areas"
                    value={area?.id}
                    checked={newRole?.accesos?.includes(area.id)}
                    onChange={(e) => handleAreaChange(e, area)} />
                  <label htmlFor={area?.nombre}
                    style={{ marginLeft: '5px' }}>
                    <i className={areaIcons?.[area.nombre]}
                      style={{ marginRight: '5px' }}></i>
                    {area?.nombre}
                  </label>
                </div>
              ))}
            </AccordionTab>
          </Accordion>
        </div>
      </Dialog>

      {/* Dialog ListaUsuarios */}
      <Dialog visible={visible1}
        onHide={hideDialogListUsers}
        header={<h1>Lista de Usuarios</h1>}
        resizable={false} 
        className="table-container"

>
          
        <div className="flex">
          <Button label="Asignar rol"
            className='p-button-success my-2'
            icon="pi pi-plus"
            onClick={handleOpenDialogCreateUser} />
        </div>
        <div className="card"  style={{ width: '100%' }}>
        <DataTable
          value={users}
          paginator
          rows={10}
          emptyMessage="No se encontraron resultados."
          rezisable={false}
          style={{ width: '100%' }}
          
          
        >
          <Column body={rowTemplateNameWorker} header="Trabajador"></Column>
          <Column field="username" header="Usuario"></Column>
          <Column header="Editar " body={editTemplateUser}></Column>
          <Column header="Remover" body={deleteTemplateUser}></Column>
        </DataTable>
        </div>
       
      </Dialog>

      {/* Dialog AsignarRol */}
      <Dialog 
  visible={visibleUserDialog}
  header="Asignar rol a usuario"
  modal 
  onHide={hideUserDialog}
  footer={templateFooterDialogCreateUser}
  resizable={false} 
  className="asignar-rol "
>
  <div className="flex flex-column gap-3 ">
    <div className="dropdown-container   ">
      
      {/* Contenedor para el Dropdown y el Botón */}
      <label htmlFor="trabajador">Trabajador</label>
      <Dropdown 
          name="selectedTrabajador"
          value={selectedTrabajador}
          onChange={handleChangeSelectedTrabajador}
          options={trabajadores}
          optionLabel="trabajador"
          placeholder="Seleccionar Trabajador"
          className={classNames({ 'p-invalid  ': isFormFieldValid('selectedTrabajador') })}
          filter
          valueTemplate={valueTemplate}
          emptyMessage="Personal no disponible"
          itemTemplate={itemTemplate}
        />

      
        
        {/* Botón con animación de aparición */}
        <Button 

          label="Generar Credenciales" 
          icon="pi pi-id-card" 
          onClick={generateUser} 
          disabled={false} 
        />

      {getFormErrorMessage('selectedTrabajador')}
    </div>
    <div>
  <div className="form-container flex flex justify-center" style={{ width: '100%' }}>
    <div className="p-field flex flex-column" style={{ width: '100%' }}>
      <label htmlFor="areas">Nombre de usuario</label>
      <InputText
        value={user?.username}
        name="username"
        style={{ width: '100%' }}
        className={classNames({ 'p-invalid ': isFormFieldValid('username') })}
        onChange={handleChangeInputUser}
        maxLength={20}
      />
      {getFormErrorMessage('username')}
    </div>

    <div className="p-field flex flex-column" style={{ width: '100%' }}>
      <label htmlFor="areas">Contraseña</label>
      <Password
        value={user?.password}
        toggleMask
        feedback={false}
        style={{ width: '100%' }}
        name="password"
        className={`input-password ${classNames({ 'p-invalid': isFormFieldValid('password') })}`}
        onChange={handleChangeInputUser}
        maxLength={25}
      />
      {getFormErrorMessage('password')}
    </div>
  </div>
</div>

     
   
  </div>
</Dialog>

      <ConfirmDialog
        visible={visibleDelete}
        onHide={() => {
          setVisibleDelete(false);
        }}
className="custom-dialog"
        message={`Esta seguro de eliminar el rol`}
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Sí"
        accept={handleConfirmDelete}
        reject={() => {
          setVisibleDelete(false);
          
        }}
        resizable={false}

      />
      <ConfirmDialog
      className="custom-dialog"
        visible={visibleDilogDeleteUser}
        onHide={() => {
          setVisibleDialogDeleteuser(false);
        }}
        message={`Esta seguro de remover el rol al usuario`}
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Sí"
        accept={handleConfirmRemoveUser}
        reject={() => {
          setVisibleDelete(false);
        }}
        resizable={false}
      />
      <CustomDialog visible={visibleDialogCredencials}
        hide={hideDialogCredencials}
        header={templateHeaderChangeCredencials}
        footer={templateFooterChangeCredencials}
        resizable={false}

      >
        <div className="form-edit-password ">
          <div className="form-edit-password__field  gap-2">
            <label htmlFor="">Nueva contraseña</label>
            <Password value={newPassword?.password}
              toggleMask feedback={false}
              style={{ width: "100%" }}
              name='password'
              className='input-password'
              onChange={handleChangeNewPassword}
              maxLength={25} />
                <ul className="text-xs font-mono">
                {message.map((msg) => (
                    <li key={msg.id} style={{ color: 'red' }}>{msg.text}</li>
                ))}
            </ul>

          </div>
        </div>
      </CustomDialog>
    </Container>
  );
}