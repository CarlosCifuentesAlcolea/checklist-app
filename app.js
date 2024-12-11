// Importar Firebase y Firestore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBrn3b965fOhrzFFQg08Cl7MRJ9DEaqQQI",
  authDomain: "lista-de-la-compra-22435.firebaseapp.com",
  projectId: "lista-de-la-compra-22435",
  storageBucket: "lista-de-la-compra-22435.firebasestorage.app",
  messagingSenderId: "208557060957",
  appId: "1:208557060957:web:4940787efd521ece3e6eb4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencia a la colección "items"
const itemsRef = collection(db, 'items');

// Función para agregar un item a Firestore
const addItem = async (itemName) => {
  try {
    const docRef = await addDoc(itemsRef, {
      item: itemName, // El campo "item" en la colección Firestore
      createdAt: serverTimestamp(), // Marca de tiempo
    });
  } catch (e) {
    console.error("Error al agregar el item: ", e);
  }
};

// Función para eliminar un item
const deleteItem = async (id) => {
  const itemDoc = doc(db, 'items', id);
  await deleteDoc(itemDoc);
  displayItems(); // Refresca la lista después de eliminar el item
};

// Mostrar los items desde Firestore
const displayItems = async () => {
  const snapshot = await getDocs(itemsRef);
  const itemsList = document.getElementById('items-list');
  itemsList.innerHTML = ''; // Limpiar la lista antes de agregar los nuevos items

  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement('li');
    li.textContent = data.item; // Mostrar el campo "item"

    // Crear el botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => {
      deleteItem(doc.id); // Eliminar el item y refrescar la lista
    });

    // Añadir el botón a la lista
    li.appendChild(deleteButton);
    itemsList.appendChild(li);
  });
};

// Manejar el evento de envío del formulario
document.getElementById('item-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const itemInput = document.getElementById('item-input');
  addItem(itemInput.value); // Agregar el item a Firestore
  itemInput.value = ''; // Limpiar el campo de entrada
  displayItems(); // Mostrar la lista actualizada
});

// Llamar a la función para mostrar los items cuando la página se cargue
window.onload = displayItems;
