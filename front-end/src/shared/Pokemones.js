import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemonesAccion, nextListPokemonesAccion } from '../redux/actions/pokemonAction';
import { getListAddress } from '../redux/actions/addressAction';

const Pokemones = () => {

    const dispatch = useDispatch();
                                              /*---- store.js----*/ /* pokemonReducer.js */
    const misPokemones = useSelector(store => store.lista_pokemones.arrayPokemones);     /* "useSelector" retorna todo lo que contiene mi almacenamiento "store" */
                                                                                         /* "store.lista_pokemones" proviene de "store.js" */
                                                                                         /* "arrayPokemones" es es "dataInitial" de "pokemonDucks.js" */
    const misAddress = useSelector(store => store.lista_address.arrayAddress);

    return (
        <div>
            Lista de pokemones
            <button onClick={ () => dispatch(getPokemonesAccion()) }> Obtener Pokemones </button>
            <button onClick={ () => dispatch(nextListPokemonesAccion()) }> Siguiente </button>
            <ul>
                {
                    misPokemones.map(elemento => (
                        <li key={elemento.name}>{elemento.name}</li>
                    ))
                }
            </ul>

            Lista de direcciones
            <button onClick={ () => dispatch(getListAddress()) }> Obtener direcciones </button>
            <ul>
                {
                    misAddress.map(elemento => (
                        <li key={elemento.address}>{elemento.address}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Pokemones;
