import { useState } from "react";

function ExpenseFilter({ onSearch }) {
    const [filter, setFilter] = useState({
        search:"",
        category:"",
        paymentType:""
    });

    const handleChange=e=>{
        setFilter({...filter,[e.target.name]:e.target.value});
    };

    return (
        <div className="row mb-3">
            <div className="col-md-4">
                <input
                    className="form-control"
                    name="search"
                    placeholder="Search description..."
                    value={filter.search}
                    onChange={handleChange}
                />
            </div>

            <div className="col-md-3">
                <select
                    className="form-select"
                    name="category"
                    value={filter.category}
                    onChange={handleChange}>
                    <option value="">All Categories</option>
                    <option value="FOOD">Food</option>
                    <option value="TRAVEL">Travel</option>
                    <option value="SHOPPING">Shopping</option>
                    <option value="BILLS">Bills</option>
                    <option value="HEALTHCARE">Healthcare</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                    <option value="INVESTMENT">Investment</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>

            <div className="col-md-3">
                <select
                    className="form-select"
                    name="paymentType"
                    value={filter.paymentType}
                    onChange={handleChange}>
                    <option value="">All Payments</option>
                    <option value="ACCOUNT">Account</option>
                    <option value="CARD">Card</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>

            <div className="col-md-2">
                <button
                    className="btn btn-primary w-100"
                    onClick={()=>onSearch(filter)}>
                    Search
                </button>
            </div>
        </div>
    );
}

export default ExpenseFilter;