import React from 'react';
import CreatePedido from '../../Components/Pedido/CreatePedido';
import Container from '../../Components/Container/Container';
import { useParams } from "react-router-dom";

export default function PageCreatePedido() {
  return (
    <div>
      <Container url="getPedidos/createPedido">
        <CreatePedido />
      </ Container>
    </div>
  );
}
