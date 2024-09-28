import React from "react";
import Container from "../../Components/Container/Container";
import UpdateProducto from "../../Components/Producto/UpdateProducto";
import { useParams } from "react-router-dom";
export default function PageUpdateProducto() {
  let params = useParams();
  return (
    <div>
      <Container url={`getProductos/updateProducto/${params.idProducto}`}>
        <UpdateProducto params={params} />
      </Container>
    </div>
  );
}
