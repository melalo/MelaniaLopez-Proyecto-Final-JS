// ConstantesbtnComprar
const btnLogin = document.querySelector("#btn-login"),
  formLogin = document.querySelector("#form-login"),
  errorLogin = document.querySelector("#error"),
  inputUser = document.querySelector("#user"),
  inputPass = document.querySelector("#pass"),
  inputCheck = document.querySelector("#check"),
  btnSearch = document.querySelector("#btnSearch"),
  errorSearch = document.querySelector("#errorSearch"),
  cartWrapper = document.querySelector(".cart-wrapper"),
  btnComprar = document.querySelector("#comprar"),
  comprarAhora = document.querySelector(".comprar-ahora"),
  shoppingCart = document.querySelector("#shoppingCart"),
  sumaTotal = document.querySelector("#sumaTotal"),
  carritoIcon = document.querySelector(".carrito-icon"),
  productosWrapper = document.querySelector("#productos-wrapper"),
  mensajeCargando = document.querySelector(".mensajeCargando");

// Variables
let usuarioGuardado = "Mela";
let passGuardado = "123";
let botonAgregar = [];
let closeBtn = [];
let carrito = [];
let usuarioLS = JSON.parse(localStorage.getItem("item"));
let cantidad = 0;
let productos = [];
let confirmacion = true;
let logueado = false;

//local storage
if (usuarioLS != null) {
  inputUser.value = usuarioLS.usuario;
  inputPass.value = usuarioLS.password;
}

// Funciones
const validar = function (usuario, password) {
  //console.log(formLogin);
  if (usuarioGuardado === usuario && password === passGuardado) {
    logueado = true;
    bienvenida.innerHTML = `<h2 class="mb-4">Bienvenido a Rainforest Lab ${inputUser.value}</h2>
    <div class="row">
    <div class="col-8"><h3>Elige los productos que deseas comprar:</h3></div>
    <div class="col-4 d-flex justify-content-center "> 
        <label for="filtrar-por-precio"> 
            <span class="pe-2"><strong>Organizar por</strong></span>
        <select name="filtrar" id="ordenar-productos" class="dropDowmnSelect">
          <option value="ordenDefault">Sin filtro</option>    
          <option value="menorAmayor" >Precio mas bajo</option>
            <option value="mayorAmenor" >Precio mas alto</option>
            <option value="propiedad" >Propiedad</option>
          </select>
        </label>
    </div>
    <hr>`;
    //filtroShow.classList.remove("d-none");
    if (inputCheck.checked) {
      guardar("localStorage");
    } else {
      guardar("sessionStorage");
    }
    formLogin.classList.add("d-none");
  } else {
    errorLogin.innerHTML =
      "El usuario o contrasena esta incorrecto favor intentar de nuevo.";
  }
  let selectOrder = document.querySelector("#ordenar-productos");
  selectOrder.addEventListener("change", (e) => {
    sortProductos(selectOrder.value);
    console.log(selectOrder.value);
  });
};

function guardar(valor) {
  let user = { usuario: inputUser.value, password: inputPass.value };
  if (user.usuario === "" || user.password === "") {
    error.innerHTML = "Todos los campos son requeridos";
  } else {
    valor === "sessionStorage" &&
      sessionStorage.setItem("item", JSON.stringify(user));
    valor === "localStorage" &&
      localStorage.setItem("item", JSON.stringify(user));
  }
  return user;
}

// Limpia los inputs
function limpiar() {
  inputIngreso.value = "";
  errorSearch.innerHTML = "";
}

// Carga los productos desde un JSON
setTimeout(() => {
  fetch("./js/productos.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      cargarCards(productos);
      botonAgregar = document.querySelectorAll(".boton-agregar");
      mensajeCargando.style.display = "none";
    });
}, 2500);

// Genera HTML para todos los productos
function cargarCards(productos) {
  productos.forEach((card) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<img src=" ./img/${card.img}" alt="${card.nombre}">
      <h3 class="pt-2 mb-0">${card.nombre}</h3>
      <p class="propiedad"><strong> ${card.propiedad} </strong></p>
      <p><strong>Precio:</strong> $${card.precio} </p>
      <div class="card-footer d-flex align-items-center">
        <div class="card-action">
          <button class="boton-agregar btn btn-secondary btn-sm" id="${card.id}">Agregar</button>
        </div>
        <div class="cantidad ms-3">
          <span class="ps-4 pe-1">Cantidad</span>
          <select name="cantidad" id="selectCantidad${card.id}">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>`;
    productosWrapper.append(div);
  });
  actualizarBotones();
  //console.log(botonAgregar);
}

//filtro de ordenar por precio
function sortProductos(sortOrder) {
  let arraySorted;
  /*   let productosParaSort = productos;
   */ console.log(productos);
  //filtros de ordenar los productos
  if (sortOrder == "menorAmayor") {
    arraySorted = productos.sort((a, b) => a.precio - b.precio);
  }
  if (sortOrder == "mayorAmenor") {
    arraySorted = productos.sort((a, b) => b.precio - a.precio);
  }
  if (sortOrder == "ordenDefault") {
    arraySorted = productos.sort((a, b) => a.id - b.id);
  }
  if (sortOrder == "propiedad") {
    arraySorted = productos.sort((a, b) => {
      if (a.propiedad < b.propiedad) {
        return -1;
      }
      if (a.propiedad > b.propiedad) {
        return 1;
      }
      return 0;
    });
  }
  productosWrapper.innerHTML = "";
  cargarCards(arraySorted);
}

// Agrega selecciones al Shopping Cart
function addToCart(e) {
  const idProductos = e.target.id;
  const addedItem = productos.find((item) => item.id === idProductos);
  const yaAgregado = carrito.find((item) => item.id === addedItem.id);

  let cantSeleccionada = Number(
    document.querySelector(`#selectCantidad${idProductos}`).value
  );

  if (yaAgregado != undefined) {
    let index = carrito.indexOf(yaAgregado);
    // console.log(index);
    let cantidadAnterior = carrito[index].cantidad;
    // console.log(cantidadAnterior);
    carrito[index].cantidad = cantSeleccionada + cantidadAnterior;
  } else {
    addedItem.cantidad = cantSeleccionada;
    carrito.push(addedItem);
  }
  // console.log(carrito);
  comprarAhora.classList.remove("d-none");
  sumaTotal.innerHTML = calcPrecioTotal(carrito);
  carritoHTML(carrito);
  mostrarShoppingCart(carrito);
  //libreria toastify mensajitos de agregaste producto
  // Swal.fire({
  //   title: "¡Éxito!",
  //   text: "El producto ha sido agregado al carrito",
  //   icon: "success",
  //   confirmButtonText: "Aceptar",
  // });
  Toastify({
    text: "Producto agregado con éxito",
    duration: 2000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#009182",
      borderRadius: ".2rem",
      fontSize: ".85rem",
    },
    offset: {
      x: "0",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();
}

const calcPrecioTotal = (carrito) => {
  let precioTotal = 0;
  for (let i = 0; i < carrito.length; i++) {
    precioTotal += Number(carrito[i].precio) * Number(carrito[i].cantidad);
  }
  return precioTotal;
};

// Muestra /oculta el Shopping Cart--operadores ternarios
function mostrarShoppingCart(carrito) {
  carrito.length > 0
    ? cartWrapper.classList.remove("d-none")
    : cartWrapper.classList.add("d-none");
}

// Quita selecciones del Shopping Cart
function removeFromCart(e) {
  const idQuitar = e.target.id;
  const queIndexQuitar = carrito.findIndex((obj) => obj.id === idQuitar);
  // console.log(`index quitar: ${queIndexQuitar}`);
  if (queIndexQuitar > -1) {
    carrito.splice(queIndexQuitar, 1);
  }
  sumaTotal.innerHTML = calcPrecioTotal(carrito);
  carritoHTML(carrito);
  // console.log(carrito);
  mostrarShoppingCart(carrito);
  //toastify para boton de eliminar del carrito, mensaje eliminaste un prod
  Toastify({
    text: "Producto eliminado",
    duration: 2000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#6c757d",
      borderRadius: ".2rem",
      fontSize: ".85rem",
    },
    offset: {
      x: "0",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();
}

function actualizarBotones() {
  botonAgregar = document.querySelectorAll(".boton-agregar");
  botonAgregar.forEach((boton) => {
    boton.addEventListener("click", addToCart);
  });
  closeBtn = document.querySelectorAll(".close");
  closeBtn.forEach((boton) => {
    boton.addEventListener("click", removeFromCart);
    // console.log(closeBtn);
  });
}

function carritoHTML(addedItem) {
  shoppingCart.innerHTML = "";
  addedItem.forEach((item) => {
    let html = `<div class="chosen-item">
    <button class="btn-danger btn btn-sm close" id="${item.id}">X</button>
    <h3>${item.nombre}</h3>
    <p>Precio unitario: <strong>$${item.precio}</strong> </p>
    <p>Cantidad:<strong> ${item.cantidad} </strong></p>
    <p>Precio seleccion:<strong> $${item.precio * item.cantidad} </strong></p>
    <hr>
    </div>`;
    shoppingCart.innerHTML += html;
    // console.log(shoppingCart);
  });
  actualizarBotones();
}

function completarCompra(carrito) {
  comprarAhora.classList.add("d-none");
  carritoIcon.classList.add("d-none");
  shoppingCart.innerHTML = `<div id="confirmacion" class="confirmacion">
      <h3 class="mb-4">Deseas completar la compra por un <strong>total</strong> de <strong>$${calcPrecioTotal(
        carrito
      )}</strong>?</h3>
      <div class="row">
        <div class="col-6 justify-content-center d-flex">
          <button id="btnNo" class="btn btn-danger  me-2">No</button>
        </div>
        <div class="col-6 justify-content-center d-flex">
          <button id="btnSi" class="btn btn-success ">Si</button>
        </div> 
      </div>  
    </div>`;
  let btnNo = document.querySelector("#btnNo");
  btnNo.addEventListener("click", () => {
    cartWrapper.classList.add("d-none");
    limpiarCarrito();
    //sweetAlert despedida no compró
    Swal.fire({
      title: "Adiós",
      text: "¡Vuelve pronto!",
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
    // limpia el shoppingcart HTML
    shoppingCart.innerHTML = "";
    //vacío el carrito cuandp dice q no compra
    carrito = [];
    console.log(carrito);
    const calcPrecioTotal = 0;
  });
  let btnSi = document.querySelector("#btnSi");
  btnSi.addEventListener("click", () => {
    shoppingCart.innerHTML = "";
    cartWrapper.classList.add("d-none");
    limpiarCarrito();
    Swal.fire({
      title: "¡Felicidades por tu compra!",
      text: "Te enviaremos tus productos a la dirección registrada.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  });
}

//limpio carrito array
function limpiarCarrito() {
  carrito = [];
  shoppingCart.innerHTML = "";
  carritoHTML(carrito);
  // console.log(carrito);
}

// Ejecuciones

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  validar(inputUser.value, inputPass.value);
});

btnComprar.addEventListener("click", () => {
  logueado
    ? completarCompra(carrito)
    : Swal.fire({
        title: "¡Ingresa al sitio!",
        text: "¡Debes ingresar al sitio con tu usuario y contraseña para poder completar tu compra.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
});
