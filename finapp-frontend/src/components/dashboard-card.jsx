function DashboardCard({

    title,
    value

}) {

    return (

        <div className="col-md-3 mb-3">

            <div className="card shadow-sm">

                <div className="card-body">

                    <h4>{title}: {value}</h4>

                </div>

            </div>

        </div>
    );
}

export default DashboardCard;