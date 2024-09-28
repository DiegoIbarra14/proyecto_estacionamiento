export const convertToFormData = (data) => {
    const formData = new FormData();
    const appendFormData = (key, value) => {
        if (Array.isArray(value)) {
            value.forEach((subValue, index) => {
                if (typeof subValue === 'object' && subValue !== null) {
                  appendFormData(`${key}[${index}]`, subValue);
                } else {
                  formData.append(`${key}[${index}]`, subValue);
                }
              });
        } else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
            Object.keys(value).forEach((subKey) => {
                appendFormData(`${key}[${subKey}]`, value[subKey]);
            });
        } else {
            formData.append(key, value);
        }
    }

    Object.keys(data).forEach((key) => {
        appendFormData(key, data[key]);
    });

    return formData
}