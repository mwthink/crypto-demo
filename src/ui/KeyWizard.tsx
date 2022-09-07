import * as React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as openpgp from 'openpgp';

const firstNames = [
  'John',
  'Michael',
  'Jacob',
  'Matthew',
  'Joshua',
  'Sarah',
  'Emily',
  'Hannah',
  'Samantha',
  'Sarah',
];
const lastNames = [
  'Brown',
  'Smith',
  'Johnson',
  'Jones',
  'Miller',
  'Davis',
  'Garcia',
]

const generateName = () => [
  firstNames[Math.floor(Math.random()*firstNames.length)],
  lastNames[Math.floor(Math.random()*lastNames.length)]
].join(' ');

export interface KeyWizardProps {
  onPrivateKey: (key:string) => any
}

export const KeyWizard: React.FunctionComponent<KeyWizardProps> = props => {
  const [ name, setName ] = React.useState('');
  const [ email, setEmail ] = React.useState('');
  return (
    <Form onSubmit={async (e)=>{
      e.preventDefault();
      const formData = {name,email};
      const { privateKey } = await openpgp.generateKey({
        type: 'rsa',
        rsaBits: 2048,
        userIDs: [formData]
      })
      if(props.onPrivateKey){
        return props.onPrivateKey(privateKey);
      }
    }}>
      <FormGroup>
        <Label>Name</Label>
        <Input autoComplete='off' id="wizard-name" name="name" placeholder='' type='text' required value={name} onChange={e=>setName(e.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label>Email</Label>
        <Input autoComplete='off' id="wizard-email" name="email" placeholder='' type='email' value={email} onChange={e=>setEmail(e.target.value)}/>
      </FormGroup>
      <Button size="sm" onClick={()=>{
        const randomName = generateName();
        const nameSplit = randomName.split(' ');
        setName(randomName);
        setEmail([nameSplit[0][0].toLowerCase(),nameSplit[1].toLowerCase(),'@example.com'].join(''))
      }}>Fill Random Values</Button>
      <br/><br/>
      <Button type="submit" color="success">Generate My Identity</Button>
    </Form>
  )
}

export default KeyWizard;
