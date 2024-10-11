import {useRef, useState} from "react";

export default function Calculator( {changeRate}) {
    const CURRENCY_EUR = "EUR";
    const CURRENCY_USD = "USD";
    const EUR2USD = `${CURRENCY_EUR} > ${CURRENCY_USD}`
    const USD2EUR = `${CURRENCY_USD} > ${CURRENCY_EUR}`

    const [convertionDirection, setConvertionDirection] = useState(EUR2USD)
    const [inputAmountValue, setInputAmountValue] = useState(1)
    const [isChangeRateForced,setIsChangeRateForced] = useState(false)
    const [forcedChangeRateValue, setForcedChangeRateValue] = useState(changeRate)

    const [conversionResult, setConversionResult] = useState(null)


    const inputAmount = useRef()


    const swapCurrencies = () => {
        setConvertionDirection(
            prevDirection => {
                return prevDirection === EUR2USD ? USD2EUR : EUR2USD;
            }
        )
    }

    const handleChangeInputAmount = (event) =>{
        event.preventDefault();
        setInputAmountValue(inputAmount.current.value >= 0 ? inputAmount.current.value : 0 )
        setConversionResult(null)
    }

    const handleForcedChangeRateChange = () => {
        setIsChangeRateForced(prevState => !prevState);
        setForcedChangeRateValue(changeRate)
    }

    const handleChangeForcedChangeRate = (event) =>{
        setForcedChangeRateValue(event.target.value)
    }

    const convertCurrencies = event => {
        event.preventDefault();

        if (!inputAmountValue) {
            return;
        }

        let result = convertionDirection === EUR2USD ? inputAmountValue * changeRate : inputAmountValue / changeRate
        result = Math.round( result*100) /100

        setConversionResult(result )

    }

    return (
        <div>
            <div>
                <form onSubmit={convertCurrencies}>
                    <div>
                        <input data-testid="input-amount"
                               type="number"
                               ref={inputAmount}
                               onChange={handleChangeInputAmount}
                               value={inputAmountValue}
                        />
                        <input data-testid="display-swap-currencies" type="text" disabled value={convertionDirection}/>
                        <button
                            data-testid="button-swap-currencies"
                            type="button"
                            onClick={swapCurrencies}>
                            Swap currencies
                        </button>
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

            <div>
                <label>
                    Force custom change rate?
                    <input
                        data-testid="checkbox-force-change-rate"
                        type="checkbox"
                        checked={isChangeRateForced}
                        onChange={handleForcedChangeRateChange}
                    />
                </label>
                <div>
                    <input
                        data-testid="input-forced-change-rate-amount"
                        type="number"
                        style={{visibility: isChangeRateForced ? "visible" : "hidden"}}
                        value={forcedChangeRateValue}
                        onChange={e => handleChangeForcedChangeRate(e)}/>
                </div>
            </div>

            <div>
                {conversionResult &&
                    <div>
                        <h4>Result:</h4>
                        <div>
                            <span data-testid="result-source-amount-convertion">
                                {inputAmountValue}
                            </span>
                            <span data-testid="result-source-currency">
                                {convertionDirection === EUR2USD ? CURRENCY_EUR : CURRENCY_USD}
                            </span>
                            =
                        </div>
                        <div>
                            <span data-testid="result-target-amount-convertion">
                                {conversionResult}
                            </span>
                            <span data-testid="result-target-currency">
                                {convertionDirection === EUR2USD ? CURRENCY_USD : CURRENCY_EUR}
                            </span>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}