import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Input } from 'reactstrap';
import * as openpgp from 'openpgp';

export const ModalEncrypt: React.FunctionComponent<{key_armored:string}> = props => {
  const [ modal, setModal ] = React.useState(false);
  const [ input, setInput ] = React.useState('');
  const [ cipherText, setCipherText ] = React.useState('');
  const toggle = () => setModal(!modal);
  const closeModal = () => {
    setModal(false);
    setInput('');
    setCipherText('');
  }

  const doEncryption = async () => {
    const pubKey = await openpgp.readKey({armoredKey:props.key_armored});
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: input }),
      encryptionKeys: pubKey,
    })
    setCipherText(encrypted as string);
  }

  return (
    <div>
      <Button size="sm" onClick={toggle}>Encrypt</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Encrypt Message w/ Public Key</ModalHeader>
        <ModalBody>
          {/** If cipherText is calculated, show it, otherwise show input form */}
          { Boolean(cipherText) ? 
            <pre>{cipherText}</pre> : 
            <Input value={input} onChange={e=>setInput(e.target.value)} type="textarea" required placeholder='Input your message here...'/>
          }
        </ModalBody>
        <ModalFooter>
          { Boolean(cipherText) ? null : <Button color="primary" onClick={doEncryption}>Encrypt</Button> }
          <Button color="danger" onClick={closeModal}>{ Boolean(cipherText) ? 'Close' : 'Cancel' }</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ModalEncrypt;
