import { useEffect, useState } from 'react'

function App() {
  const [dolares, setDolares] = useState([]);
  const [casa, setCasa] = useState("");
  const [precio, setPrecio] = useState("");
  const [compraVenta, setCompraVenta] = useState("compra");
  const [cargando, setCargando] = useState(true);

  useEffect(function(){
    async function fetchDolares() {
      setCargando(true);
      const res = await fetch("https://dolarapi.com/v1/dolares");
      const data = await res.json();

      setDolares(data);
      setCasa(data[0]?.casa); 
      setCargando(false);
    }
    fetchDolares();    
  }
  , []);

  function handleChangePrecio(nuevoPrecio) {
    setPrecio(nuevoPrecio);
  }

  function handleChangeCasa(nuevaCasa) {
    setCasa(nuevaCasa);
  }

  function handleClickCompraVenta(nuevoTipo) {
    setCompraVenta(nuevoTipo);
  }

const nombreDolar = dolares.find(d => d.casa === casa) || "";

  return (
    <>
      <Seccion titulo={"PRECIOS DÓLAR"}>
        {cargando ? <Cargando /> : <ListaDolar dolares={dolares} casa={casa} onChangeCasa={handleChangeCasa} />}
      </Seccion>

      <Seccion titulo={"CONVERTIR"}>
        {/*<SelectorMoneda dolares={dolares} casa={casa} onChangeCasa={handleChangeCasa}/>*/}
        <CardConversor moneda={"Pesos"}>
          <InputPrecio precio={precio} onChangePrecio={handleChangePrecio} />
        </CardConversor>
        <CardConversor moneda={cargando ? "-" : `Dolar ${nombreDolar.nombre}`}>
          <Precio precio={precio} dolares={dolares} casa={casa} tipo={compraVenta} />
          <CompraVenta tipo={compraVenta} onClickCompraVenta={handleClickCompraVenta} />
        </CardConversor>
      </Seccion>
      <Footer />
    </>
  );
}

function Cargando() {
  return (
    <h1>Cargando...</h1>
  );
}

function Seccion({ titulo, children }) {
  return (
    <div>
      <h1>{titulo}</h1>
      {children}
    </div>
  );
}

function CardPrecioDolar({ nombre, compra, venta, casa, onChangeCasa, className={className} }) {
  return (
    <li className={className} onClick={() => onChangeCasa(casa)}>
      <h2>{nombre}</h2>
      <p>Compra ${compra}</p>
      <p>Venta ${venta}</p>
    </li>
  );
}

function ListaDolar({ dolares, casa, onChangeCasa }) {
  return (
    <ul>
      {dolares.map(d => <CardPrecioDolar className={d.casa === casa ? "card active" : "card"}key={d.casa} nombre={d.nombre} compra={d.compra} venta={d.venta} casa={d.casa} onChangeCasa={onChangeCasa}/>)}
    </ul>
  );
}

function CardConversor({ moneda, children }) {
  return (
    <div>
      <h2>{moneda}</h2>
      {children}
    </div>
  );
}

/*function SelectorMoneda({ dolares, casa, onChangeCasa }) {
  return (
    <select value={casa} onChange={(e) => onChangeCasa(e.target.value)}>
      {dolares.map(d => <option value={d.casa} key={d.casa}>{d.nombre}</option>)}
    </select>
  );
}*/

function Precio({ precio, dolares, casa, tipo }) {
  const dolar = dolares.find(d => d.casa === casa);

  const precioDolar = tipo === "compra" ? dolar?.compra : dolar?.venta;
  
  if (!Number(precio)) return <p>-</p>;
  
  return (
    <p>
      {(precio / Number(precioDolar)).toFixed(4)}
    </p>
  );
}

function CompraVenta({ tipo, onClickCompraVenta }) {
  return (
    <>
      <button className={tipo === "compra" ? "active" : ""} onClick={() => onClickCompraVenta("compra")}>Compra</button>
      <button className={tipo === "venta" ? "active" : ""} onClick={() => onClickCompraVenta("venta")}>Venta</button>
    </>
  );
}

function InputPrecio( {precio, onChangePrecio} ) {
  return (
    <input 
      type="text"
      value={precio}
      onChange={(e) => onChangePrecio(e.target.value)}
    />
  );
}

function Footer() {
  return( 
    <footer>
      <p>Datos provistos por <a href="https://dolarapi.com" target="_blank">DolarApi.com</a></p>
</footer>);
}

export default App
