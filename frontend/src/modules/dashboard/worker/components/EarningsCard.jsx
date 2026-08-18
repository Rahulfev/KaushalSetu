import React from 'react';

const EarningsCard = ({ amount, status, date }) => {
    const isLocked = status === 'ESCROW_HELD';

    return (
        <div className="card border-0 shadow-sm mb-3 overflow-hidden">
            <div className={`card-header border-0 ${isLocked ? 'bg-warning text-dark' : 'bg-success text-white'} py-2 small fw-bold`}>
                {isLocked ? '🛡️ HELD IN ESCROW' : '✅ RELEASED TO WALLET'}
            </div>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h3 className="fw-bold mb-0">₹{amount.toLocaleString()}</h3>
                        <p className="text-muted small mb-0">Transaction Date: {date}</p>
                    </div>
                    <div className={`fs-1 ${isLocked ? 'text-warning' : 'text-success'} opacity-25`}>
                        <i className={`bi ${isLocked ? 'bi-lock-fill' : 'bi-cash-stack'}`}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsCard;