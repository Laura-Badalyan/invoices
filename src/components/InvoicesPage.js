import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvoicesPage = ({ user }) => {

    const tableStyle = {
        border: '1px solid grey',
        padding: "5px 20px"
    };

    const container = {
        display: "flex",
        flexDirection: "column"
    }

    const [invoices, setInvoices] = useState([]);
    const [invoiceLines, setInvoiceLines] = useState([]);
    const [products, setProducts] = useState([]);
    const [invoiceTotals, setInvoiceTotals] = useState({});

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/invoices');
                const userInvoices = response.data.value.filter((invoice) => invoice.UserId === user.UserId);
                setInvoices(userInvoices);
                console.log("invoices", invoices);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };
        fetchInvoices();
    }, [user]);


      
    const handleInvoiceSelection = async (invoiceId, productId) => {
        try{
            const [response1, response2] = await Promise.all([
                axios.get('https://bever-aca-assignment.azurewebsites.net/invoicelines'),
                axios.get('https://bever-aca-assignment.azurewebsites.net/products')
            ]);
            const lines = response1.data.value.filter((line) => line.InvoiceId === invoiceId );
            const prods = response2.data.value.filter((prod) => prod.productId === productId);

            setInvoiceLines(lines);
            setProducts(prods);
             
        } catch (error){
            console.error('Error fetching products:', error)
        }
    };


    return (
        <div style={container}>
            <h2>Invoices for {user.Name}</h2>
            <table>
                <thead>
                    <tr key={user.invoiceId}>
                        <th style={tableStyle}>Select</th>
                        <th style={tableStyle}>Name</th>
                        <th style={tableStyle}>Paid Date</th>
                        <th style={tableStyle}>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.invoiceId}>
                            <td style={tableStyle}>
                                <input
                                    type="radio"
                                    name="selectedInvoice"
                                    value={invoice.InvoiceId}
                                    onChange={() => handleInvoiceSelection(invoice.InvoiceId, invoice.productId)
                                    }
                                />
                            </td>
                            <td style={tableStyle}>{invoice.Name}</td>
                            <td style={tableStyle}>{invoice.PaidDate}</td>
                            <td style={tableStyle}>{invoiceTotals[invoice.InvoiceId] || 'Calculating...'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {
                <div>
                    <h3>Invoice Lines </h3>
                    <table>
                        <thead>
                            <tr>
                                <th style={tableStyle}>Product</th>
                                <th style={tableStyle}>Price Per Unit</th>
                                <th style={tableStyle}>Quantity</th>
                                <th style={tableStyle}>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod, i) => (
                                <tr key={prod.productId}>
                                    <td style={tableStyle}>{prod.Name}</td>
                                    <td style={tableStyle}>{prod.Price}</td>
                                    <td style={tableStyle}>{invoiceLines[i].Quantity}</td>
                                    <td style={tableStyle}>{prod.Price * invoiceLines[i].Quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
};

export default InvoicesPage;