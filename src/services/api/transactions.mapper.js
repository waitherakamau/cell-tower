"use strict"

export default async (payload) => {
	let mapped           = {} //holds the converted value
	
	// Handle payload by type
	switch (payload.type) {
        case "buy-mpesa-float":
            if (payload.leg !== 'charges') {
                mapped = {
                    "transactionType": "buy-mpesa-float", 
                    "payload": {
                        "phoneNumber": payload["phone"],
                        "amount"            : payload["amount"],
                        "creditAccount"     : payload["account"],
                        "debitAccount"      : payload["debitAccount"],
                        "agentNumber"      : payload["agentNumber"]
                    }
                }
            }

            break;
        case "buy-goods-and-services":
            if (payload.leg !== 'charges') {
                mapped = {
                    "transactionType": "buy-goods-and-services", 
                    "payload": {
                        "phoneNumber": payload["phone"],
                        "amount"            : payload["amount"],
                        "creditAccount"     : payload["creditAccount"],
                        "debitAccount"      : payload["debitAccount"]
                    }
                }
            }

            break;
		case "paybill-lookup":
			mapped = {
				"transactionType": "paybill-lookup", 
				"payload": {
					"accountNumber": payload["account"]
				}
			}

			break;
        case "pay-bill":
            if (payload.leg !== 'charges') {
                mapped = {
                    "transactionType": "pay-bill", 
                    "payload": {
                        "phoneNumber": payload["phone"],
                        "amount"            : payload["amount"],
                        "paybill"           : payload["paybill"],
                        "account"           : payload["accountNumber"],
                        "debitAccount"      : payload["debitAccount"]
                    }
                }
            }

			break;
		// mobile money
		case "mpesa-c2b":

			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "mpesa-c2b-charges",
					"payload": {
						"phoneNumber": payload["phone"],
						"amount"            : payload["amount"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "mpesa-c2b", 
					"payload": {
						"phoneNumber": payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["phone"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

		break;
        case "deposit-from-mobile-money":

			if ( payload["account"].length === 10 && payload["account"].toString().startsWith("0")){
				payload["account"] = `254${payload["account"].slice(1)}`
			}

			let c2brequestName = "mpesa-c2b"

			if ( payload['mno'] === 'AIRTEL' ) {
				c2brequestName = 'airtel-c2b'
			}
            if (payload.leg === 'charges') {
                mapped = {
                    "transactionType":`${c2brequestName}-charges`,
                    "payload": {
                        "phoneNumber": payload["phone"],
						"amount"            : payload["amount"],
						"debitAccount"      : payload["debitAccount"]
                    }
                }
            }

            if (payload.leg !== 'charges') {
                mapped = {
                    "transactionType": c2brequestName, 
                    "payload": {
                        "phoneNumber": payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["phone"],
						"debitAccount"      : payload["debitAccount"]
                    }
                }
            }

            break;
		case "send-to-mobile-money":

			if ( payload["creditAccount"].trim().length === 10 && payload["creditAccount"].toString().startsWith("0")){
				payload["creditAccount"] = `254${payload["creditAccount"].slice(1)}`
			}

			let requestName = "send-to-airtel-money"

			if ( payload['mno'] === 'MPESA' ) {
				requestName = 'send-to-mpesa'
			}
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType":`${requestName}-charges`,
					"payload": {
						"phoneNumber": payload["phone"],
						"amount"            : payload["amount"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": requestName, 
					"payload": {
						"phoneNumber": payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["creditAccount"].trim(),
						"debitAccount"      : payload["debitAccount"],
						"receiverName"      : payload["receiverName"]
					}
				}
			}

		break;
		case "internal-account-lookup":
            if (payload.leg !== 'charges') {
                mapped = {
                    "transactionType": "internal-account-lookup", 
                    "payload": {
						"phoneNumber": payload["phone"],
						"debitAccount"      : payload["account"]
                    }
                }
            }

            break;
		case "account-lookup-validation":
				if (payload.leg !== 'charges') {
					mapped = {
						"transactionType": "account-lookup-validation", 
						"payload": {
							"coreAccount"   : payload["account"],
							"phone"			: payload["phone"],
							"id"			: payload["id"]
						}
					}
				}
	
				break;
		case "funds-transfer":
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "funds-transfer-charges",
					"payload": {
						"phoneNumber": payload["phone"],
						"debitAccount"      : payload["debitAccount"],
						"amount"            : payload["amount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "funds-transfer", 
					"payload": {
						"phoneNumber": payload["phone"],
						"amount"            : payload["amount"],
						"debitAccount"      : payload["debitAccount"],
						"customerId"        : payload["customerId"],
						"receiverName"      : payload["receiverName"] ,
						"receiverNumber"    : payload["receiverNumber"],
						"narration"         : payload["narration"],
						"creditAccount"     : payload["account"].replace(/[^0-9]/g,'')
					}
				}
			}

			break;
        
        // presentments
        case "kplc-post-paid-bill-presentment":
			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "kplc-post-paid-bill-presentment", 
					"payload": {
						"phoneNumber": payload["phone"],
						"creditAccount"     : payload["account"]
					}
				}
			}

			break;
        case "kplc-pre-paid-bill-presentment":
			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "kplc-pre-paid-bill-presentment", 
					"payload": {
						"phoneNumber": payload["phone"],
						"creditAccount"     : payload["account"]
					}
				}
			}

			break;
		case "nairobi-water-bill-presentment":
				if (payload.leg !== 'charges') {
					mapped = {
						"transactionType": "nairobi-water-bill-presentment", 
						"payload": {
							"phoneNumber": payload["phone"],
							"creditAccount"     : payload["account"]
						}
					}
				}
	
				break;
		case "nhif-bill-presentment":
			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "nhif-bill-presentment", 
					"payload": {
						"phoneNumber": payload["phone"],
						"memberType"        : payload["nhifMemberType"],
						"paymentType"       : payload["paymentType"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["account"]
					}
				}
			}

			break;
		case "gotv-bill-presentment":
			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "gotv-bill-presentment", 
					"payload": {
						"phoneNumber": payload["phone"],
						"creditAccount"     : payload["account"]
					}
				}
			}

			break;
		case "dstv-bill-presentment":
			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "dstv-bill-presentment", 
					"payload": {
						"phoneNumber": payload["phone"],
						"creditAccount"     : payload["account"]
					}
				}
			}

			break;
		case "landrates-bill-presentment":
			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "landrates-bill-presentment", 
					"payload": {
						"phoneNumber": payload["phone"],
						"creditAccount"     : payload["account"]
					}
				}
			}

			break;
        case "itax-bill-presentment":
            if (payload.leg !== 'charges') {
                mapped = {
                    "transactionType": "itax-bill-presentment", 
                    "payload": {
                        "phoneNumber": payload["phone"],
                        "eslip"             : payload["account"]
                    }
                }
            }

            break;
            
        // bills
        case "buy-airtime":

			if ( payload["creditAccount"].length === 10 && payload["creditAccount"].toString().startsWith("0")){
				payload["creditAccount"] = `254${payload["creditAccount"].slice(1)}`
			}

			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "buy-airtime-charges",
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"airtimeProvider"   : payload["airtimeProvider"],
						"debitAccount"      : payload["debitAccount"],
					}
				}
			}
			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "buy-airtime", 
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["creditAccount"],
						"receiverName"      : payload['receiverName'],
						"airtimeProvider"   : payload["airtimeProvider"],
						"debitAccount"      : payload["debitAccount"],
					}
				}
			}

			break;
        case "nhif-bill-payment":
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "nhif-bill-payment-charges",
					"payload": {
						"phoneNumber"		: payload["phone"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "nhif-bill-payment", 
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"presentmentRef"    : payload["presentmentReference"],
						"creditAccount"     : payload["account"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			break;
		case "nairobi-water-bill-payment":
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "nairobi-water-bill-payment-charges",
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "nairobi-water-bill-payment", 
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"presentmentRef"    : payload["presentmentReference"],
						"creditAccount"     : payload["account"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			break;
		case "zuku-tv-bill-payment":
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "zuku-tv-bill-payment-charges",
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "zuku-tv-bill-payment", 
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["account"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			break;
		case "zuku-internet-bill-payment":
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "zuku-internet-bill-payment-charges",
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "zuku-internet-bill-payment", 
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["account"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			break;
		case "gotv-bill-payment":
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "gotv-bill-payment-charges",
					"payload": {
						"phoneNumber"		: payload["phone"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "gotv-bill-payment", 
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["account"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			break;
		case "dstv-bill-payment":
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "dstv-bill-payment-charges",
					"payload": {
						"phoneNumber"		: payload["phone"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "dstv-bill-payment", 
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["account"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			break;
		case "jamii-telkom-bill-payment":
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "jamii-telkom-bill-payment-charges",
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "jamii-telkom-bill-payment", 
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["account"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			break;
		case "startimes-tv-bill-payment":
			if (payload.leg === 'charges') {
				mapped = {
					"transactionType": "startimes-tv-bill-payment-charges",
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			if (payload.leg !== 'charges') {
				mapped = {
					"transactionType": "startimes-tv-bill-payment", 
					"payload": {
						"phoneNumber"		: payload["phone"],
						"amount"            : payload["amount"],
						"creditAccount"     : payload["account"],
						"debitAccount"      : payload["debitAccount"]
					}
				}
			}

			break;
		
        case "ministatement": {
			mapped = {
				"transactionType": payload.type, 
				"payload": {
					"phoneNumber"		: payload["phoneNumber"],
					"debitAccount"		: payload["debitAccount"],
					"firstName"			: payload["phoneNumber"],
					"currency"			: payload["currency"]
				}
			}
        }
		break;
        case "balance": {
			mapped = {
				"transactionType": payload.type, 
				"payload": {
					"phoneNumber"		: payload["phoneNumber"],
					"debitAccount"		: payload["debitAccount"],
					"firstName"			: payload["phoneNumber"],
					"currency"			: payload["currency"]
				}
			}
        }
		break;
        case "account-activation": {
			mapped = {
				"transactionType": "account-activation", 
				"payload": {
					"username"			: payload["username"],
					"phoneNumber"		: payload["phoneNumber"],
					"password"			: payload["password"],
					"securityAnswers"	: payload["securityAnswers"]
				}
			}
        }
		break;
        case "verify-activation-token": {
			mapped = {
				"transactionType": "verify-activation-token", 
				"payload": {
					"activationToken"		: payload["token"]
				}
			}
        }
		break;
        case "account-validation": {
			mapped = {
				"transactionType": "account-validation", 
				"payload": {
					"phoneNumber"		: payload["phoneNumber"],
					"accountNumber"		: payload["accountNumber"],
					"idNumber"			: payload["idNumber"]
				}
			}
        }
		break;
        case "registration": {
			mapped = {
				"transactionType": "registration", 
				"payload": {
					"firstname"			: payload["firstname"],
					"phoneNumber"		: payload["phoneNumber"],
					"email"				: payload["email"],
					"productCode"		: payload["productCode"],
					"registrationDate"	: payload["registrationDate"],
					"gender"			: payload["gender"],
					"secondname"		: payload["secondname"],
					"accountType"		: payload["accountType"],
					"accountStatus"		: payload["accountStatus"],
					"currency"			: payload["currency"],
					"customerNumber"	: payload["customerNumber"],
					"idType"			: payload["idType"],
					"accountNumber"		: payload["accountNumber"],
					"lastname"			: payload["lastname"],
					"dateofBirth"		: payload["dateofBirth"],
					"branchCode"		: payload["branchCode"],
					"idNumber"			: payload["idNumber"],
					"kraPin"			: payload["kraPin"],
					"transactionLimit"	: payload["transactionLimit"],
					"dailyLimit"		: payload["dailyLimit"]
				}
			}
        }
		break;
	}

	return mapped

}