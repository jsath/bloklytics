import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Axios from 'axios'

const CoinInfo = (props) => {
    const[id, setId] = useState(props.id);
    const[coin, setCoin] = useState();

    useEffect(() => {
        Axios.get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false`).then(
            (res) => {setCoin(res.data)}
        )
    }, [id]);

  return (
    <>
    {coin ?
    <>
    <div>
    <div>
    {coin.image? <img src={coin.image.small} alt={coin.name} />: ''}
    <h1>{coin.name}</h1>
    </div>
    <p dangerouslySetInnerHTML={{ __html: coin.description.en }}></p>
    </div>
    </>
    :
    <></>
    }
    </>

  )
}

export default CoinInfo

