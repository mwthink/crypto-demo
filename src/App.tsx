import * as React from 'react';
import { Button, Container, Row, Col, Table, Label } from 'reactstrap';
import { Form, FormGroup, Input } from 'reactstrap';
import KeyWizard from './ui/KeyWizard';
import ModalKeyImport from './ui/ModalKeyImport';
import ModalKeyViewer from './ui/ModalKeyViewer';
import ModalEncrypt from './ui/ModalEncrypt';
import ModalDecrypt from './ui/ModalDecrypt';
import * as openpgp from 'openpgp';

export interface AppProps {}

interface AppState {
  navSelection: string;
  active_keypair?: string;
  keys: {[fingerprint:string]:openpgp.Key};
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props:any){
    super(props);
    this.state = {
      navSelection: 'Key List',
      active_keypair: undefined,
      keys: {}
    }
  }

  /**
   * Imports a new key to the application state
   */
  importKey(key:openpgp.Key, active_keypair?:string){
    this.setState({
      active_keypair: active_keypair || this.state.active_keypair,
      keys: {
        ...this.state.keys,
        [key.getFingerprint()]: key
      }
    })
  }

  render(){
    // If keypair has not been setup, show user the setup wizard
    if(!this.state.active_keypair){
      return (
        <div>
          <strong>Welcome to first-time setup!</strong><br/>
          Let's get started by generating a new keypair for your identity.<br/><br/>
          <i>Notes: All key generation is happening on your computer. This app does not transmit or receive any data once loaded.</i>
          <br/><br/>
          <strong><i>This application is for demonstration purposes and should not be used for sensitive data</i></strong>
          <hr/>
          <KeyWizard onPrivateKey={private_key => {
            return openpgp.readKey({
              armoredKey: private_key,
            }).then(keypair => (
              this.setState({
                active_keypair: keypair.getFingerprint(),
                keys: {
                  ...this.state.keys,
                  [keypair.getFingerprint()]: keypair
                }
              })
            ))
          }}/>
        </div>
      )
    }

    // At this point, we have a valid key loaded and are ready to do stuff
    const userInfo = {
      name: this.state.keys[this.state.active_keypair].users[0].userID.name,
      email: this.state.keys[this.state.active_keypair].users[0].userID.email,
    };

    window['keypair'] = this.state.keys[this.state.active_keypair];

    const navItems = [
      'Info',
      'Key List',
      'Utilities',
    ]

    return (
      <div>
        <div>
          <strong>Hello {userInfo.name}!</strong><br/>
          Below is a list of all the keys you have access to. You can import new keys and then encrypt messages for them.
          {/* <ul>
            {navItems.map(nav => (
              <li key={nav}><a href="#" onClick={()=>this.setState({navSelection:nav})}>{nav}</a></li>
            ))}
          </ul> */}
        </div>
        <div>
          {this.renderPageContent()}
        </div>
      </div>
    )
  }

  renderPageContent(){
    switch(this.state.navSelection){
      case 'Info':
        return (
          <div>
            <strong>Key Fingerprint:</strong> {this.state.keys[this.state.active_keypair].getFingerprint()}
            <br/>
            <strong>Public Key:</strong>
            <pre>{this.state.keys[this.state.active_keypair].toPublic().armor()}</pre>
            <br/>
            <strong>Private Key:</strong>
            <pre>{this.state.keys[this.state.active_keypair].armor()}</pre>
          </div>
        )
      case 'Key List':
        return (
          <div>
            <Table hover bordered striped>
              <thead>
                <tr>
                  <th>Fingerprint</th>
                  <th>Private Key?</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(this.state.keys).map(fp => {
                  const k = this.state.keys[fp];
                  console.log({k})
                  // Construct the displayName as "name <email>"
                  const displayName = [
                    k.users[0].userID.name || k.users[0].userID.userID,
                    k.users[0].userID.email ? `<${k.users[0].userID.email}>` : '',
                  ].filter(Boolean).join(' ')
                  console.log({displayName})
                  
                  return (
                    <tr key={fp}>
                      <td>{fp}</td>
                      <td>{JSON.stringify(k.isPrivate())}</td>
                      <td>{displayName}</td>
                      <td>
                        <ModalKeyViewer key_armored={k.toPublic().armor()}/>
                        <ModalEncrypt key_armored={k.toPublic().armor()}/>
                        {/** Only show Decrypt button if we have the private key */}
                        {k.isPrivate() ? <ModalDecrypt key_armored={k.armor()}/> : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            <ModalKeyImport onImport={key => {
              this.importKey(key);
            }}/>
          </div>
        )
      default:
        return <div>Invalid page</div>
    }
  }
}

export default App;
