import { useEffect, useState } from 'react'

function App() {
  const [dolares, setDolares] = useState([]);
  const [casa, setCasa] = useState("");
  const [precio, setPrecio] = useState("");
  const [compraVenta, setCompraVenta] = useState("compra");

  useEffect(function(){
    async function fetchDolares() {
      const res = await fetch("https://dolarapi.com/v1/dolares");
      const data = await res.json();

      setDolares(data);
      setCasa(data[0]?.casa); 
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

  return (
    <>
      <Seccion titulo={"PRECIOS DÓLAR"}>
        <ListaDolar dolares={dolares} />
      </Seccion>

      <Seccion titulo={"CONVERTIR"}>
        <SelectorMoneda dolares={dolares} casa={casa} onChangeCasa={handleChangeCasa}/>
        <CardConversor moneda={"Pesos"}>
          <InputPrecio precio={precio} onChangePrecio={handleChangePrecio} />
        </CardConversor>
        <CardConversor moneda={"Dolar"}>
          <Precio precio={precio} dolares={dolares} casa={casa} tipo={compraVenta} />
          <CompraVenta tipo={compraVenta} onClickCompraVenta={handleClickCompraVenta} />
        </CardConversor>
      </Seccion>
    </>
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

function CardPrecioDolar({ nombre, compra, venta }) {
  return (
    <li>
      <h2>{nombre}</h2>
      <p>Compra ${compra}</p>
      <p>Venta ${venta}</p>
    </li>
  );
}

function ListaDolar({ dolares }) {
  return (
    <ul>
      {dolares.map(d => <CardPrecioDolar key={d.casa} nombre={d.nombre} compra={d.compra} venta={d.venta}/>)}
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

function SelectorMoneda({ dolares, casa, onChangeCasa }) {
  return (
    <select value={casa} onChange={(e) => onChangeCasa(e.target.value)}>
      {dolares.map(d => <option value={d.casa} key={d.casa}>{d.nombre}</option>)}
    </select>
  );
}

function Precio({ precio, dolares, casa, tipo }) {
  const dolar = dolares.find(d => d.casa === casa);

  const precioDolar = tipo === "compra" ? dolar?.compra : dolar?.venta;
  
  if (!precioDolar) return <p>-</p>;
  
  return (
    <p>
      {(precio / precioDolar).toFixed(4)}
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
      type="number"
      value={precio}
      onChange={(e) => onChangePrecio(Number(e.target.value))}
    />
  );
}

export default App
