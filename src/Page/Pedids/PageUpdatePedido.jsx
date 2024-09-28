import React from "react";
import Container from "../../Components/Container/Container";
import UpdatePedido from "../../Components/Pedido/UpdatePedido";
import { useParams } from "react-router-dom";
function PageUpdatePedido() {
  let params = useParams();
  return (
    <div>
      <Container url={`getPedidos/updatePedido/${params.idPedido}`}>
        <UpdatePedido params={params} />
      </Container>
    </div>
  );
}

export default PageUpdatePedido;
