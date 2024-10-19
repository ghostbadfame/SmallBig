
"use client"

import React, { useState, useEffect } from 'react';
import { Pagination } from '@/components/Pagination';
import { Lead } from '@/types';
import { loadRazorpay } from '@/lib/razorpay';

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads(currentPage);
  }, [currentPage]);

  const fetchLeads = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/leads?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const data = await response.json();
      setLeads(data.leads);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Failed to fetch leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevealEmail = async (leadId: number) => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); 
        throw new Error(`Failed to create payment order: ${errorMessage}`);
      }

      const orderData = await response.json();
      const razorpay = await loadRazorpay();

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Lead Email Reveal',
        description: 'Reveal lead email address',
        order_id: orderData.id,
        handler: async function (response: any) {
          const result = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderCreationId: orderData.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              leadId,
            }),
          });

          if (!result.ok) {
            const errorMessage = await result.text();
            throw new Error(`Payment verification failed: ${errorMessage}`);
          }
        
          const paymentResult = await result.json();
        

          if (paymentResult.isOk) {
            fetchLeads(currentPage);
          } else {
            throw new Error('Payment verification failed');
          }
        }
      };

      const paymentObject = new razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error revealing email:', error);
      alert('Failed to reveal email. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Company</th>
            <th className="py-3 px-6 text-left">Job Title</th>
            <th className="py-3 px-6 text-left">LinkedIn</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-left">Email</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {`${lead.firstName} ${lead.lastName}`}
              </td>
              <td className="py-3 px-6 text-left">{lead.companyName}</td>
              <td className="py-3 px-6 text-left">{lead.jobTitle}</td>
              <td className="py-3 px-6 text-left">
                <a href={lead.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Profile
                </a>
              </td>
              <td className="py-3 px-6 text-left">{lead.phoneNumber}</td>
              <td className="py-3 px-6 text-left">
                {lead.emailRevealed ? (
                  lead.emailAddress
                ) : (
                  <button
                    onClick={() => handleRevealEmail(lead._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-xs"
                  >
                    Reveal Email
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default LeadList;