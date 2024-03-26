import { useState } from 'react';
import Header from '../../Components/Header'
import Title from '../../Components/Title'
import {FiUser} from 'react-icons/fi'

import { db } from '../../services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore';

import { toast } from 'react-toastify';

export default function Customers() {

    const [nome, setNome] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [endereço, setEndereço] = useState('')

    async function handleRegister(e){
        e.preventDefault();
        
        if(nome !== '' && cnpj !== '' && endereço !== ''){
            await addDoc(collection(db, 'customers'), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereço: endereço
            }).then(()=>{
                setNome('')
                setCnpj('')
                setEndereço('')
                toast.success('Empresa Registrada!')
            }).catch((err)=>{
                console.log(err)
                toast.error('Erro ao cadastrar')
            })
        }else{
            toast.error('Preencha Todos os campos')
        }

    }

 return (
   <div>
    <Header/>

    <div className='content'>
        <Title name='Clientes'>
            <FiUser size={25}/>
        </Title>
        <div className='container'>
            <form className='form-profile' onSubmit={handleRegister}>
                <label>Nome fantasia</label>
                <input type='text' 
                    placeholder='Nome da empresa'
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
                <label>CNPJ</label>
                <input type='text' 
                    placeholder='Digite seu CNPJ'
                    value={cnpj}
                    onChange={e => setCnpj(e.target.value)}
                />
                <label>Endereço</label>
                <input type='text' 
                    placeholder='Endereço da empresa'
                    value={endereço}
                    onChange={e => setEndereço(e.target.value)}
                />
                <button type='submit'>Salvar</button>
            </form>
        </div>
    </div>
   </div>
 );
}