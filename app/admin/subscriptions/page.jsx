"use client";
import SubTableItem from "@/components/AdminComponents/SubTableItem";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SubscriptionsPage = () => {
  const [emails, setemails] = useState([]);

  const fetchEmail = async () => {
    try {
      const response = await axios.get("/api/email");
      if (response.data.success) {
        setemails(response.data.subscriptions);
      } else {
        setemails([]);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      setemails([]);
    }
  };
  const deleteEmail = async (mongoId) => {
    try {
      const response = await axios.delete("/api/email", {
        params: {
          id: mongoId,
        },
        headers: {
          "x-admin-auth": "authenticated",
        },
      });
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchEmail();
      } else {
        toast.error("Failed to delete subscription");
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized access");
      } else {
        toast.error("Failed to delete subscription");
      }
    }
  };

  useEffect(() => {
    fetchEmail();
  }, []);
  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All Subscriptions</h1>
      <div className="relative max-w-[600px] h-[80vh] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-left">
            <tr>
              <th scope="col" className="px-6 py-3">
                Email Subscriptions
              </th>
              <th scope="col" className=" hidden sm:block px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {emails.map((item, index) => {
              return (
                <SubTableItem
                  key={index}
                  mongoId={item._id}
                  email={item.email}
                  date={item.date}
                  deleteEmail={deleteEmail}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
