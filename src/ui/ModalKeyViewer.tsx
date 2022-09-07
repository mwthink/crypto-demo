import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export const ModalKeyViewer: React.FunctionComponent<{key_armored:string}> = props => {
  const [ modal, setModal ] = React.useState(false);
  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button size="sm" color="primary" onClick={toggle}>View Key</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Key Data</ModalHeader>
        <ModalBody>
          <pre>{props.key_armored}</pre>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Thing</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ModalKeyViewer;
