import { useState, createContext, useEffect } from "react";
import { auth, db } from "../services/firebaseConnection";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

export default function AuthProvider({children}){
    
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth ] = useState(false)
    const [loading, setLoading ] = useState(true)

    
    useEffect(()=>{
        async function loadUser(){
            const storageUser = localStorage.getItem('@ticketsPRO');

            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }

            setLoading(false)
        }

        loadUser()

    },[])


    async function signIn(email, password){
        setLoadingAuth(true)
        await signInWithEmailAndPassword(auth, email, password)
        .then(async (value )=>{
            let uid = value.user.uid;

            const docRef = doc(db, 'users', uid)
            const docSnap = await getDoc(docRef)

            let data={
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl,
            }

            setUser(data)
            storageUser(data)
            setLoadingAuth(false)
            toast.success('Bem-Vindo de volta!')
            navigate('/dashboard')
            
        }).catch((err)=>{
            console.log('Erro')
            setLoadingAuth(false)
            toast.error('Ops! algo deu errado')
        })
    }

    async function signUp(email, password, name){
        setLoadingAuth(true);
        await createUserWithEmailAndPassword(auth, email, password)
        .then(async ( value )=>{
            let uid = value.user.uid

            await setDoc(doc(db, 'users', uid), {
                nome: name,
                avatarUrl: null,
            }).then(()=>{
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null,
                }
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                navigate('./dashboard');
                toast.success('Seja Bem vindo ao nosso sistema')

            })

        }).catch(erro=>{
            console.log(erro)
            setLoadingAuth(false)
        })
    }

    async function storageUser(data){
        localStorage.setItem('@ticketsPRO', JSON.stringify(data))
    }

    async function logout(){
        await signOut(auth);
        localStorage.removeItem('@ticketsPRO');
        setUser(null)
    }


    return(
        <AuthContext.Provider 
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                loadingAuth,
                loading,
                logout,
                storageUser,
                setUser

            }}
        >
            {children}
        </AuthContext.Provider>
    )
}