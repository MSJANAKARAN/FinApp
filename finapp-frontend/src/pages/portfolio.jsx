import PortFolioForm from "../components/portfolio-form";
import { useEffect, useState } from "react";
import { addTransaction, updateTransaction, deleteSelected, getPortfolioTransactions } from "../api/portfolio";
import Navbar from "../components/navbar";
import { useToast } from "../components/toast-context";
import { Modal } from "bootstrap";

function Portfolio() {

    const [portfolio, setPortfolio] = useState([]);
    const [selectedPortfolios, setSelectedPortfolios] = useState([]);
    const [filteredPortfolios, setFilteredPortfolios] = useState([]);
    const [search, setSearch] = useState("");
    const [assetFilter, setAssetFilter] = useState("");
    const [transactionFilter, setTransactionFilter] = useState("");
    const [selectedPortfolio, setSelectedPortfolio] = useState({ transactionId: "", symbol: "", companyName: "", assetType: "", transactionType: "", quantity: "", price: "", transactionDate: "" });
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentPortfolios = filteredPortfolios.slice(firstIndex, lastIndex);
    const totalPages = Math.max(1, Math.ceil(filteredPortfolios.length / recordsPerPage));

    const addPortfolio = portfolio => {
        addTransaction(portfolio);
        loadPortfolio();
    };
    const updateTransaction = async portfolio => {
        await addTransaction(portfolio);
        loadPortfolio();
    };
    const loadPortfolio = async () => {
        let response = await getPortfolioTransactions();

        setSearch("");
        setAssetFilter("");
        setTransactionFilter("");
        setPortfolio(response.data);
        setFilteredPortfolios(response.data);
        setSelectedPortfolio([]);
        setCurrentPage(1);

    };

    useEffect(() => {
        loadPortfolio();
    }, []);

    const openEditModal = portfolio => {
        setSelectedPortfolio({ ...portfolio });

        const modal = new Modal(
            document.getElementById("editPortfolioModal")
        );

        modal.show();
    };

    const updatePortfolioData = async () => {

        await updateTransaction(selectedPortfolio.transactionId, selectedPortfolio).then(
            data => {
                showToast("Portfolio Management", "Portfolio updated successfully.", "success");
            }
        ).catch(
            error => showToast("Portfolio Management", error.response.data.message, "danger")
        );

        const modal = Modal.getInstance(
            document.getElementById("editPortfolioModal")
        );

        modal.hide();

        loadPortfolio();
    };

    const handleEditChange = e => {
        setSelectedPortfolio({
            ...selectedPortfolio,
            [e.target.name]: e.target.value
        });
    };

    const openDeleteModal = (selectedPortfolios) => {
        setSelectedPortfolio({ ...selectedPortfolios });

        const modalElement = document.getElementById("openDeleteModal");

        console.log(modalElement);

        if (!modalElement) return;

        const modal = Modal.getOrCreateInstance(modalElement);
        modal.show();
    };

    const deleteSelectedData = async () => {

        await deleteSelected(selectedPortfolios).then(
            data => {
                showToast("Portfolio Management", "Selected portfolios deleted successfully.", "success");
            }
        ).catch(
            error => showToast("Portfolio Management", error.response.data.message, "danger")
        );

        const modal = Modal.getInstance(
            document.getElementById("openDeleteModal")
        );

        modal.hide();
        setSelectedPortfolios([]);
        loadPortfolio();
    };


    const toggleSelection = transactionId => {
        setSelectedPortfolios(prev =>
            prev.includes(transactionId)
                ? prev.filter(id => id !== transactionId)
                : [...prev, transactionId]
        );
    };
    const toggleSelectAll = () => {
        const currentIds = currentPortfolios.map(portfolio => portfolio.transactionId);

        const allSelected = currentIds.every(id =>
            selectedPortfolios.includes(id)
        );

        if (allSelected) {
            setSelectedPortfolios(prev =>
                prev.filter(id => !currentIds.includes(id))
            );
        } else {
            setSelectedPortfolios(prev => [
                ...new Set([...prev, ...currentIds])
            ]);
        }
    };

    const applyFilters = (
        searchValue = search,
        assetType = assetFilter,
        transactionType = transactionFilter
    ) => {

        let data = [...portfolio];

        if (searchValue.trim() !== "") {
            data = data.filter(portfolio => {
                (portfolio.symbol || "").toLowerCase().includes(searchValue.toLowerCase()) ||
                    (portfolio.companyName || "").toLowerCase().includes(searchValue.toLowerCase())

            }
            );
        }

        if (assetType !== "") {
            data = data.filter(portfolio =>
                portfolio.assetType === assetType
            );
        }

        if (transactionType !== "") {
            data = data.filter(portfolio =>
                portfolio.paymentType === transactionType
            );
        }

        setFilteredPortfolios(data);
    };

    const handleSearch = e => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
        applyFilters(value, assetFilter, transactionFilter);
    };

    const handleAssetFilter = e => {
        const value = e.target.value;
        setAssetFilter(value);
        setCurrentPage(1);
        applyFilters(search, value, assetFilter);
    };

    const handleTransactionFilter = e => {
        const value = e.target.value;
        setTransactionFilter(value);
        setCurrentPage(1);
        applyFilters(search, transactionFilter, value);
    };

    const sortPortfolio = field => {

        let direction = "asc";

        if (sortField === field && sortDirection === "asc") {
            direction = "desc";
        }

        setSortField(field);
        setSortDirection(direction);

        const sorted = [...filteredPortfolios].sort((a, b) => {

            let valueA = a[field];
            let valueB = b[field];

            if (field === "price") {
                return direction === "asc"
                    ? Number(valueA) - Number(valueB)
                    : Number(valueB) - Number(valueA);
            }

            if (field === "transactionDate") {
                return direction === "asc"
                    ? new Date(valueA) - new Date(valueB)
                    : new Date(valueB) - new Date(valueA);
            }

            valueA = valueA?.toString().toLowerCase();
            valueB = valueB?.toString().toLowerCase();

            if (direction === "asc") {
                return valueA.localeCompare(valueB);
            }

            return valueB.localeCompare(valueA);
        });

        setFilteredPortfolios(sorted);
        setCurrentPage(1);
    };

    const getSortIcon = field => {

        if (sortField !== field) {
            return <i className="bi bi-arrow-down-up ms-1"></i>;
        }

        return sortDirection === "asc"
            ? <i className="bi bi-sort-alpha-down ms-1"></i>
            : <i className="bi bi-sort-alpha-up ms-1"></i>;
    };

    return (


        <div className="container mt-4">

            <Navbar title="Portfolio Management">
            </Navbar>
            < PortFolioForm portfolio={selectedPortfolio} onSave={addPortfolio} />

            <div className="col-md-12 d-flex justify-content-end">
                <div className="col-md-4 pe-3 justify-content-start">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Portfolio..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <div className="col-md-3 pe-3">
                    <select
                        className="form-select"
                        value={assetFilter}
                        onChange={handleAssetFilter}>
                        <option value="">All Assets</option>
                        <option value="Stock">Stock</option>
                        <option value="Bond">Bond</option>
                        <option value="MutualFund">Mutual Fund</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="col-md-3 pe-3">
                    <select
                        className="form-select"
                        value={transactionFilter}
                        onChange={handleTransactionFilter}>
                        <option value="">All Transaction Types</option>
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                    </select>
                </div>
                <div className="col-md-2 justify-content-end">
                    <button
                        className="btn btn-danger"
                        disabled={selectedPortfolios.length === 0}
                        onClick={() => openDeleteModal(selectedPortfolios)}>
                        Delete Selected ({selectedPortfolios.length})
                    </button>
                </div>
            </div>

            <table
                className=
                "table table-bordered mt-3">

                <thead>

                    <tr>
                        <th>
                                <input className="form-check-input"
                                    type="checkbox"
                                    checked={
                                        currentPortfolios.length > 0 &&
                                        currentPortfolios.every(portfolio =>
                                            selectedPortfolios.includes(portfolio.transactionId)
                                        )
                                    }
                                    onChange={toggleSelectAll}
                                />
                            </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("symbol")}>
                            Symbol {getSortIcon("symbol")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("companyName")}>
                            Company Name {getSortIcon("companyName")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("assetType")}>
                            Asset Type {getSortIcon("assetType")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("transactionType")}>
                            Transaction Type {getSortIcon("transactionType")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("quantity")}>
                            Quantity {getSortIcon("quantity")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("price")}>
                            Price {getSortIcon("price")}
                        </th>
                        <th style={{ cursor: "pointer" }} onClick={() => sortPortfolio("transactionDate")}>
                            Date {getSortIcon("transactionDate")}
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {currentPortfolios.length > 0 ? (
                        currentPortfolios.map(
                            portfolio => (

                                <tr
                                    key={
                                        portfolio.transactionId
                                    }>
                                    <td>
                                        <input className="form-check-input" type="checkbox"
                                            checked={selectedPortfolios.includes(portfolio.transactionId)}
                                            onChange={() => toggleSelection(portfolio.transactionId)} />
                                    </td>
                                    <td>
                                        {portfolio.symbol}
                                    </td>

                                    <td>
                                        {portfolio.companyName}
                                    </td>
                                    <td>
                                        {portfolio.assetType}
                                    </td>
                                    <td>
                                        {portfolio.transactionType}
                                    </td>
                                    <td>
                                        {portfolio.quantity}
                                    </td>
                                    <td>
                                        ₹{portfolio.price}
                                    </td>

                                    <td>
                                        {portfolio.transactionDate}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-info btn-sm me-3"
                                            onClick={() => openEditModal(portfolio)}>
                                            Edit
                                        </button>

                                    </td>
                                </tr>
                            ))
                    ) : (<tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                            <i className="bi bi-inbox fs-1"></i>
                            <br />
                            No portfolio found matching your search criteria.
                        </td>
                    </tr>)
                    }
                </tbody>

            </table>
        </div>
    )
}

export default Portfolio;