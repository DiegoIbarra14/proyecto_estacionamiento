import React from "react";
import Container from "../../Components/Container/Container";
import UpdatePedido from "../../Components/Pedido/UpdatePedido";
import { useParams } from "react-router-dom";
export default function PageUpdatePedido() {
  let params = useParams();
  return (
    <div>
      <Container url={`/updatePedido/${params.idPedido}`}>
        <UpdatePedido params={params} />
      </Container>
    </div>
  );
}
