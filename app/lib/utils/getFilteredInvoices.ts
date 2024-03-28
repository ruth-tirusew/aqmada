
import axios from 'axios';
import { Invoice } from '../../types';

const getFilteredInvoices = async (filter?: string, invoice?: Invoice[]) => {
    try {
      let invoices:Invoice[] = []
      if (invoice) {
        invoices = invoice;
      } else {
        const response = await axios.get('/api/invoice');
        invoices = response.data;
      }
  
      if (filter === "today") {
        invoices = invoices.filter((invoice:any) => {
          const invoiceDate = new Date(invoice.created_at).setHours(0, 0, 0, 0);
          const currentDate = new Date().setHours(0, 0, 0, 0);
          return invoiceDate === currentDate;
        });
      } else if (filter === "week") {
        const weekAgo = new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0);
        invoices = invoices.filter((invoice:any) => {
          const invoiceDate = new Date(invoice.created_at).setHours(0, 0, 0, 0);
          return invoiceDate >= weekAgo;
        });
      } else if (filter === "month") {
        const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0);
        invoices = invoices.filter((invoice:any) => {
          const invoiceDate = new Date(invoice.created_at).setHours(0, 0, 0, 0);
          return invoiceDate >= monthAgo;
        });
      }
  
      return invoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  };
  

  export default getFilteredInvoices;