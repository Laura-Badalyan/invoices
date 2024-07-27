import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvoicesPage = ({ user }) => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceLines, setInvoiceLines] = useState([]);
  const [invoiceTotals, setInvoiceTotals] = useState({});

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/invoices');
        const userInvoices = response.data.value.filter((invoice) => invoice.Userld === user.Userld);
        setInvoices(userInvoices);

        // Calculate total amounts for each invoice
        const totals = {};
        for (const invoice of userInvoices) {
          const totalAmount = await calculateTotalAmount(invoice.InvoiceId);
          totals[invoice.InvoiceId] = totalAmount;
        }
        setInvoiceTotals(totals);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices();
  }, [user]);

  const calculateTotalAmount = async (invoiceId) => {
    try {
      const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/invoicelines');
      const lines = response.data.value.filter((line) => line.InvoiceId === invoiceId);
      const totalAmount = lines.reduce((sum, line) => sum + line.Quantity * line.Price, 0);
      return totalAmount;
    } catch (error) {
      console.error('Error calculating total amount:', error);
      return 0;
    }
  };

  const handleInvoiceSelection = async (invoiceId) => {
    setSelectedInvoice(invoiceId);
    try {
      const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/invoicelines');
      const lines = response.data.value.filter((line) => line.InvoiceId === invoiceId);
      setInvoiceLines(lines);
      console.log( lines);
    } catch (error) {
      console.error('Error fetching invoice lines:', error);
    }
  };

  return (
    <div>
      <h2>Invoices for {user.userName}</h2>
      <table>
        <thead>
          <tr key={user.InvoiceLineld}>
            <th>Select</th>
            <th>Name</th>
            <th>Paid Date</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.InvoiceId}>
              <td>
                <input
                  type="radio"
                  name="selectedInvoice"
                  value={invoice.InvoiceId}
                  onChange={() => handleInvoiceSelection(invoice.InvoiceId)}
                />
              </td>
              <td>{invoice.InvoiceName}</td>
              <td>{invoice.PaidDate}</td>
              <td>{invoiceTotals[invoice.InvoiceId] || 'Calculating...'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      { selectedInvoice && (
        <div>
          <h3>Invoice Lines for Invoice ID: {selectedInvoice}</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price Per Unit</th>
                <th>Quantity</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceLines.map((line) => (
                <tr key={line.InvoiceLineId}>
                  <td>{line.ProductName}</td>
                  <td>{line.Prise}</td>
                  <td>{line.Quantity}</td>
                  <td>{line.Prise * line.Quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
