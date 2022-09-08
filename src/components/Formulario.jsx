import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import useSelectMonedas from "../hooks/useSelectMonedas"
import { monedas } from '../data/monedas.js'
import Error from "./Error"

const InputSubmit = styled.input `
    background-color: #9497ff;
    border: none;
    width: 100%;
    padding: 10px;
    color: #fff;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 20px;
    border-radius: 5px;
    transition: background-color .3s ease;

    &:hover {
        background-color: #7A7DFE;
        cursor: pointer;
    }
`

const Formulario = ({setMonedas, setCargando}) => {

    const [ criptos, setCriptos ] = useState([])
    const [ error, setError ] = useState(false)

    const [ moneda, SelectMonedas ] = useSelectMonedas('Elige tu Moneda', monedas)
    const [ criptomoneda, SelectCriptomoneda ] = useSelectMonedas('Elige tu Criptomoneda', criptos)

    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
            const respuesta = await fetch(url)
            const resultado = await respuesta.json()

            const arrayCriptos = resultado.Data.map( cripto => {
                
                const objeto = {
                    id: cripto.CoinInfo.Name,
                    nombre: cripto.CoinInfo.FullName       
                }
                return objeto
            })
            setCriptos(arrayCriptos)
        }
        consultarAPI();
    }, [])
    
    const handleSubmit = e => {
        e.preventDefault()

        setCargando(true) //Activa el Spinner
    
        if ([moneda, criptomoneda].includes('')) {
            setError(true)
            setCargando(false) //Evita que se muestre el Spinner si hay Error
        }

        setTimeout(() => {
            setError(false)
        }, 3000);

        setMonedas({
            moneda,
            criptomoneda
        })

        setTimeout(() => {
            setCargando(false) //Quita el Spinner después de 3 segundos
        }, 3000);
    }

  return (

    <>
        {error && <Error><p>Todos los campos son obligatorios</p></Error>}
    
        <form
            onSubmit={handleSubmit}
        >

            <SelectMonedas />
            <SelectCriptomoneda />

            <InputSubmit 
                type="submit" 
                value="Cotizar"
            />
        </form>
    </>
  )
}

export default Formulario