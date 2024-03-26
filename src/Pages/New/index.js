import { useState, useEffect, useContext } from 'react';
import './new.css'
import Header from '../../Components/Header';
import Title from '../../Components/Title';
import {FiPlusCircle} from 'react-icons/fi'

import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const listRef = collection(db, 'customers')

export default function New() {

    const navigate = useNavigate()

    const { user } = useContext(AuthContext)
    const {id} = useParams()

    const [customers, setCustomers] = useState([])
    const [loadCustomer, setLoadCustomer] = useState(true)
    
    const [customerSelected, setCustomerSelected] = useState(0)
    
    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')
    const [idCustomer, setIdCustomer] = useState(false)


    useEffect(()=>{
        async function loadCustomers(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot)=>{
                let lista = []
                snapshot.forEach(doc =>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia,
                    })
                })
                
                if(snapshot.docs.size === 0){
                    toast.error("Nenhuma empresa encontrada")
                    setCustomers([{id: '1', nomeFantasia: 'Freela'}])
                    setLoadCustomer(false)
                    return
                }
            
                setCustomers(lista)
                setLoadCustomer(false)

                if(id){
                    loadId(lista)
                }

            })
            .catch((err)=>{
                console.log('Erro ao buscar os clintes', err)
                setLoadCustomer(false)
                setCustomers([{id: '1', nomeFantasia: 'Freela'}])
            })
        }

        loadCustomers()
    },[id])

    async function loadId(lista){
        const docRef = doc(db, 'chamados', id);
        await getDoc(docRef)
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index)
            setIdCustomer(true)

        }).catch((err)=>{
            console.log(err)
            setIdCustomer(false)
        })

    }


    function handleOptionChange(e){
        setStatus(e.target.value)
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value)
    }

    function handleChangeCustomer(e){
        setCustomerSelected(e.target.value)
    }

    async function handeRegister(e){
        e.preventDefault()

        if(idCustomer){
            const docRef = doc(db, 'chamados', id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid
            })
            .then(()=>{
                toast.info('Atualizado com sucesso')
                setCustomerSelected(0)
                setComplemento('');
                navigate('/dashboard')
            }).catch(()=>{
                toast.error('Ops... Erro ao atualizar')
            })


            return
        }

        await addDoc(collection(db, 'chamados'), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        }).then(()=>{
            toast.success('Chamado registrado')
            setComplemento('')
            setCustomerSelected(0)
        }).catch(err => {
            toast.error('Algo de errado não está certo')
        })
        // if(){}
    }


 return (
   <div>
    <Header/>
    <div className='content'>
        <Title name={id ? 'Editando chamado' : 'Novo chamado'}>
            <FiPlusCircle size={25}/>
        </Title>

        <div className='container'>
            <form className='form-profile' onSubmit={handeRegister}>
                <label>Clientes</label>



                {
                    loadCustomer ? (
                        <input type='text' disabled={true} value='Carregando' />
                    ) : (
                        <select value={customerSelected} onChange={handleChangeCustomer}>
                            {customers.map((item, index)=>{
                                return(
                                    <option key={index} value={index}>{item.nomeFantasia}</option>
                                )
                            })}
                        </select>
                    )
                }



                <label>Assunto</label>
                <select value={assunto} onChange={handleChangeSelect}>
                    <option value='Suporte'>Suporte</option>
                    <option value='Visita tecnica'>Visita tecnica</option>
                    <option value='Financeiro'>Financeiro</option>
                </select>
                <label>Status</label>
                <div className='status'>
                    <input 
                        type='radio' 
                        name='radio' 
                        value='Aberto'
                        onChange={handleOptionChange}
                        checked={status === 'Aberto'}
                    />
                    <span>Em aberto</span>

                    <input 
                        type='radio' 
                        name='radio'
                        value='Progresso'
                        onChange={handleOptionChange}
                        checked={status === 'Progresso'}
                    />
                    <span>Em Progresso</span>

                    <input 
                        type='radio' 
                        name='radio' 
                        value='Atendido'
                        onChange={handleOptionChange}
                        checked={status === 'Atendido'}
                    />
                    <span>Atendido</span>
                </div>

                <label>Complemento</label>
                <textarea type='text' placeholder='Descreva seu problema (Opcional)' value={complemento} onChange={e => setComplemento(e.target.value)}/>
                <button type='submit'>Registrar</button>

            </form>
        </div>
    </div>
   </div>
 );
}