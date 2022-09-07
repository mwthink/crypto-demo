import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Input } from 'reactstrap';
import * as openpgp from 'openpgp';

export const ModalSign: React.FunctionComponent<{key_armored:string}> = props => {
  const [ modal, setModal ] = React.useState(false);
  const [ input, setInput ] = React.useState('');
  const [ signedText, setSignedText ] = React.useState('');
  const toggle = () => setModal(!modal);
  const closeModal = () => {
    setModal(false);
    setInput('');
    setSignedText('');
  }

  const doSignature = async () => {
    const privKey = await openpgp.readKey({armoredKey:props.key_armored});
    const signed = await openpgp.sign({
      message: await openpgp.createCleartextMessage({ text: input }),
      signingKeys: privKey as any,
    })
    setSignedText(signed as string);
  }

  return (
    <div>
      <Button size="sm" color="info" onClick={toggle}>Sign</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Sign Message w/ Private Key</ModalHeader>
        <ModalBody>
          {/** If signedText is calculated, show it, otherwise show input form */}
          { Boolean(signedText) ? 
            <pre>{signedText}</pre> : 
            <Input value={input} onChange={e=>setInput(e.target.value)} type="textarea" required placeholder='Input your message here...'/>
          }
        </ModalBody>
        <ModalFooter>
          { Boolean(signedText) ? null : <Button color="primary" onClick={doSignature}>Sign Data</Button> }
          <Button color="danger" onClick={closeModal}>{ Boolean(signedText) ? 'Close' : 'Cancel' }</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ModalSign;
