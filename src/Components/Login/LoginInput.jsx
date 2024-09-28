import React from "react";
//import logo from "../../Imagenes/login_logo_1.png";
import logo from "../../Imagenes/logoPeru.jpg";
import { useState } from "react";
import logo_empresa from "../../Imagenes/sipro.svg"
import { InputText } from "primereact/inputtext";
import { Galleria } from 'primereact/galleria';

//import logo_2 from "../../Imagenes/login_logo_2.png";

import { Password } from "primereact/password";
import { Button } from "primereact/button";
import "./loginInput.css";
import "../../../node_modules/primeflex/primeflex.css"
import { cardContents } from "../../data/content-card-login";
function LoginInput(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };
  const itemTemplate = (item) => {
    return (
      <div className="galleria-item">
        <div className="slider-item-img">
          <img src={item?.img} alt={item?.title} style={{ width: '90%' }} />

        </div>

        <div className="galleria-content ">

          <p><span className="slider-title-item">{item?.title} </span>{item.description}</p>
          <p className="slider-item-subtitle">{item?.subDescription}</p>
        </div>
      </div>
    );
  };
  const responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 5,
    },
    {
      breakpoint: "768px",
      numVisible: 3,
    },
    {
      breakpoint: "560px",
      numVisible: 1,
    },
  ];

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      props.OnClickIngresar();
    }
  };

  return (
    <div className="contenedor-principal ">
      <div className="contenedor-slider">
        <div className="slider">
          <div >
            <Galleria value={cardContents} showThumbnails={false} showIndicators item={itemTemplate} responsiveOptions={responsiveOptions} autoPlay circular />
          </div>
        </div>




      </div>
      <div className="contenedor-login">
        <div className=" formulario  ">
          <div className="formulario formulario__login">
            <div className="logo-empresa">
              <img src={logo} alt="" />
            </div>
            <div className="contenedor-login-message flex flex-column align-items-center justify-content-center ">
              <div className="content-frase"><p>¡Hola,<span className="content-frase-second"> bienvenido!</span></p></div>
              <p className="frase">Ingresa su usuario y contraseña</p>
            </div>
            <div className="contenedor-login-container-inputs">
              <div className="flex flex-column gap-4">
                <div className="login-field flex flex-column  gap-1">
                  <label htmlFor="username">Usuario</label>
                  <InputText value={props.valueUsuario}
                    onChange={props.onChangeValueUsuario} id="username" placeholder="Nombre de usuario" onKeyDown={handleKeyPress}/>
                </div>
                <div className="login-field flex flex-column gap-1 ">
                  <label htmlFor="password">Contraseña</label>
                  <div className="" >
                    <Password toggleMask feedback={false} placeholder="Contraseña" className="content-input-password" value={props.valuePassword} onChange={props.onChangeValuePassword} onKeyDown={handleKeyPress} id="password" />
                  </div>

                </div>



              </div>
              <div className="flex justify-content-center flex-column  mt-3">
                <Button onClick={props.OnClickIngresar}
                  disabled={props.disabled} className="button-login flex flex-column ">{props.loading ? 'Loading...' : props.label}</Button>

              </div>

            </div>
            


          </div>

        </div>


      </div>

    </div>
  );
}

export default LoginInput;
