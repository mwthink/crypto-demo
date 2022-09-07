import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Input } from 'reactstrap';
import * as openpgp from 'openpgp';

export const ModalVerify: React.FunctionComponent<{key_armored:string}> = props => {
  const [ modal, setModal ] = React.useState(false);
  const [ input, setInput ] = React.useState('');
  const [ signedText, setSignedText ] = React.useState('');
  const toggle = () => setModal(!modal);
  const closeModal = () => {
    setModal(false);
    setInput('');
    setSignedText('');
  }

  const checkSignature = async () => {
    const pubKey = await openpgp.readKey({armoredKey:props.key_armored});
    const signedMessage = await openpgp.readCleartextMessage({
      cleartextMessage: input
    })
    const verificationResult = await openpgp.verify({
      message: signedMessage as any,
      verificationKeys: pubKey,
    })
    const isValid = await verificationResult.signatures[0].verified.catch(err=>false);
    setSignedText(`Valid signature: ${isValid ? 'yes' : 'no'}`);
  }

  return (
    <div>
      <Button size="sm" color="secondary" onClick={toggle}>Verify Signature</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Verify Message w/ Public Key</ModalHeader>
        <ModalBody>
          {/** If signedText is calculated, show it, otherwise show input form */}
          { Boolean(signedText) ? 
            <pre>{signedText}</pre> : 
            <Input value={input} onChange={e=>setInput(e.target.value)} type="textarea" required placeholder='-----BEGIN PGP SIGNED MESSAGE-----'/>
          }
        </ModalBody>
        <ModalFooter>
          { Boolean(signedText) ? null : <Button color="primary" onClick={checkSignature}>Verify Signature</Button> }
          <Button color="danger" onClick={closeModal}>{ Boolean(signedText) ? 'Close' : 'Cancel' }</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ModalVerify;
