import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import React from 'react'

const InputComplete = (props) => {
   

    return (
        <Autocomplete
            restrictions={props.restrictions}
            onPlaceChanged={props.onPlaceChanged}
            onLoad={props.onLoad}
        >
            {/* Asegúrate de que este hijo sea un único elemento de entrada */}
          {props?.children}
        </Autocomplete>
    ) 

}

export default InputComplete
