import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const InvoicesPage = ({ user }) => {

  const [invoices, setInvoices] = useState([]);
  const [invoiceLines, setInvoiceLines] = useState([]);
  const [invoiceTotals, setInvoiceTotals] = useState({});

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/invoices');
        const userInvoices = response.data.value.filter((invoice) => invoice.UserId === user.UserId);
        setInvoices(userInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices();
  }, [user]);

  const handleInvoiceSelection = async (invoiceId) => {
    try {
      const [response1, response2] = await Promise.all([
        axios.get('https://bever-aca-assignment.azurewebsites.net/invoicelines'),
        axios.get('https://bever-aca-assignment.azurewebsites.net/products'),
      ]);
      const lines = response1.data.value.filter((line) => line.InvoiceId === invoiceId);
      const productData = response2.data.value;

      const productsWithLines = lines.map((line) => {
        const product = productData.find((prod) => prod.productId === line.productId);
        return { ...line, ...product };
      });

      setInvoiceLines(productsWithLines);

      const totalAmount = productsWithLines.reduce((total, item) => total + item.Price * item.Quantity, 0);
      setInvoiceTotals((prev) => ({ ...prev, [invoiceId]: totalAmount }));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className='flex flex-col' >
      <div className='flex justify-between items-center p-4 border-b border-grey-300'>
        <h2 className='border-grey-400'>Invoices for {user.Name}</h2>
        <button type="link" className="bg-blue-500 text-white px-5 rounded">
          <Link to="/">Log Out</Link>
        </button>
      </div>
      <table className="border border-gray-400 bg-slate-200	">
        <thead>
          <tr key={invoiceLines.invoicelineId}>
            <th className='border border-gray-400 px-5 py-2'>Select</th>
            <th className='border border-gray-400 px-5 py-2'>Name</th>
            <th className='border border-gray-400 px-5 py-2'>Paid Date</th>
            <th className='border border-gray-400 px-5 py-2'>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.invoiceId}>
              <td className="border border-gray-400 px-5 py-2 text-center">
                <input
                  type="radio"
                  name="selectedInvoice"
                  value={invoice.InvoiceId}
                  onChange={() => handleInvoiceSelection(invoice.InvoiceId)}
                />
              </td>
              <td className="border border-gray-400 px-5 py-2 text-center">{invoice.Name}</td> 
              <td className="border border-gray-400 px-5 py-2 text-center">{invoice.PaidDate}</td>
              <td className="border border-gray-400 px-5 py-2 text-center">{invoiceTotals[invoice.InvoiceId] || 'Select Invoice'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {invoiceLines.length > 0 && (
        <div className='flex flex-col justify-between items-center p-4 border-b border-grey-300'>
          <h3 className="mt-4">Invoice Lines</h3>
          <table className="border border-gray-400 bg-slate-200">
            <thead>
              <tr key={invoiceLines.invoiceLinesId}>
                <th className="border border-gray-400 px-5 py-2">Product</th>
                <th className="border border-gray-400 px-5 py-2">Price Per Unit</th>
                <th className="border border-gray-400 px-5 py-2">Quantity</th>
                <th className="border border-gray-400 px-5 py-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceLines.map((line) => (
                <tr key={line.productId}>
                  <td className="border border-gray-400 px-5 py-2 text-center">{line.Name}</td>
                  <td className="border border-gray-400 px-5 py-2 text-center">{line.Price}</td> 
                  <td className="border border-gray-400 px-5 py-2 text-center">{line.Quantity}</td> 
                  <td className="border border-gray-400 px-5 py-2 text-center">{line.Price * line.Quantity}</td>
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
