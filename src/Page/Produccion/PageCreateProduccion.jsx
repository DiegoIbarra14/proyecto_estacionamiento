import React from "react";
import CreateProduccion from "../../Components/Produccion/CreateProduccion";
import Container from "../../Components/Container/Container";

export default function PageCreateProduccion() {
  return (
    <Container url="getProducciones/createProduccion">
      
      <CreateProduccion />
    </Container>
  );
}

