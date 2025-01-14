import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FundProject.css';

function FundProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const token = localStorage.getItem('token');

    const handleSubmit = (event) => {
        event.preventDefault();

        const pledgeRequest = {
            amount: parseFloat(amount),
            cardNumber,
            expiryDate,
            cvv,
            nameOnCard
        };

        axios.post(`http://localhost:5000/api/projects/${id}/pledge`, pledgeRequest, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log('Success:', response.data);
                alert('Transaction successful! Thank you for your pledge.');
                navigate(`/projects/${id}`);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Transaction failed. Please try again.');
            });
    };

    return (
        <div className="fund-project-page">
            <h2>Fund Project</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <label htmlFor="cardNumber">Card Number</label>
                <input
                    type="text"
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                />
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                />
                <label htmlFor="cvv">CVV</label>
                <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                />
                <label htmlFor="nameOnCard">Name on Card</label>
                <input
                    type="text"
                    id="nameOnCard"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default FundProject;