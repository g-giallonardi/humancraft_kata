import Trend from "./componants/Trend";
import {useEffect, useState} from "react";
import Calculator from "./componants/Calculator";

export default function Converter(){

    const INITIALCHANGERATE = 1.1
    const [changeRate, setChangeRate] = useState(INITIALCHANGERATE)
    const [rateEvolution, setRateEvolution] = useState(0)
    const CHANGERATEINTERVAL = 3000

    const updateChangeRate = () => {
        const ratio = Math.random() * 0.1 - 0.05
        setChangeRate(
            prevRate => {
                const newRate = Math.round((INITIALCHANGERATE + ratio)*100)/100

                setRateEvolution(newRate/prevRate)

                return newRate
            }

        );

    }

    useEffect(() => {
        const interval= setInterval(
                ()=> updateChangeRate()
            ,CHANGERATEINTERVAL)
        return () => {
            clearInterval(interval);
        };
    }, []);

    return(
        <div>
            <h3>Currencies converter</h3>
            <Trend changeRate={changeRate} evolution={rateEvolution} />
            <Calculator changeRate={changeRate} />
        </div>
    )
}