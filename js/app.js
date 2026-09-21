const formAnimal = document.getElementById("formAnimal");
const listaAnimais = document.getElementById("listaAnimais");

function textoCategoria(categoria) {

  const categorias = {
    lactacao: "Vaca em lactação",
    seca: "Vaca seca",
    novilha: "Novilha",
    bezerra: "Bezerra"
  };

  return categorias[categoria] || categoria;
}


async function atualizarTela() {

  const animais = await listarAnimais();

  document.getElementById("totalAnimais").textContent =
    animais.length;

  document.getElementById("contadorRebanho").textContent =
    animais.length;

  document.getElementById("totalLactacao").textContent =
    animais.filter(
      animal => animal.categoria === "lactacao"
    ).length;

  listaAnimais.innerHTML = "";

  if (animais.length === 0) {

    listaAnimais.innerHTML =
      "<p>Nenhum animal cadastrado.</p>";

    return;
  }

  animais.forEach(animal => {

    const elemento = document.createElement("div");

    elemento.className = "animal";

    elemento.innerHTML = `
      <strong>
        Brinco ${animal.brinco}
        ${animal.nome ? " — " + animal.nome : ""}
      </strong>

      <span>
        ${textoCategoria(animal.categoria)}
      </span>
    `;

    listaAnimais.appendChild(elemento);

  });
}


formAnimal.addEventListener("submit", async event => {

  event.preventDefault();

  const animal = {
    brinco:
      document.getElementById("brinco").value.trim(),

    nome:
      document.getElementById("nome").value.trim(),

    categoria:
      document.getElementById("categoria").value,

    criadoEm:
      new Date().toISOString()
  };

  try {

    await salvarAnimal(animal);

    formAnimal.reset();

    await atualizarTela();

    alert("Animal cadastrado.");

  } catch (erro) {

    if (erro.name === "ConstraintError") {

      alert("Este número de brinco já está cadastrado.");

    } else {

      console.error(erro);

      alert("Não foi possível salvar o animal.");
    }
  }

});


function atualizarRede() {

  const status = document.getElementById("statusRede");

  if (navigator.onLine) {

    status.textContent = "Online";

  } else {

    status.textContent = "Offline";
  }
}


window.addEventListener("online", atualizarRede);
window.addEventListener("offline", atualizarRede);

atualizarRede();
atualizarTela();


if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("sw.js")
      .catch(console.error);

  });

}
