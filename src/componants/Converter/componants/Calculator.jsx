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
    const [sysMessage, setSysMessage] = useState(null)
    const [conversionResult, setConversionResult] = useState(null)
    const [changeHistory, setChangehistory] = useState([])

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

    const updateChangeHistory = (inputAmount, convertedAmount, changeRate, usedChangeRate, convertionDirection) => {
        const inputAmountValueFormated = `${inputAmountValue} ${convertionDirection === EUR2USD ? CURRENCY_EUR : CURRENCY_USD}`
        const convertedAmountValueFormated = `${convertedAmount} ${convertionDirection === EUR2USD ? CURRENCY_USD : CURRENCY_EUR}`

        const historyInput = [
            inputAmountValueFormated,
            convertedAmountValueFormated,
            changeRate,
            usedChangeRate
        ]

        setChangehistory(
            (prevState) => {

                let copyArray = [...prevState]
                if (copyArray.length >= 5 ) copyArray = copyArray.slice(-4)

                return [...copyArray, historyInput];
            }
        )
    }

    const convertCurrencies = event => {
        event.preventDefault();

        if (!inputAmountValue) {
            return;
        }

        let usedChangeRate = isChangeRateForced? forcedChangeRateValue : changeRate

        if (isChangeRateForced){
            const changeRateRatio = Math.abs((forcedChangeRateValue / changeRate) - 1) * 100
            if (changeRateRatio > 2) {
                usedChangeRate = changeRate
            }
        }

        let convertedAmount = convertionDirection === EUR2USD ? inputAmountValue * usedChangeRate : inputAmountValue / usedChangeRate
        convertedAmount = Math.round( convertedAmount*100) /100

        updateChangeHistory(inputAmountValue, convertedAmount, changeRate, usedChangeRate, convertionDirection )
        setSysMessage(null)
        setConversionResult(convertedAmount )

        if (isChangeRateForced){
            const changeRateRatio = Math.abs((forcedChangeRateValue / changeRate) - 1) * 100
            if (changeRateRatio > 2) {
                setIsChangeRateForced(false)
                setForcedChangeRateValue(changeRate)
                setSysMessage('Custom rate is above 2% deviation. Cancelling forced rate.')
            }
        }
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
            {sysMessage &&
                <div>
                    Warning: <span data-testid="system-message">
                                {sysMessage}
                            </span>
                </div>
            }
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
            <hr/>
            <div>
                <h3>Change history</h3>
                <table data-testid="table-history">
                    <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Conversion</th>
                        <th>Actual rate</th>
                        <th>Forced rate</th>
                    </tr>
                    </thead>
                    <tbody>
                    {changeHistory.map(
                        (historyLine, index) => {
                            return (
                                <tr key={index}>
                                    <td>{historyLine[0]}</td>
                                    <td>{historyLine[1]}</td>
                                    <td>{historyLine[2]}</td>
                                    <td>{historyLine[3]}</td>
                                </tr>
                            )
                        }
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}