import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Input, Label } from 'reactstrap';
import * as openpgp from 'openpgp';

const calculateHash = async (input:string): Promise<string> => {
  const algo = 'SHA-256';
  const msgUint8 = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2,'0')).join('');
  return hashHex;
}

export const ModalEncrypt: React.FunctionComponent<{}> = props => {
  const [ modal, setModal ] = React.useState(false);
  const [ input, setInput ] = React.useState('');
  const [ hash, setHash ] = React.useState('');
  const toggle = () => setModal(!modal);
  const closeModal = () => {
    setModal(false);
    setInput('');
  }

  const calculateInputHash = async (value:string) => {
    setInput(value);
    setHash(await calculateHash(value))
  }

  return (
    <div>
      <Button size="sm" color="primary" onClick={toggle}>Hash Utility</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Calculate SHA256 Hash</ModalHeader>
        <ModalBody>
          <Label>Input</Label>
          <Input value={input} onChange={e=>calculateInputHash(e.target.value)} type="textarea" required placeholder='Type here...'/>
          <Label>Value</Label>
          <Input value={hash} type="textarea" readOnly/>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={closeModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ModalEncrypt;
