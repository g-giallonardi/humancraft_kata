import {useRef, useState} from "react";

export default function Calculator( {changeRate}) {
    const CURRENCY_EUR = "EUR";
    const CURRENCY_USD = "USD";
    const EUR2USD = `${CURRENCY_EUR} > ${CURRENCY_USD}`
    const USD2EUR = `${CURRENCY_USD} > ${CURRENCY_EUR}`

    const [convertionDirection, setConvertionDirection] = useState(EUR2USD)
    const [inputAmountValue, setInputAmountValue] = useState(1)
    const inputAmount = useRef()


    const swapCurrencies = () => {

    }

    const handleChangeInputAmount = (event) =>{

    }

    const convertCurrencies = event => {

    }

    return (
        <div>
            <div>
                <form onSubmit={convertCurrencies}>
                    <div>
                        <input data-testid="input-amount" type="number" ref={inputAmount}
                               onChange={handleChangeInputAmount}/>
                        <input  data-testid="display-swap-currencies" type="text" disabled value={convertionDirection}/>
                        <button data-testid="button-swap-currencies" type="button" onClick={swapCurrencies}>Swap currencies</button>
                    </div>
                    <div>
                        <button
                            data-testid="button-conversion"
                            type="submit"
                            disabled={!inputAmountValue}>
                            Convert
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}