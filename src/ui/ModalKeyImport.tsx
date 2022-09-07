import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Input } from 'reactstrap';
import * as openpgp from 'openpgp';

export const ModalKeyImport: React.FunctionComponent<{onImport:(key:openpgp.Key)=>any}> = props => {
  const [ modal, setModal ] = React.useState(false);
  const [ input, setInput ] = React.useState('');
  const toggle = () => setModal(!modal);
  const doImport = async () => {
    const importedKey = await openpgp.readKey({
      armoredKey: input
    });
    console.log(importedKey);
    props.onImport(importedKey);
    setModal(false);
    setInput('');
  }

  return (
    <div>
      <Button size="sm" onClick={toggle}>Import New Key</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Key Data</ModalHeader>
        <ModalBody>
          <Input value={input} onChange={e=>setInput(e.target.value)} type="textarea" required placeholder='-----BEGIN PGP . . .'/>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={doImport}>Import</Button>
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ModalKeyImport;
