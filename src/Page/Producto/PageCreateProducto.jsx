import React from "react";
import Container from "../../Components/Container/Container";
import CreateProducto from "../../Components/Producto/CreateProducto";

export default function PageCreateProducto() {
  return (
    <>
      <Container url="getProductos/createProducto">
        <CreateProducto />
      </Container>
    </>
  );
}

