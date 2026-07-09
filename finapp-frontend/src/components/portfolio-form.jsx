import { useState }
    from "react";

function PortFolioForm({
    onSave
}) {

    const [portfolio, setPortfolio] = useState({
        transactionId: "",
        symbol: "",
        companyName: "",
        assetType: "",
        transactionType: "",
        quantity: "",
        price: "",
        transactionDate: ""
    })

    const handleChange = e => setPortfolio({ ...portfolio, [e.target.name]: e.target.value });

    const submit = e => {

        e.preventDefault();
        onSave(portfolio);

        setPortfolio({
            transactionId: "",
            symbol: "",
            companyName: "",
            assetType: "",
            transactionType: "",
            quantity: "",
            price: "",
            transactionDate: ""
        });
    };

    return (

        <form onSubmit={submit}>

            <div className="row mt-2">
                <div className="col-md-3 mt-2">
                    <input
                        type="date"
                        name="transactionDate"
                        className="form-control"
                        value={portfolio.transactionDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-3 mt-2">
                    <input
                        type="text"
                        name="symbol"
                        placeholder="Symbol"
                        className="form-control"
                        value={portfolio.symbol}
                        onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6 mt-2">

                    <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        className="form-control"
                        value={portfolio.companyName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-3 mt-2">
                    <select
                        name="assetType"
                        className="form-control"
                        value={portfolio.assetType}
                        onChange={handleChange}
                        required>
                        <option value="">
                            Asset Type
                        </option>
                        <option value="Stock">
                            Stock
                        </option>

                        <option value="Bond">
                            Bond
                        </option>

                        <option value="Mutual Fund">
                            Mutual Fund
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>
                </div>
                <div className="col-md-3 mt-2">
                    <select
                        name="transactionType"
                        className="form-control"
                        value={portfolio.transactionType}
                        onChange={handleChange}
                        required>
                        <option value="">
                            Transaction Type
                        </option>
                        <option value="BUY">
                            BUY
                        </option>

                        <option value="SELL">
                            SELL
                        </option>
                    </select>
                </div>
                <div className="col-md-3 mt-2">
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        className="form-control"
                        value={portfolio.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-3 mt-2">
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="form-control"
                        value={portfolio.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-12 m-3">
                    <button
                        className=
                        "btn btn-success w-25 mb-3">
                        Add
                    </button>
                </div>
            </div>

        </form>
    );
}

export default PortFolioForm;