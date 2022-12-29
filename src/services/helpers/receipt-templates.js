export const Templates = [
    {
        type: "cash-withdrawal",
        meta: {
            margin: [0, 0, 0, 0],
            dimensions: {
                width: "8.5in",
                height: "11in"
            }
        },
        layout: [
            {
                type: "row",
                children: [
                    {
                        label: "Ref",
                        value: "transactionCode"
                    },
                    {
                        label: "Date",
                        value: "transactionDate"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Name",
                        value: "accountName"
                    },
                    {
                        label: "Phone",
                        value: "phoneNumber"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Amount",
                        value: "amount"
                    },
                    {
                        label: "Charges",
                        value: "totalCharge"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Total Amount",
                        value: "totalAmount"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Amount in words",
                        value: "amountInwords"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Signature(Client)",
                        value: ""
                    },
                    {
                        label: "Signature(Guichetier)",
                        value: ""
                    }
                ]
            }
        ]
    },
    
    {
        type: "cash-deposit",
        meta: {
            margin: [0, 0, 0, 0],
            dimensions: {
                width: "8.5in",
                height: "11in"
            }
        },
        layout: [
            {
                type: "row",
                children: [
                    {
                        label: "Ref",
                        value: "transactionCode"
                    },
                    {
                        label: "Date",
                        value: "transactionDate"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Name",
                        value: "accountName"
                    },
                    {
                        label: "Phone",
                        value: "phoneNumber"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Cr Account",
                        value: "creditAccount"
                    }
                ]
            }, 
            {
                type: "row",
                children: [
                    {
                        label: "Amount",
                        value: "amount"
                    },
                    {
                        label: "Charges",
                        value: "totalCharge"
                    }
                ]
            },   
            {
                type: "row",
                children: [
                    {
                        label: "Total Amount",
                        value: "totalAmount"
                    }
                ]
            }, 
            {
                type: "row",
                children: [
                    {
                        label: "Amount in words",
                        value: "amountInwords"
                    }
                ]
            },        
            {
                type: "row",
                children: [
                    {
                        label: "Signature(Client)",
                        value: ""
                    },
                    {
                        label: "Signature(Guichetier)",
                        value: ""
                    }
                ]
            }
        ]
    },
    
    {
        type: "cash-to-cash-withdrawal",
        meta: {
            margin: [0, 0, 0, 0],
            dimensions: {
                width: "8.5in",
                height: "11in"
            }
        },
        layout: [
            {
                type: "row",
                children: [
                    {
                        label: "Ref",
                        value: "transactionCode"
                    },
                    {
                        label: "Date",
                        value: "transactionDate"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Sender Name",
                        value: "senderName"
                    },
                    {
                        label: "Sender Phone",
                        value: "senderPhoneNumber"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Recipient Name",
                        value: "recepientName"
                    },
                    {
                        label: "Recipient Phone",
                        value: "receivierPhoneNumber"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Customer Id Type",
                        value: "idType"
                    },
                    {
                        label: "Customer Phone",
                        value: "idNumber"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Amount",
                        value: "amount"
                    },
                    {
                        label: "Charges",
                        value: "totalCharge"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "City",
                        value: "city"
                    },
                    {
                        label: "Reason",
                        value: "narration"
                    }                  
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Total Amount",
                        value: "totalAmount"
                    }                  
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Amount in words",
                        value: "amountInwords"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Signature(Client)",
                        value: ""
                    },
                    {
                        label: "Signature(Guichetier)",
                        value: ""
                    }
                ]
            }
        ]
    },
    
    {
        type: "token-withdrawal",
        meta: {
            margin: [0, 0, 0, 0],
            dimensions: {
                width: "8.5in",
                height: "11in"
            }
        },
        layout: [
            {
                type: "row",
                children: [
                    {
                        label: "Ref",
                        value: "transactionCode"
                    },
                    {
                        label: "Date",
                        value: "transactionDate"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Sender Name",
                        value: "senderName"
                    },
                    {
                        label: "Sender Phone",
                        value: "senderPhoneNumber"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Recipient Name",
                        value: "recepientName"
                    },
                    {
                        label: "Recipient Phone",
                        value: "receivierPhoneNumber"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Amount",
                        value: "amount"
                    },
                    {
                        label: "Charges",
                        value: "totalCharge"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Total Amount",
                        value: "totalAmount"
                    }                  
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Amount in words",
                        value: "amountInwords"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Signature(Client)",
                        value: ""
                    },
                    {
                        label: "Signature(Guichetier)",
                        value: ""
                    }
                ]
            }
        ]
    },
    
    {
        type: "cash-to-cash-deposit",
        meta: {
            margin: [0, 0, 0, 0],
            dimensions: {
                width: "8.5in",
                height: "11in"
            }
        },
        layout: [
            {
                type: "row",
                children: [
                    {
                        label: "Ref",
                        value: "transactionCode"
                    },
                    {
                        label: "Date",
                        value: "transactionDate"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Sender Name",
                        value: "senderName"
                    },
                    {
                        label: "Sender Phone",
                        value: "senderPhoneNumber"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Recipient Name",
                        value: "recepientName"
                    },
                    {
                        label: "Recipient Phone",
                        value: "receivierPhoneNumber"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Amount",
                        value: "amount"
                    },
                    {
                        label: "Charges",
                        value: "totalCharge"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Total Amount",
                        value: "totalAmount"
                    }
                ]
            },  
            {
                type: "row",
                children: [
                    {
                        label: "Narration",
                        value: "narration"
                    }                
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Amount in words",
                        value: "amountInwords"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Signature(Client)",
                        value: ""
                    },
                    {
                        label: "Signature(Guichetier)",
                        value: ""
                    }
                ]
            }
        ]
    },
    
    {
        type: "cash-collections",
        meta: {
            margin: [0, 0, 0, 0],
            dimensions: {
                width: "8.5in",
                height: "11in"
            }
        },
        layout: [
            {
                type: "row",
                children: [
                    {
                        label: "Ref",
                        value: "transactionCode"
                    },
                    {
                        label: "Date",
                        value: "transactionDate"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Institution Category",
                        value: "institutionCategory"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Institution",
                        value: "institution"
                    },
                    {
                        label: "Service",
                        value: "service"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Institution Account",
                        value: "institutionAccount"
                    },
                    {
                        label: "Institution Branch",
                        value: "institutionBranch"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Amount",
                        value: "amount"
                    },
                    {
                        label: "Charges",
                        value: "totalCharge"
                    }
                ]
            },
            {
                type: "row",
                children: [
                    {
                        label: "Total Amount",
                        value: "totalAmount"
                    }
                ]
            }, 
            {
                type: "row",
                children: [
                    {
                        label: "Amount in words",
                        value: "amountInwords"
                    }
                ]
            }, 
            {
                type: "row",
                children: [
                    {
                        label: "Signature(Client)",
                        value: ""
                    },
                    {
                        label: "Signature(Guichetier)",
                        value: ""
                    }
                ]
            }
        ]
    }
];
