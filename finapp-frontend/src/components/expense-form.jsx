import { useState }
    from "react";

function ExpenseForm({

    onSave

}) {

    const [expense, setExpense] = useState({
        expenseId: "",
        category: "",
        description: "",
        amount: "",
        expenseDate: "",
        paymentType: ""
    });

    const handleChange =
        e => {

            setExpense({

                ...expense,

                [e.target.name]:
                    e.target.value
            });
        };

    const submit =
        e => {

            e.preventDefault();

            onSave(expense);

            setExpense({
                expenseId: "",
                category: "",
                description: "",
                amount: "",
                expenseDate: "",
                paymentType: ""
            });
        };

    return (

        <form onSubmit={submit}>

            <div className="row mt-3">

                <div className="col-md-2">

                    <input
                        type="date"
                        name="expenseDate"
                        className="form-control"
                        value={
                            expense.expenseDate
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                </div>
                <div className="col-md-2">

                    <select
                        name="category"
                        className="form-control"
                        value={expense.category}
                        onChange={handleChange}
                        required>

                        <option value="">
                            Select Category
                        </option>

                        <option value="Food">
                            Food
                        </option>

                        <option value="Travel">
                            Travel
                        </option>

                        <option value="Bills">
                            Bills
                        </option>

                        <option value="Shopping">
                            Shopping
                        </option>

                        <option value="Investment">
                            Investment
                        </option>

                        <option value="Healthcare">
                            Healthcare
                        </option>

                        <option value="HouseHold">
                            HouseHold
                        </option>

                        <option value="Entertainment">
                            Entertainment
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>
                </div>

                <div className="col-md-2">

                    <select
                        name="paymentType"
                        className="form-control"
                        value={expense.paymentType}
                        onChange={handleChange}
                        required>
                        <option value="">
                            Payment Type
                        </option>
                        <option value="Cash">
                            Cash
                        </option>

                        <option value="Account">
                            Account
                        </option>

                        <option value="Card">
                            Card
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                </div>
                <div className="col-md-3">

                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        className="form-control"
                        value={
                            expense.description
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                </div>

                <div className="col-md-2">

                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        className="form-control"
                        value={
                            expense.amount
                        }
                        onChange={
                            handleChange
                        }
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

export default ExpenseForm;