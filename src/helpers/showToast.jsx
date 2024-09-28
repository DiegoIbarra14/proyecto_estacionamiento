export const showToast = (tipo, titulo, detalle,toast) => {
    toast.current.show({
        severity: tipo,
        summary: titulo,
        detail: detalle,
        life: 3000,
    });
};