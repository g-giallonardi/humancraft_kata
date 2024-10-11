export default function Trend({changeRate, evolution}){

    const evolutionRate = Math.round((evolution-1)*100)

    return(
        <div>
            <span data-testid="trend-display">
                {`Current change rate : ${changeRate} (${evolutionRate>0? '+':''}${evolutionRate}%)`}
            </span>
        </div>
    )
}