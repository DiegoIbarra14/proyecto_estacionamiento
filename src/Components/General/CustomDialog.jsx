import { Dialog } from 'primereact/dialog'
import React from 'react'


const CustomDialog = ({header,footer,children,hide,visible,setVisible,style}) => {
  return (
   <Dialog modal visible={visible}  onHide={hide} header={header?header:""} footer={footer?footer:""} style={style}  resizable={false} >
    {children}
   </Dialog>
  )
}

export default CustomDialog
