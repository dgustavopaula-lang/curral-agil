const DB_NOME = "CurralAgilDB";
const DB_VERSAO = 1;
const STORE_ANIMAIS = "animais";

function abrirBanco() {

  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NOME, DB_VERSAO);

    request.onupgradeneeded = function(event) {

      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_ANIMAIS)) {

        const store = db.createObjectStore(
          STORE_ANIMAIS,
          {
            keyPath: "id",
            autoIncrement: true
          }
        );

        store.createIndex(
          "brinco",
          "brinco",
          { unique: true }
        );

        store.createIndex(
          "categoria",
          "categoria",
          { unique: false }
        );
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);

  });
}


async function salvarAnimal(animal) {

  const db = await abrirBanco();

  return new Promise((resolve, reject) => {

    const tx = db.transaction(
      STORE_ANIMAIS,
      "readwrite"
    );

    const store = tx.objectStore(STORE_ANIMAIS);

    const request = store.add(animal);

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);

  });
}


async function listarAnimais() {

  const db = await abrirBanco();

  return new Promise((resolve, reject) => {

    const tx = db.transaction(
      STORE_ANIMAIS,
      "readonly"
    );

    const store = tx.objectStore(STORE_ANIMAIS);

    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);

  });
}
