import HoldingsList from "../components/HoldingsList";
import HoldingsFilter from "../components/HoldingsFilter";

const Browse = () => {
    return (
        <div className="browse">
            <h1>Browse Collection</h1>
            <div className="holdings-content mt-4">
                <HoldingsFilter />
                <HoldingsList />
            </div>
        </div>
    )
}

export default Browse;