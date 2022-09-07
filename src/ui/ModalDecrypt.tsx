import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Input } from 'reactstrap';
import * as openpgp from 'openpgp';

export const ModalDecrypt: React.FunctionComponent<{key_armored:string}> = props => {
  const [ modal, setModal ] = React.useState(false);
  const [ input, setInput ] = React.useState('');
  const [ cipherText, setCipherText ] = React.useState('');
  const toggle = () => setModal(!modal);
  const closeModal = () => {
    setModal(false);
    setInput('');
    setCipherText('');
  }

  const doDeCryption = async () => {
    const privKey = await openpgp.readKey({armoredKey:props.key_armored});
    const plainText = await openpgp.decrypt({
      message: await openpgp.readMessage({armoredMessage:input}),
      decryptionKeys: privKey as any
    })
    setCipherText(plainText.data.toString());
  }

  return (
    <div>
      <Button size="sm" color="warning" onClick={toggle}>Decrypt</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Decrypt Message w/ Private Key</ModalHeader>
        <ModalBody>
          {/** If cipherText is calculated, show it, otherwise show input form */}
          { Boolean(cipherText) ? 
            <pre>{cipherText}</pre> : 
            <Input value={input} onChange={e=>setInput(e.target.value)} type="textarea" required placeholder='Input your message here...'/>
          }
        </ModalBody>
        <ModalFooter>
          { Boolean(cipherText) ? null : <Button color="primary" onClick={doDeCryption}>Decrypt</Button> }
          <Button color="danger" onClick={closeModal}>{ Boolean(cipherText) ? 'Close' : 'Cancel' }</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ModalDecrypt;
