import {useState, useEffect} from 'react'
import firebase from "firebase"
import "firebase/firestore"
import "firebase/storage"

let store
const coll = 'messages'

function useDB(room) {
    const [messages, setMessages] = useState([])

    function add(m) {
        setMessages(current => {
            const msgs = [m, ...current]
            msgs.sort((a,b)=> (b.date && b.date.seconds) - (a.date && a.date.seconds))
            return msgs
        })
    }
    function remove(id) {
        setMessages(current=> current.filter(m=> m.id!==id))
    }
    
    useEffect(() => {
        const collection = room ? 
            store.collection(coll).where('room','==',room) :
            store.collection(coll)
        
        collection.onSnapshot(snap=> snap.docChanges().forEach(c=> {
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [room])
    return messages
}

const db = {}
db.send = function(msg) {
    return store.collection(coll).add(msg)
}
db.delete = function(id) {
    return store.collection(coll).doc(id).delete()
}

export { db, useDB }

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCwGpAWR0lWdUql11qb2OQstyA_7u3xWsw",
    authDomain: "chatbd-94166.firebaseapp.com",
    projectId: "chatbd-94166",
    storageBucket: "chatbd-94166.appspot.com",
    messagingSenderId: "133102418355",
    appId: "1:133102418355:web:dc5ee8478f6a5818b5b3c6",
    measurementId: "G-ZEEDDL21Y1"
  };
  
firebase.initializeApp(firebaseConfig)
store = firebase.firestore()