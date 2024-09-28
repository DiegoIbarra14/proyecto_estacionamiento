import React from 'react';
import CreateDespacho from '../../Components/Pedido/CreateDespacho';
import Container from '../../Components/Container/Container';

function PageCreateDespacho() {
  return (
    <div>
      <Container url="createDespacho">
        <CreateDespacho />
      </ Container>
    </div>
  );
}

export default PageCreateDespacho;
